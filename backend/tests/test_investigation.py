from unittest.mock import patch, MagicMock
from app.services.ai_engine import run_ai_investigation, generate_fallback_analysis
from app.schemas.incident import InvestigationResultSchema

def test_fallback_investigation_oom_classification():
    """Verify deterministic fallback engine correctly identifies memory leak scenarios."""
    events = [
        {"event_id": "EV-1", "description": "Memory leak detected in transaction consumer", "severity": "warning"},
        {"event_id": "EV-2", "description": "Kernel OOMKilled signal received", "severity": "critical"}
    ]
    result = generate_fallback_analysis("Worker Outage", events, ["Background Worker"])
    assert isinstance(result, InvestigationResultSchema)
    assert "memory" in result.likely_root_cause.lower() or "oom" in result.likely_root_cause.lower()
    assert len(result.alternative_hypotheses) > 0
    assert len(result.remediation_steps) > 0
    assert result.confidence > 0.8

def test_fallback_investigation_db_classification():
    """Verify deterministic fallback engine identifies database pool saturation."""
    events = [
        {"event_id": "EV-DB1", "description": "QueuePool limit of size 5 reached, timed out", "severity": "error"}
    ]
    result = generate_fallback_analysis("Auth Outage", events, ["Database", "Authentication Service"])
    assert "pool" in result.likely_root_cause.lower() or "database" in result.likely_root_cause.lower()

def test_ai_investigation_with_mocked_gemini():
    """Verify Gemini API mock path returns validated Pydantic schema."""
    mock_response = MagicMock()
    mock_response.text = '''{
        "incident_summary": "Mocked cascading outage",
        "severity": "critical",
        "likely_root_cause": "Configuration defect in connection pool",
        "confidence": 0.95,
        "affected_services": ["Authentication Service"],
        "supporting_evidence": ["EV-101"],
        "contradicting_evidence": [],
        "alternative_hypotheses": [
            {
                "title": "Network Blip",
                "explanation": "Temporary connection timeout",
                "likelihood": "low",
                "supporting_evidence_ids": [],
                "contradicting_evidence_ids": [],
                "missing_evidence": []
            }
        ],
        "business_impact": "User login failures",
        "remediation_steps": [
            {
                "action": "Revert config",
                "reason": "Restores pool size",
                "priority": "P0 - Immediate",
                "risk_level": "Low",
                "required_permissions": "Deployer",
                "verification_procedure": "Check /health",
                "status": "planned"
            }
        ],
        "verification_checklist": ["Check login endpoint"],
        "missing_information": []
    }'''

    with patch("app.config.settings.GEMINI_API_KEY", "mock-test-key"):
        with patch("google.genai.Client") as mock_client_cls:
            mock_client = MagicMock()
            mock_client.models.generate_content.return_value = mock_response
            mock_client_cls.return_value = mock_client

            result = run_ai_investigation(
                title="Mocked Outage",
                description="Test description",
                affected_services=["Authentication Service"],
                timeline_events=[{"event_id": "EV-101", "description": "error"}]
            )
            assert result.confidence == 0.95
            assert result.likely_root_cause == "Configuration defect in connection pool"
            assert "EV-101" in result.supporting_evidence
