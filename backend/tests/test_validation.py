def test_investigate_incident_endpoint(client):
    """Test triggering an end-to-end autonomous investigation on an incident."""
    create_res = client.post("/api/incidents", json={"title": "Investigation Test Incident", "scenario_id": "scenario_1"})
    inc_id = create_res.json()["id"]

    inv_res = client.post(f"/api/incidents/{inc_id}/investigate")
    assert inv_res.status_code == 200
    data = inv_res.json()
    assert "investigation_id" in data
    assert "result" in data
    assert len(data["stages"]) == 9
    assert data["result"]["confidence"] > 0.8
    assert len(data["result"]["supporting_evidence"]) > 0

def test_verify_incident_and_resolve(client):
    """Test full workflow: create incident -> verify resolution -> resolve incident."""
    create_res = client.post("/api/incidents", json={"title": "Resolution Flow Test"})
    inc_id = create_res.json()["id"]

    # Verify
    verify_res = client.post(
        f"/api/incidents/{inc_id}/verify",
        json={"verification_evidence_text": "Health check 200 OK. 0 errors detected. Latency 38ms."}
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "passed"

    # Resolve
    resolve_res = client.post(f"/api/incidents/{inc_id}/resolve")
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "resolved"

    # Verify incident status updated in DB
    get_res = client.get(f"/api/incidents/{inc_id}")
    assert get_res.json()["status"] == "resolved"

def test_export_report(client):
    """Test generating audit report for incident."""
    create_res = client.post("/api/incidents", json={"title": "Report Export Test"})
    inc_id = create_res.json()["id"]

    rep_res = client.get(f"/api/incidents/{inc_id}/report")
    assert rep_res.status_code == 200
    report = rep_res.json()
    assert "report_id" in report
    assert report["incident"]["id"] == inc_id
