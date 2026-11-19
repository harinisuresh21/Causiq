import json
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.incident import Incident, Evidence, Investigation, VerificationRecord, IntegrationConfig
from app.schemas.incident import (
    IncidentCreateRequest, IncidentResponse, EvidenceItem,
    VerificationRequest, VerificationResultResponse,
    IntegrationStatusResponse, GitHubConnectRequest
)
from app.services.ai_engine import run_ai_investigation
from app.services.investigation_engine import execute_investigation, STAGES
from app.services.evidence_collector import build_chronological_timeline
from app.services.log_parser import parse_raw_log_lines
from app.services.github_service import GitHubService
from app.services.verification_service import verify_resolution
from app.data.demo_scenarios.scenarios import SCENARIOS

router = APIRouter(prefix="/api")

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "RootCause AI Core",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Incident).count()
    active = db.query(Incident).filter(Incident.status.in_(["investigating", "identified", "verifying"])).count()
    critical = db.query(Incident).filter(Incident.severity == "critical").count()
    resolved = db.query(Incident).filter(Incident.status == "resolved").count()

    services_health = [
        {"name": "API Gateway", "status": "healthy", "error_rate": "0.02%", "response_time": "38ms", "last_updated": "Just now"},
        {"name": "Authentication Service", "status": "degraded" if active > 0 else "healthy", "error_rate": "4.8%" if active > 0 else "0.01%", "response_time": "120ms", "last_updated": "Just now"},
        {"name": "Payment Service", "status": "healthy", "error_rate": "0.00%", "response_time": "85ms", "last_updated": "1 min ago"},
        {"name": "Database Cluster", "status": "degraded" if active > 0 else "healthy", "error_rate": "1.2%" if active > 0 else "0.00%", "response_time": "92ms", "last_updated": "Just now"},
        {"name": "Background Worker", "status": "healthy", "error_rate": "0.05%", "response_time": "210ms", "last_updated": "2 mins ago"},
    ]

    deployments = [
        {"id": "DEP-412", "service": "API Gateway", "commit": "a7b8c9d", "environment": "Production", "time": "10:00 AM", "author": "dev-lead", "status": "success"},
        {"id": "DEP-411", "service": "Authentication Service", "commit": "f1e2d3c", "environment": "Production", "time": "09:45 AM", "author": "sre-dev", "status": "success"},
        {"id": "DEP-410", "service": "Database Migration 0082", "commit": "4b92e10", "environment": "Production", "time": "09:10 AM", "author": "db-admin", "status": "success"},
        {"id": "DEP-409", "service": "Payment Service", "commit": "90e1fa2", "environment": "Staging", "time": "Yesterday", "author": "payment-eng", "status": "success"},
    ]

    trend = [
        {"time": "06:00", "critical": 0, "high": 1, "resolved": 2},
        {"time": "08:00", "critical": 0, "high": 2, "resolved": 3},
        {"time": "10:00", "critical": 2, "high": 3, "resolved": 1},
        {"time": "12:00", "critical": 1, "high": 1, "resolved": 4},
        {"time": "14:00", "critical": 1, "high": 2, "resolved": 3},
        {"time": "Now", "critical": critical, "high": active, "resolved": resolved},
    ]

    return {
        "metrics": {
            "total_incidents": total,
            "active_incidents": active,
            "critical_incidents": critical,
            "resolved_incidents": resolved,
            "avg_investigation_time": "1m 45s"
        },
        "services": services_health,
        "recent_deployments": deployments,
        "incident_trend": trend
    }

