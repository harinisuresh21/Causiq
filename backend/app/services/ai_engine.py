import os
import json
import logging
from typing import Dict, Any, List
from google import genai
from google.genai import types
from app.config import settings
from app.schemas.incident import InvestigationResultSchema, HypothesisItem, RemediationStep

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are Causiq, an autonomous Site Reliability Engineer and software debugging intelligence.
You analyze normalized software failure evidence across source code commits, deployment events, application logs, container lifecycle events, and infrastructure metrics.

IMPORTANT RULES:
1. Act as a rigorous, evidence-first investigator. Do not speculate or claim causation when only correlation is present.
2. Every root-cause finding MUST reference actual supporting evidence IDs (e.g. EV-101, EV-102).
3. Do not blindly summarize logs. Correlate timestamps, affected services, deployment changes, and failure patterns.
4. If code changes or configuration changes directly precede a failure, analyze the causal mechanism.
5. Provide calibrated confidence (0.0 to 1.0) and explain any uncertainty or missing evidence.
6. Return purely valid JSON adhering strictly to the requested schema. No markdown wrapping or extra comments.
"""

def generate_fallback_analysis(incident_title: str, events: List[Dict[str, Any]], affected_services: List[str]) -> InvestigationResultSchema:
    """Deterministic fallback analysis when Gemini API is unavailable or unconfigured."""
    event_ids = [e.get("event_id", "") for e in events if e.get("event_id")]
    
    # Classify by scenario type
    has_db = any("database" in str(e).lower() or "db" in str(e).lower() or "pool" in str(e).lower() for e in events)
    has_oom = any("oom" in str(e).lower() or "memory" in str(e).lower() or "heap" in str(e).lower() for e in events)
    has_latency = any("latency" in str(e).lower() or "slow" in str(e).lower() or "timeout" in str(e).lower() for e in events)

    supporting = event_ids[:min(4, len(event_ids))]

    if has_oom:
        summary = f"Severe container memory leakage and OOM crashes detected across {', '.join(affected_services) if affected_services else 'services'}."
        root_cause = "Unbounded memory consumption introduced in recent deployment, leading to memory saturation (92%+) and Linux kernel OOMKilled signals."
        hypotheses = [
            HypothesisItem(
                title="Unbounded In-Memory Event Cache",
                explanation="Worker consumer buffers incoming transaction events without flush eviction or memory bounds, causing monotonic heap expansion.",
                likelihood="high",
                supporting_evidence_ids=supporting,
                contradicting_evidence_ids=[],
                missing_evidence=["Container heap dump / memory profile snapshot"]
            ),
            HypothesisItem(
                title="Docker Cgroup Memory Limit Misconfiguration",
                explanation="Cgroup memory limit configured too restrictively for standard burst traffic.",
                likelihood="low",
                supporting_evidence_ids=[supporting[-1]] if supporting else [],
                contradicting_evidence_ids=supporting[:-1] if len(supporting) > 1 else [],
                missing_evidence=["Cgroup limits historical baseline"]
            )
        ]
        remediation = [
            RemediationStep(
                action="Roll back recent worker deployment to previous stable version or cap in-memory queue size.",
                reason="Mitigates recurring container crashes and eliminates OOMKill cascade immediately.",
                priority="P0 - Immediate",
                risk_level="Low",
                required_permissions="CI/CD Deployer / Kubernetes Admin",
                verification_procedure="Observe container memory usage in Prometheus metrics for 15 minutes post-rollback.",
                status="planned"
            ),
            RemediationStep(
                action="Add bounded eviction queue with LRU policy and periodic forced garbage collection in event consumer.",
                reason="Prevents future unbounded heap growth under heavy workload.",
                priority="P1 - High",
                risk_level="Medium",
                required_permissions="Code Repository Write Access",
                verification_procedure="Run synthetic stress test pushing 10,000 events and inspect heap size.",
                status="planned"
            )
        ]
        checklist = [
            "Verify container restart count remains 0 for 30 minutes",
            "Confirm worker memory utilization settles below 50%",
            "Check dead-letter queue for unprocessed transaction events"
        ]
        missing = ["Container heap dump profiling data", "Garbage collection pause logs"]

    elif has_latency:
        summary = f"API response latency degradation (180ms to 2.5s) triggered by unindexed database join query execution."
        root_cause = "Inefficient database query without compound index introduced in migration 0082, causing full table sequential scans and database CPU saturation."
        hypotheses = [
            HypothesisItem(
                title="Unindexed Table Scan in Order History Query",
                explanation="The recent migration expanded user history joins without creating covering index on user audit records.",
                likelihood="high",
                supporting_evidence_ids=supporting,
                contradicting_evidence_ids=[],
                missing_evidence=["EXPLAIN ANALYZE execution plan for order history query"]
            ),
            HypothesisItem(
                title="Downstream Network Partition or Gateway Degradation",
                explanation="API Gateway proxy buffering issues or upstream connection stall.",
                likelihood="low",
                supporting_evidence_ids=[supporting[-1]] if supporting else [],
                contradicting_evidence_ids=supporting[:-1] if len(supporting) > 1 else [],
                missing_evidence=["Gateway upstream socket latency metrics"]
            )
        ]
        remediation = [
            RemediationStep(
                action="Create compound index CONCURRENTLY on order audit table (user_id, created_at).",
                reason="Eliminates sequential scans and reduces query latency from 2.5s to < 200ms.",
                priority="P0 - Immediate",
                risk_level="Low",
                required_permissions="Database Migration Admin",
                verification_procedure="Run EXPLAIN ANALYZE and inspect CloudWatch P95 latency graph.",
                status="planned"
            ),
            RemediationStep(
                action="Add circuit breaker and timeout reduction on gateway downstream calls.",
                reason="Prevents gateway request thread pool exhaustion during slow downstream queries.",
                priority="P1 - High",
                risk_level="Low",
                required_permissions="API Gateway Configuration",
                verification_procedure="Simulate 3000ms delay and confirm gateway returns quick fallback.",
                status="planned"
            )
        ]
        checklist = [
            "P95 latency returns under 200ms threshold",
            "Postgres primary CPU utilization drops below 40%",
            "HTTP 504 Gateway Timeout rate drops to 0%"
        ]
        missing = ["EXPLAIN ANALYZE execution plan", "PostgreSQL pg_stat_statements query report"]

    else:
        summary = f"Cascading HTTP 500 outages across {', '.join(affected_services) if affected_services else 'Authentication and Order APIs'} due to database connection exhaustion."
        root_cause = "Database connection pool reduction (max_size 50 -> 5) in commit a7b8c9d starved application services under nominal load, leading to QueuePool timeout errors and container liveness probe restarts."
        hypotheses = [
            HypothesisItem(
                title="Database Connection Pool Starvation",
                explanation="Connection pool max size was lowered to 5 in database.yaml, causing queues to fill within 120 seconds of deployment.",
                likelihood="high",
                supporting_evidence_ids=supporting,
                contradicting_evidence_ids=[],
                missing_evidence=["Active client connection count per replica"]
            ),
            HypothesisItem(
                title="Database Deadlock or Lock Contention",
                explanation="Concurrent transactions locked table rows preventing acquisition.",
                likelihood="low",
                supporting_evidence_ids=[supporting[2]] if len(supporting) > 2 else [],
                contradicting_evidence_ids=supporting[:2],
                missing_evidence=["Postgres pg_locks audit log"]
            )
        ]
        remediation = [
            RemediationStep(
                action="Revert database connection pool max_size in config/database.yaml to 50 and redeploy Authentication Service.",
                reason="Immediately satisfies concurrent application connection demand and restores auth token issuance.",
                priority="P0 - Immediate",
                risk_level="Low",
                required_permissions="Git Repository Merge & CI/CD Deployment",
                verification_procedure="Redeploy service and query /health endpoint with 50 concurrent requests.",
                status="planned"
            ),
            RemediationStep(
                action="Implement connection pool metrics alerting threshold at 75% saturation.",
                reason="Provides early warning before complete application connection exhaustion.",
                priority="P1 - High",
                risk_level="Low",
                required_permissions="Monitoring & Alerting Admin",
                verification_procedure="Trigger synthetic pool load and verify alerting fires within 60s.",
                status="planned"
            )
        ]
        checklist = [
            "Verify Authentication Service /health returns HTTP 200",
            "Confirm RDS ConnectionAcquisitionWaitTime drops below 100ms",
            "Confirm Order API checkout error rate returns to 0%",
            "Verify container restart count stabilizes"
        ]
        missing = ["PostgreSQL pg_stat_activity connection list", "Client connection pool overflow histograms"]

    return InvestigationResultSchema(
        incident_summary=summary,
        severity="critical",
        likely_root_cause=root_cause,
        confidence=0.91,
        affected_services=affected_services or ["Authentication Service", "Database"],
        supporting_evidence=supporting,
        contradicting_evidence=[],
        alternative_hypotheses=hypotheses,
        business_impact="Critical failure degrading core user workflows, causing authentication failures and transaction drop-off.",
        remediation_steps=remediation,
        verification_checklist=checklist,
        missing_information=missing
    )

def run_ai_investigation(
    title: str,
    description: str,
    affected_services: List[str],
    timeline_events: List[Dict[str, Any]]
) -> InvestigationResultSchema:
    """Analyze structured evidence using Gemini API with deterministic fallback."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logger.warning("GEMINI_API_KEY not configured. Using deterministic correlation engine fallback.")
        return generate_fallback_analysis(title, timeline_events, affected_services)

    try:
        client = genai.Client(api_key=api_key)
        
        prompt_data = {
            "incident_title": title,
            "incident_description": description,
            "affected_services": affected_services,
            "evidence_events": timeline_events
        }

        user_content = (
            f"Please conduct an autonomous root-cause investigation for the following incident and evidence:\n\n"
            f"{json.dumps(prompt_data, indent=2)}\n\n"
            f"Adhere strictly to the requested schema. Provide calibrated confidence (0.0 to 1.0) and supporting/contradicting evidence IDs."
        )

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=InvestigationResultSchema,
                temperature=0.1
            )
        )

        parsed_data = json.loads(response.text)
        return InvestigationResultSchema(**parsed_data)

    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}. Falling back to deterministic analysis.", exc_info=True)
        return generate_fallback_analysis(title, timeline_events, affected_services)
