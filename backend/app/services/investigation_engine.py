import json
import uuid
import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.incident import Incident, Evidence, Investigation
from app.services.evidence_collector import normalize_event, build_chronological_timeline
from app.services.correlation_engine import correlate_events
from app.services.ai_engine import run_ai_investigation
from app.data.demo_scenarios.scenarios import SCENARIOS

STAGES = [
    {"stage": 1, "name": "Incident Understanding", "description": "Parsing failure scope, service blast radius, and initial error vectors"},
    {"stage": 2, "name": "Evidence Collection", "description": "Gathering authorised telemetry from GitHub, CloudWatch, Docker, and logs"},
    {"stage": 3, "name": "Evidence Normalisation", "description": "Standardizing cross-system events into canonical schemas"},
    {"stage": 4, "name": "Timeline Construction", "description": "Sequencing events into high-precision chronological ordering"},
    {"stage": 5, "name": "Correlation Engine", "description": "Tracing dependencies between deployments, commits, and error spikes"},
    {"stage": 6, "name": "Hypothesis Generation", "description": "Formulating evidence-grounded root-cause candidates with Gemini"},
    {"stage": 7, "name": "Hypothesis Evaluation", "description": "Testing hypotheses against supporting and contradicting evidence"},
    {"stage": 8, "name": "Remediation", "description": "Generating calibrated human-in-the-loop remediation playbooks"},
    {"stage": 9, "name": "Verification Plan", "description": "Synthesizing test checklist and observability baselines"}
]

def execute_investigation(incident_id: str, db: Session) -> Dict[str, Any]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise ValueError(f"Incident {incident_id} not found")

    # Step 1 & 2: Gather evidence from DB
    raw_evidences = db.query(Evidence).filter(Evidence.incident_id == incident_id).all()
    events = []
    for ev in raw_evidences:
        events.append({
            "event_id": ev.id,
            "source": ev.source,
            "service": ev.service,
            "timestamp": ev.timestamp.isoformat(),
            "severity": ev.severity,
            "event_type": ev.event_type,
            "description": ev.description,
            "metadata": json.loads(ev.raw_payload) if ev.raw_payload else {},
            "is_simulated": ev.is_simulated
        })

    # Step 3 & 4: Timeline
    timeline = build_chronological_timeline(events)

    # Step 5: Correlation
    correlation_data = correlate_events(timeline)

    # Step 6, 7, 8, 9: AI Engine
    affected = json.loads(incident.affected_services) if incident.affected_services else []
    ai_result = run_ai_investigation(
        title=incident.title,
        description=incident.description or "",
        affected_services=affected,
        timeline_events=timeline
    )

    # Persist or update Investigation record
    investigation = db.query(Investigation).filter(Investigation.incident_id == incident_id).first()
    if not investigation:
        investigation = Investigation(
            id=f"INV-{uuid.uuid4().hex[:8].upper()}",
            incident_id=incident_id
        )
        db.add(investigation)

    investigation.stage = "STAGE 9 - COMPLETED"
    investigation.incident_summary = ai_result.incident_summary
    investigation.likely_root_cause = ai_result.likely_root_cause
    investigation.confidence = ai_result.confidence
    investigation.supporting_evidence = json.dumps(ai_result.supporting_evidence)
    investigation.contradicting_evidence = json.dumps(ai_result.contradicting_evidence)
    investigation.alternative_hypotheses = json.dumps([h.dict() for h in ai_result.alternative_hypotheses])
    investigation.business_impact = ai_result.business_impact
    investigation.remediation_steps = json.dumps([r.dict() for r in ai_result.remediation_steps])
    investigation.verification_checklist = json.dumps(ai_result.verification_checklist)
    investigation.missing_information = json.dumps(ai_result.missing_information)
    investigation.raw_ai_response = json.dumps(ai_result.dict())

    incident.status = "identified"
    db.commit()
    db.refresh(investigation)

    return {
        "investigation_id": investigation.id,
        "incident_id": incident.id,
        "stages": STAGES,
        "result": ai_result.dict(),
        "correlations": correlation_data
    }
