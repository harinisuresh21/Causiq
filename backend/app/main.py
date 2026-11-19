from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import incidents
from app.models.incident import Incident, Evidence
from app.data.demo_scenarios.scenarios import SCENARIOS
import json
import datetime

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RootCause AI Core API",
    description="Autonomous Software Incident Investigator Core Engine",
    version="1.0.0"
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
def preload_default_incidents():
    """Seed initial demo incidents so the dashboard has immediate rich data."""
    db = SessionLocal()
    try:
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
