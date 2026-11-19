import pytest
from unittest.mock import patch, AsyncMock
from app.services.github_service import GitHubService

def test_get_integrations_list(client):
    """Test retrieving list of all configured integration adapters."""
    res = client.get("/api/integrations")
    assert res.status_code == 200
    adapters = res.json()
    assert len(adapters) >= 5
    ids = [a["id"] for a in adapters]
    assert "github" in ids
    assert "cloudwatch" in ids
    assert "docker" in ids

def test_connect_github_mocked(client):
    """Test connecting GitHub with a token."""
    res = client.post("/api/integrations/github/connect", json={"token": "ghp_mock_token_12345"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "connected"

def test_disconnect_integration(client):
    """Test disconnecting an integration."""
    res = client.post("/api/integrations/cloudwatch/disconnect")
    assert res.status_code == 200
    assert res.json()["status"] == "disconnected"

@pytest.mark.asyncio
async def test_github_service_offline_fallback():
    """Verify GitHubService provides offline simulated repositories when token is absent."""
    svc = GitHubService(token=None)
    repos = await svc.get_repositories()
    assert len(repos) > 0
    assert any(r["is_simulated"] for r in repos)

    commits = await svc.get_commits()
    assert len(commits) > 0
    assert any(c["is_simulated"] for c in commits)
