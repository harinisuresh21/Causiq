from app.services.correlation_engine import correlate_events

def test_correlate_events_commit_to_deployment():
    """Verify code changes followed by deployments generate correlation edges."""
    events = [
        {"event_id": "EV-01", "event_type": "commit", "service": "auth-service"},
        {"event_id": "EV-02", "event_type": "deployment", "service": "auth-service"}
    ]
    result = correlate_events(events)
    assert result["correlations_count"] >= 1
    edge = result["correlations"][0]
    assert edge["type"] == "code_to_deployment"
    assert edge["source_id"] == "EV-01"
    assert edge["target_id"] == "EV-02"

def test_correlate_events_deployment_to_failure():
    """Verify deployment followed by error logs generates causal correlation."""
    events = [
        {"event_id": "EV-DEP", "event_type": "deployment", "service": "auth-service"},
        {"event_id": "EV-ERR", "event_type": "app_error", "severity": "error", "service": "auth-service"}
    ]
    result = correlate_events(events)
    assert any(c["type"] == "deployment_to_failure" for c in result["correlations"])

def test_correlate_events_error_to_restart():
    """Verify error leading to container restart generates container restart edge."""
    events = [
        {"event_id": "EV-ERR", "event_type": "app_error", "severity": "error", "service": "auth-service"},
        {"event_id": "EV-RST", "event_type": "container_restart", "severity": "error", "service": "auth-service"}
    ]
    result = correlate_events(events)
    assert any(c["type"] == "error_to_container_restart" for c in result["correlations"])

def test_empty_events_correlation():
    """Verify empty event list produces 0 correlations without exception."""
    result = correlate_events([])
    assert result["correlations_count"] == 0
    assert result["correlations"] == []
