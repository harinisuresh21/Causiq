import io

def test_upload_valid_log_file(client):
    """Test uploading a valid .log file parses and attaches evidence to the incident."""
    create_res = client.post("/api/incidents", json={"title": "Upload Target Incident"})
    inc_id = create_res.json()["id"]

    log_content = (
        "2026-11-19 10:00:00 [ERROR] [auth-service] Database connection timed out\n"
        "2026-11-19 10:01:00 [CRITICAL] [auth-service] Liveness probe failed"
    )
    file_obj = io.BytesIO(log_content.encode("utf-8"))

    res = client.post(
        f"/api/incidents/{inc_id}/evidence/upload",
        files={"file": ("test.log", file_obj, "text/plain")},
        data={"service": "auth-service"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "Successfully parsed" in data["message"]
    assert len(data["evidence_ids"]) == 2

    # Verify timeline reflects the new evidence
    timeline_res = client.get(f"/api/incidents/{inc_id}/timeline")
    assert timeline_res.status_code == 200
    assert len(timeline_res.json()) >= 2

def test_upload_to_invalid_incident_returns_404(client):
    """Test uploading to a non-existent incident returns HTTP 404."""
    file_obj = io.BytesIO(b"test log entry")
    res = client.post(
        "/api/incidents/INC-NONEXISTENT/evidence/upload",
        files={"file": ("test.log", file_obj, "text/plain")}
    )
    assert res.status_code == 404
