def test_health_check_returns_200(client):
    """Test backend health endpoint returns HTTP 200 with valid schema."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Causiq" in data["service"]
    assert "version" in data
    assert "timestamp" in data

def test_dashboard_stats_endpoint(client):
    """Test dashboard stats endpoint returns correctly formatted metrics."""
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "services" in data
    assert "recent_deployments" in data
    assert "incident_trend" in data
    assert isinstance(data["services"], list)
    assert len(data["services"]) > 0
