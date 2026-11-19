def test_create_custom_incident(client):
    """Test creating a custom incident with valid payload."""
    payload = {
        "title": "API Latency Degradation",
        "description": "Slow checkout response times",
        "severity": "high",
        "affected_services": ["API Gateway", "Payment Service"],
        "custom_events": [
            {
                "event_id": "TEST-EV-1",
                "source": "application_logs",
                "service": "API Gateway",
                "timestamp": "2026-11-19T10:00:00Z",
                "severity": "error",
                "event_type": "app_error",
                "description": "504 Gateway Timeout"
            }
        ]
    }
    response = client.post("/api/incidents", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["title"] == "API Latency Degradation"
    assert data["severity"] == "high"
    assert data["status"] == "investigating"
    assert "API Gateway" in data["affected_services"]

def test_create_demo_scenario_incident(client):
    """Test creating an incident initialized from a preloaded demo scenario."""
    payload = {
        "title": "Ignored Title",
        "scenario_id": "scenario_1"
    }
    response = client.post("/api/incidents", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_demo"] is True
    assert data["scenario_id"] == "scenario_1"

def test_list_and_get_incidents(client):
    """Test listing incidents and fetching a single incident by ID."""
    # Create one first
    create_res = client.post("/api/incidents", json={"title": "Test Fetch Incident", "affected_services": ["Database"]})
    inc_id = create_res.json()["id"]

    # List
    list_res = client.get("/api/incidents")
    assert list_res.status_code == 200
    inc_list = list_res.json()
    assert any(i["id"] == inc_id for i in inc_list)

    # Get by ID
    get_res = client.get(f"/api/incidents/{inc_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == inc_id

def test_get_nonexistent_incident_returns_404(client):
    """Test fetching an invalid incident ID returns HTTP 404."""
    response = client.get("/api/incidents/INC-NONEXISTENT")
    assert response.status_code == 404
    assert response.json()["detail"] == "Incident not found"
