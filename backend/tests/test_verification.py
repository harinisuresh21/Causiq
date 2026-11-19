from app.services.verification_service import verify_resolution

def test_verify_resolution_passing():
    """Verify clean post-fix evidence returns status=passed."""
    text = "2026-11-19 10:30:00 [INFO] [auth] Health check 200 OK. 0 errors detected. P95 latency 42ms."
    res = verify_resolution([], text)
    assert res["status"] == "passed"
    assert "0 errors" in res["current_error_frequency"]
    assert len(res["remaining_failures"]) == 0

def test_verify_resolution_failing():
    """Verify continued errors in post-fix telemetry return status=failed."""
    text = "2026-11-19 10:30:00 [ERROR] [auth] Connection timed out: QueuePool limit still saturated."
    res = verify_resolution([], text)
    assert res["status"] == "failed"
    assert len(res["remaining_failures"]) > 0

def test_verify_resolution_empty_evidence():
    """Verify default empty verification passes steady state."""
    res = verify_resolution([])
    assert res["status"] == "passed"
