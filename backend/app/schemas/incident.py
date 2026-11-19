from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class EvidenceItem(BaseModel):
    event_id: str
    source: str # github, docker, cloudwatch, application_logs, prometheus, jenkins
    service: str
    timestamp: str
    severity: str # critical, error, warning, info
    event_type: str
    description: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    is_simulated: bool = False

class HypothesisItem(BaseModel):
    title: str
    explanation: str
    likelihood: str # high, medium, low
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    contradicting_evidence_ids: List[str] = Field(default_factory=list)
    missing_evidence: List[str] = Field(default_factory=list)

class RemediationStep(BaseModel):
    action: str
    reason: str
    priority: str # P0 - Immediate, P1 - High, P2 - Medium
    risk_level: str # Low, Medium, High
    required_permissions: str
    verification_procedure: str
    status: str = "planned" # planned, implemented

class InvestigationResultSchema(BaseModel):
    incident_summary: str
    severity: str
    likely_root_cause: str
    confidence: float
    affected_services: List[str]
    supporting_evidence: List[str]
    contradicting_evidence: List[str]
    alternative_hypotheses: List[HypothesisItem]
    business_impact: str
    remediation_steps: List[RemediationStep]
    verification_checklist: List[str]
    missing_information: List[str]

class IncidentCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    severity: str = "critical"
    affected_services: List[str] = Field(default_factory=list)
    scenario_id: Optional[str] = None
    evidence_sources: List[str] = Field(default_factory=list)
    custom_events: Optional[List[EvidenceItem]] = None

class IncidentResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    severity: str
    status: str
    affected_services: List[str]
    created_at: datetime
    resolved_at: Optional[datetime] = None
    is_demo: bool
    scenario_id: Optional[str]

    class Config:
        from_attributes = True

class VerificationRequest(BaseModel):
    verification_evidence_text: Optional[str] = None
    manual_override: bool = False

class VerificationResultResponse(BaseModel):
    status: str # passed, failed
    previous_error_frequency: str
    current_error_frequency: str
    relevant_service_health: str
    remaining_failures: List[str]
    summary: str

class IntegrationStatusResponse(BaseModel):
    id: str
    name: str
    status: str
    description: str
    last_sync: Optional[str]
    permissions: str
    is_simulated: bool = False

class GitHubConnectRequest(BaseModel):
    token: str
    owner: Optional[str] = None
    repo: Optional[str] = None
