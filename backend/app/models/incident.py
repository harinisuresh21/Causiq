import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String, default="critical") # critical, high, medium, low
    status = Column(String, default="investigating") # investigating, identified, verifying, resolved
    affected_services = Column(Text, default="[]") # JSON list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    is_demo = Column(Boolean, default=False)
    scenario_id = Column(String, nullable=True)

    evidences = relationship("Evidence", back_populates="incident", cascade="all, delete-orphan")
    investigation = relationship("Investigation", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    verifications = relationship("VerificationRecord", back_populates="incident", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String, primary_key=True, index=True) # e.g. EV-101
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    source = Column(String, nullable=False) # github, docker, cloudwatch, application_logs, prometheus, jenkins
    service = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    severity = Column(String, default="info") # error, warning, info, critical
    event_type = Column(String, nullable=False) # commit, deployment, container_restart, db_timeout, latency_spike
    description = Column(Text, nullable=False)
    raw_payload = Column(Text, nullable=True) # JSON string
    is_simulated = Column(Boolean, default=False)

    incident = relationship("Incident", back_populates="evidences")

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), unique=True, nullable=False)
    stage = Column(String, default="completed") # STAGE 1 to STAGE 9
    incident_summary = Column(Text, nullable=False)
    likely_root_cause = Column(Text, nullable=False)
    confidence = Column(Float, default=0.85)
    supporting_evidence = Column(Text, default="[]") # JSON list of IDs
    contradicting_evidence = Column(Text, default="[]") # JSON list of IDs
    alternative_hypotheses = Column(Text, default="[]") # JSON list of objects
    business_impact = Column(Text, nullable=True)
    remediation_steps = Column(Text, default="[]") # JSON list of objects
    verification_checklist = Column(Text, default="[]") # JSON list
    missing_information = Column(Text, default="[]") # JSON list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    raw_ai_response = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="investigation")

class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    status = Column(String, default="passed") # passed, failed, pending
    previous_error_frequency = Column(String, nullable=True) # e.g. "45 errors/min"
    current_error_frequency = Column(String, nullable=True) # e.g. "0 errors/min"
    relevant_service_health = Column(String, nullable=True) # e.g. "Healthy (200 OK)"
    remaining_failures = Column(Text, default="[]") # JSON list
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="verifications")

class IntegrationConfig(Base):
    __tablename__ = "integration_configs"

    id = Column(String, primary_key=True, index=True) # github, cloudwatch, docker, jenkins, prometheus
    name = Column(String, nullable=False)
    status = Column(String, default="disconnected") # connected, disconnected, simulated
    description = Column(Text, nullable=True)
    last_sync = Column(DateTime, nullable=True)
    permissions = Column(String, nullable=True)
    is_simulated = Column(Boolean, default=False)
    config_data = Column(Text, default="{}") # JSON config e.g. token, endpoint, aws_region

class DeploymentRecord(Base):
    __tablename__ = "deployment_records"

    id = Column(String, primary_key=True, index=True) # DEP-xxx
    service = Column(String, nullable=False)
    commit = Column(String, nullable=False)
    environment = Column(String, default="Production")
    author = Column(String, default="dev-lead")
    status = Column(String, default="success") # success, failed
    deployed_at = Column(DateTime, default=datetime.datetime.utcnow)