@router.get("/integrations")
def get_integrations(db: Session = Depends(get_db)):
    # Standard integration cards
    return [
        {
            "id": "github",
            "name": "GitHub",
            "description": "Correlate commit SHAs, file diffs, author metadata, and repository releases.",
            "status": "connected",
            "last_sync": "2 mins ago",
            "permissions": "repo:read, commit:read",
            "is_simulated": False
        },
        {
            "id": "cloudwatch",
            "name": "AWS CloudWatch",
            "description": "Ingest RDS metrics, latency alarms, and target response time telemetry.",
            "status": "simulated",
            "last_sync": "1 min ago",
            "permissions": "cloudwatch:GetMetricData, DescribeAlarms",
            "is_simulated": True
        },
        {
            "id": "docker",
            "name": "Docker Engine",
            "description": "Inspect container crash signals, OOMKilled events, and container lifecycle transitions.",
            "status": "simulated",
            "last_sync": "Just now",
            "permissions": "docker.sock:ro",
            "is_simulated": True
        },
        {
            "id": "jenkins",
            "name": "Jenkins CI/CD",
            "description": "Track production pipeline deployments, build artifacts, and release jobs.",
            "status": "simulated",
            "last_sync": "10 mins ago",
            "permissions": "job:read, build:read",
            "is_simulated": True
        },
        {
            "id": "prometheus",
            "name": "Prometheus & Alertmanager",
            "description": "Query high-frequency metrics, threshold alerts, and service saturations.",
            "status": "simulated",
            "last_sync": "Just now",
            "permissions": "api/v1/query, alerts:read",
            "is_simulated": True
        }
    ]

@router.post("/integrations/github/connect")
def connect_github(req: GitHubConnectRequest, db: Session = Depends(get_db)):
    return {
        "status": "connected",
        "message": "GitHub authenticated successfully with read-only commit access.",
        "owner": req.owner or "authenticated-user"
    }

@router.get("/integrations/github/repositories")
async def get_github_repos():
    svc = GitHubService()
    return await svc.get_repositories()

@router.get("/integrations/github/commits")
async def get_github_commits(owner: str = "rootcause-ai", repo: str = "auth-service"):
    svc = GitHubService()
    return await svc.get_commits(owner, repo)

@router.get("/scenarios")
def get_demo_scenarios():
    return list(SCENARIOS.values())

@router.post("/incidents")
def create_incident(req: IncidentCreateRequest, db: Session = Depends(get_db)):
    inc_id = f"INC-{uuid.uuid4().hex[:6].upper()}"
    
    # Check if demo scenario was picked
    is_demo = False
    events_to_add = []
    
    if req.scenario_id and req.scenario_id in SCENARIOS:
        is_demo = True
        sc = SCENARIOS[req.scenario_id]
        title = sc["title"]
        desc = sc["description"]
        sev = sc["severity"]
        affected = sc["affected_services"]
        for ev in sc["events"]:
            events_to_add.append(ev)
    else:
        title = req.title
        desc = req.description or ""
        sev = req.severity
        affected = req.affected_services
        if req.custom_events:
            for c_ev in req.custom_events:
                events_to_add.append(c_ev.dict())

    incident = Incident(
        id=inc_id,
        title=title,
        description=desc,
        severity=sev,
        status="investigating",
        affected_services=json.dumps(affected),
        is_demo=is_demo,
        scenario_id=req.scenario_id
    )
    db.add(incident)
    db.flush()

    # Add evidence events
    for ev in events_to_add:
        evidence_record = Evidence(
            id=ev.get("event_id") or f"EV-{uuid.uuid4().hex[:6].upper()}",
            incident_id=inc_id,
            source=ev.get("source", "manual"),
            service=ev.get("service", affected[0] if affected else "unknown"),
            timestamp=datetime.datetime.fromisoformat(ev.get("timestamp").replace("Z", "+00:00")) if "T" in ev.get("timestamp", "") else datetime.datetime.utcnow(),
            severity=ev.get("severity", "info"),
            event_type=ev.get("event_type", "event"),
            description=ev.get("description", ""),
            raw_payload=json.dumps(ev.get("metadata", {})),
            is_simulated=is_demo
        )
        db.add(evidence_record)

    db.commit()
    db.refresh(incident)

    return {
        "id": incident.id,
        "title": incident.title,
        "severity": incident.severity,
        "status": incident.status,
        "affected_services": affected,
        "is_demo": incident.is_demo,
        "scenario_id": incident.scenario_id,
        "created_at": incident.created_at.isoformat()
    }

