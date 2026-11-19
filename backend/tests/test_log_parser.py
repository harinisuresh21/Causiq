from app.services.log_parser import parse_raw_log_lines
from app.services.redaction_service import redact_text

def test_parse_structured_log_lines():
    """Verify INFO, WARNING, ERROR, and CRITICAL parsing into canonical schemas."""
    sample_text = (
        "2026-11-19 10:00:00 [INFO] [auth-service] Service started\n"
        "2026-11-19 10:01:00 [WARNING] [db-service] High latency 450ms\n"
        "2026-11-19 10:02:00 [ERROR] [auth-service] Connection refused\n"
        "2026-11-19 10:03:00 [CRITICAL] [payment-service] Kernel OOMKilled"
    )
    events = parse_raw_log_lines(sample_text)
    assert len(events) == 4
    assert events[0]["severity"] == "info"
    assert events[0]["service"] == "auth-service"
    assert events[1]["severity"] == "warning"
    assert events[2]["severity"] == "error"
    assert events[3]["severity"] == "critical"

def test_parse_unstructured_fallback():
    """Verify unstructured plain log lines are safely captured."""
    plain = "Some random unformatted error message without brackets"
    events = parse_raw_log_lines(plain, default_service="custom-service")
    assert len(events) == 1
    assert events[0]["service"] == "custom-service"
    assert events[0]["severity"] == "error"

def test_empty_log_parsing():
    """Verify empty log input produces an empty list."""
    assert parse_raw_log_lines("") == []
    assert parse_raw_log_lines("   \n\n  ") == []

def test_secret_redaction_in_logs():
    """Verify sensitive passwords and tokens are redacted during log parsing."""
    sensitive_log = "2026-11-19 10:00:00 [ERROR] [auth] Connection failed with password: SuperSecretPassword123 and token: ghp_123456789012345678901234567890123456"
    events = parse_raw_log_lines(sensitive_log)
    assert len(events) == 1
    desc = events[0]["description"]
    assert "SuperSecretPassword123" not in desc
    assert "[REDACTED" in desc
    assert "ghp_1234567890" not in desc

def test_redact_text_patterns():
    """Test individual pattern rules in redaction service."""
    assert "[REDACTED_AWS_KEY]" in redact_text("AWS key is AKIA1234567890ABCDEF")
    assert "[REDACTED_PWD]" in redact_text("postgres://user:mypassword@localhost:5432/db")
