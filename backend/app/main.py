from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import incidents
from app.models.incident import Incident, Evidence, IntegrationConfig, DeploymentRecord
from app.data.demo_scenarios.scenarios import SCENARIOS
import json
import datetime

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Causiq AI Core API",
    description="Autonomous Software Incident Investigator Core Engine",
    version="2.0.0"
)

# CORS configuration for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router)

@app.on_event("startup")
def preload_default_data():
    """Seed initial demo incidents and integration registry."""
    db = SessionLocal()
    try:
        # Seed Integrations
        if db.query(IntegrationConfig).count() == 0:
            defaults = [
                IntegrationConfig(id="github", name="GitHub", description="Correlate commit SHAs, file diffs, author metadata, and repository releases.", status="connected", permissions="repo:read, commit:read", is_simulated=False),
                IntegrationConfig(id="cloudwatch", name="AWS CloudWatch", description="Ingest RDS metrics, latency alarms, and target response time telemetry.", status="simulated", permissions="cloudwatch:GetMetricData, DescribeAlarms", is_simulated=True),
                IntegrationConfig(id="docker", name="Docker Engine", description="Inspect container crash signals, OOMKilled events, and container lifecycle transitions.", status="simulated", permissions="docker.sock:ro", is_simulated=True),
                IntegrationConfig(id="jenkins", name="Jenkins CI/CD", description="Track production pipeline deployments, build artifacts, and release jobs.", status="simulated", permissions="job:read, build:read", is_simulated=True),
                IntegrationConfig(id="prometheus", name="Prometheus & Alertmanager", description="Query high-frequency metrics, threshold alerts, and service saturations.", status="simulated", permissions="api/v1/query, alerts:read", is_simulated=True),
            ]
            db.add_all(defaults)

        # Seed Deployments
        if db.query(DeploymentRecord).count() == 0:
            deps = [
                DeploymentRecord(id="DEP-412", service="API Gateway", commit="a7b8c9d", environment="Production", author="dev-lead", status="success", deployed_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=30)),
                DeploymentRecord(id="DEP-411", service="Authentication Service", commit="f1e2d3c", environment="Production", author="sre-dev", status="success", deployed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1)),
                DeploymentRecord(id="DEP-410", service="Database Migration 0082", commit="4b92e10", environment="Production", author="db-admin", status="success", deployed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)),
                DeploymentRecord(id="DEP-409", service="Payment Service", commit="90e1fa2", environment="Staging", author="payment-eng", status="success", deployed_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)),
            ]
            db.add_all(deps)

        count = db.query(Incident).count()
        if count == 0:
            # Seed Scenario 1 as an active incident
            sc1 = SCENARIOS["scenario_1"]
            inc1 = Incident(
                id="INC-DB-401",
                title=sc1["title"],
                description=sc1["description"],
                severity=sc1["severity"],
                status="identified",
                affected_services=json.dumps(sc1["affected_services"]),
                is_demo=True,
                scenario_id="scenario_1",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=35)
            )
            db.add(inc1)
            for ev in sc1["events"]:
                db.add(Evidence(
                    id=ev["event_id"],
                    incident_id=inc1.id,
                    source=ev["source"],
                    service=ev["service"],
                    timestamp=datetime.datetime.fromisoformat(ev["timestamp"].replace("Z", "+00:00")),
                    severity=ev["severity"],
                    event_type=ev["event_type"],
                    description=ev["description"],
                    raw_payload=json.dumps(ev.get("metadata", {})),
                    is_simulated=True
                ))

            # Seed Scenario 2 as a resolved incident
            sc2 = SCENARIOS["scenario_2"]
            inc2 = Incident(
                id="INC-OOM-302",
                title=sc2["title"],
                description=sc2["description"],
                severity="critical",
                status="resolved",
                affected_services=json.dumps(sc2["affected_services"]),
                is_demo=True,
                scenario_id="scenario_2",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=3),
                resolved_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            )
            db.add(inc2)
            for ev in sc2["events"]:
                db.add(Evidence(
                    id=ev["event_id"],
                    incident_id=inc2.id,
                    source=ev["source"],
                    service=ev["service"],
                    timestamp=datetime.datetime.fromisoformat(ev["timestamp"].replace("Z", "+00:00")),
                    severity=ev["severity"],
                    event_type=ev["event_type"],
                    description=ev["description"],
                    raw_payload=json.dumps(ev.get("metadata", {})),
                    is_simulated=True
                ))

        db.commit()
    finally:
        db.close()