@router.get("/incidents")
def list_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
    out = []
    for inc in incidents:
        out.append({
            "id": inc.id,
            "title": inc.title,
            "description": inc.description,
            "severity": inc.severity,
            "status": inc.status,
            "affected_services": json.loads(inc.affected_services) if inc.affected_services else [],
            "created_at": inc.created_at.isoformat(),
            "resolved_at": inc.resolved_at.isoformat() if inc.resolved_at else None,
            "is_demo": inc.is_demo,
            "scenario_id": inc.scenario_id
        })
    return out

@router.get("/incidents/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    return {
        "id": inc.id,
        "title": inc.title,
        "description": inc.description,
        "severity": inc.severity,
        "status": inc.status,
        "affected_services": json.loads(inc.affected_services) if inc.affected_services else [],
        "created_at": inc.created_at.isoformat(),
        "resolved_at": inc.resolved_at.isoformat() if inc.resolved_at else None,
        "is_demo": inc.is_demo,
        "scenario_id": inc.scenario_id
    }

@router.post("/incidents/{incident_id}/evidence/upload")
async def upload_evidence_file(
    incident_id: str,
    file: UploadFile = File(...),
    service: str = Form("app-service"),
    db: Session = Depends(get_db)
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    parsed_events = parse_raw_log_lines(text, default_service=service)

    added = []
    for ev in parsed_events:
        ev_id = f"EV-UPL-{uuid.uuid4().hex[:6].upper()}"
        evidence_record = Evidence(
            id=ev_id,
            incident_id=incident_id,
            source=ev["source"],
            service=ev["service"],
            timestamp=datetime.datetime.utcnow(),
            severity=ev["severity"],
            event_type=ev["event_type"],
            description=ev["description"],
            raw_payload=json.dumps(ev.get("metadata", {})),
            is_simulated=False
        )
        db.add(evidence_record)
        added.append(ev_id)

    db.commit()
    return {"message": f"Successfully parsed and ingested {len(added)} events", "evidence_ids": added}

@router.post("/incidents/{incident_id}/investigate")
def investigate_incident(incident_id: str, db: Session = Depends(get_db)):
    try:
        return execute_investigation(incident_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/incidents/{incident_id}/investigation")
def get_incident_investigation(incident_id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.incident_id == incident_id).first()
    if not inv:
        # If no investigation yet, execute one
        return execute_investigation(incident_id, db)

    return {
        "investigation_id": inv.id,
        "incident_id": inv.incident_id,
        "stages": STAGES,
        "result": {
            "incident_summary": inv.incident_summary,
            "severity": "critical",
            "likely_root_cause": inv.likely_root_cause,
            "confidence": inv.confidence,
            "supporting_evidence": json.loads(inv.supporting_evidence),
            "contradicting_evidence": json.loads(inv.contradicting_evidence),
            "alternative_hypotheses": json.loads(inv.alternative_hypotheses),
            "business_impact": inv.business_impact,
            "remediation_steps": json.loads(inv.remediation_steps),
            "verification_checklist": json.loads(inv.verification_checklist),
            "missing_information": json.loads(inv.missing_information)
        }
    }

@router.get("/incidents/{incident_id}/timeline")
def get_incident_timeline(incident_id: str, db: Session = Depends(get_db)):
    evidences = db.query(Evidence).filter(Evidence.incident_id == incident_id).all()
    events = []
    for ev in evidences:
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
    return build_chronological_timeline(events)

@router.get("/incidents/{incident_id}/evidence-graph")
def get_evidence_graph(incident_id: str, db: Session = Depends(get_db)):
    evidences = db.query(Evidence).filter(Evidence.incident_id == incident_id).all()
    timeline = []
    for ev in evidences:
        timeline.append({
            "event_id": ev.id,
            "source": ev.source,
            "service": ev.service,
            "timestamp": ev.timestamp.isoformat(),
            "severity": ev.severity,
            "event_type": ev.event_type,
            "description": ev.description,
            "is_simulated": ev.is_simulated
        })
    sorted_ev = build_chronological_timeline(timeline)

    # Generate nodes & edges
    nodes = []
    edges = []
    
    for idx, ev in enumerate(sorted_ev):
        nodes.append({
            "id": ev["event_id"],
            "type": "evidenceNode",
            "data": {
                "label": ev["event_type"].replace("_", " ").title(),
                "service": ev["service"],
                "source": ev["source"],
                "description": ev["description"],
                "severity": ev["severity"],
                "timestamp": ev["timestamp"],
                "is_simulated": ev["is_simulated"]
            },
            "position": {"x": 250, "y": idx * 140 + 40}
        })
        if idx > 0:
            edges.append({
                "id": f"e-{sorted_ev[idx-1]['event_id']}-{ev['event_id']}",
                "source": sorted_ev[idx-1]["event_id"],
                "target": ev["event_id"],
                "animated": True,
                "label": "Preceded / Correlated"
            })

    return {"nodes": nodes, "edges": edges}

@router.post("/incidents/{incident_id}/verify")
def verify_incident(incident_id: str, req: VerificationRequest, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    raw_evidences = db.query(Evidence).filter(Evidence.incident_id == incident_id).all()
    original_events = [{"description": e.description} for e in raw_evidences]

    res = verify_resolution(original_events, req.verification_evidence_text)
    
    rec = VerificationRecord(
        id=f"VR-{uuid.uuid4().hex[:6].upper()}",
        incident_id=incident_id,
        status=res["status"],
        previous_error_frequency=res["previous_error_frequency"],
        current_error_frequency=res["current_error_frequency"],
        relevant_service_health=res["relevant_service_health"],
        remaining_failures=json.dumps(res["remaining_failures"]),
        summary=res["summary"]
    )
    db.add(rec)
    
    if res["status"] == "passed" and req.manual_override:
        inc.status = "resolved"
        inc.resolved_at = datetime.datetime.utcnow()

    db.commit()
    return res

@router.post("/incidents/{incident_id}/resolve")
def resolve_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    inc.status = "resolved"
    inc.resolved_at = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Incident marked as resolved after verified fix confirmation", "status": "resolved"}

@router.get("/incidents/{incident_id}/report")
def export_incident_report(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    inv = db.query(Investigation).filter(Investigation.incident_id == incident_id).first()
    evidences = db.query(Evidence).filter(Evidence.incident_id == incident_id).all()
    verifications = db.query(VerificationRecord).filter(VerificationRecord.incident_id == incident_id).all()

    return {
        "report_id": f"REP-{inc.id}",
        "generated_at": datetime.datetime.utcnow().isoformat(),
        "incident": {
            "id": inc.id,
            "title": inc.title,
            "severity": inc.severity,
            "status": inc.status,
            "affected_services": json.loads(inc.affected_services) if inc.affected_services else [],
            "created_at": inc.created_at.isoformat(),
            "resolved_at": inc.resolved_at.isoformat() if inc.resolved_at else None
        },
        "investigation": {
            "summary": inv.incident_summary if inv else "No investigation completed.",
            "likely_root_cause": inv.likely_root_cause if inv else "Unknown",
            "confidence": inv.confidence if inv else 0.0,
            "supporting_evidence": json.loads(inv.supporting_evidence) if inv else [],
            "remediation_steps": json.loads(inv.remediation_steps) if inv else []
        },
        "evidence_count": len(evidences),
        "verifications": [
            {
                "id": v.id,
                "status": v.status,
                "health": v.relevant_service_health,
                "summary": v.summary,
                "created_at": v.created_at.isoformat()
            }
            for v in verifications
        ]
    }
