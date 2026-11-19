import httpx
from typing import List, Dict, Any, Optional
from app.services.redaction_service import redact_text

class GitHubService:
    BASE_URL = "https://api.github.com"

    def __init__(self, token: Optional[str] = None):
        self.token = token

    def get_headers(self) -> Dict[str, str]:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Causiq-AI-Agent"
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    async def verify_token(self) -> Dict[str, Any]:
        """Test authentication against GitHub API."""
        if not self.token:
            return {"valid": False, "username": None, "error": "No token provided"}
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(f"{self.BASE_URL}/user", headers=self.get_headers())
                if res.status_code == 200:
                    data = res.json()
                    return {"valid": True, "username": data.get("login"), "name": data.get("name")}
                return {"valid": False, "username": None, "error": f"GitHub returned HTTP {res.status_code}"}
        except Exception as e:
            return {"valid": False, "username": None, "error": str(e)}

    async def get_repositories(self) -> List[Dict[str, Any]]:
        """Fetch repositories live from GitHub API if authenticated, else return demo repos."""
        if not self.token:
            return self._demo_repositories()

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"{self.BASE_URL}/user/repos?sort=updated&per_page=12", headers=self.get_headers())
                if res.status_code == 200:
                    repos = res.json()
                    return [
                        {
                            "name": r.get("name"),
                            "full_name": r.get("full_name"),
                            "default_branch": r.get("default_branch", "main"),
                            "updated_at": r.get("updated_at"),
                            "is_private": r.get("private", False),
                            "is_simulated": False
                        }
                        for r in repos
                    ]
                return self._demo_repositories()
        except Exception:
            return self._demo_repositories()

    async def get_commits(self, owner: str = "rootcause-ai", repo: str = "auth-service") -> List[Dict[str, Any]]:
        """Fetch commits live from GitHub API if authenticated, else fallback to simulated commits."""
        if not self.token:
            return self._demo_commits()

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"{self.BASE_URL}/repos/{owner}/{repo}/commits?per_page=8"
                res = await client.get(url, headers=self.get_headers())
                if res.status_code == 200:
                    commits = res.json()
                    results = []
                    for c in commits:
                        sha = c.get("sha", "")[:7]
                        commit_obj = c.get("commit", {})
                        msg = commit_obj.get("message", "")
                        author = commit_obj.get("author", {}).get("name", "Unknown")
                        date = commit_obj.get("author", {}).get("date", "")
                        results.append({
                            "sha": sha,
                            "message": redact_text(msg),
                            "author": author,
                            "date": date,
                            "is_simulated": False
                        })
                    return results
                return self._demo_commits()
        except Exception:
            return self._demo_commits()

    def _demo_repositories(self) -> List[Dict[str, Any]]:
        return [
            {"name": "auth-service", "full_name": "promptwars/auth-service", "default_branch": "main", "updated_at": "2026-11-19T09:55:00Z", "is_private": True, "is_simulated": True},
            {"name": "order-api", "full_name": "promptwars/order-api", "default_branch": "main", "updated_at": "2026-11-19T08:30:00Z", "is_private": True, "is_simulated": True},
            {"name": "payment-worker", "full_name": "promptwars/payment-worker", "default_branch": "main", "updated_at": "2026-11-19T14:05:00Z", "is_private": True, "is_simulated": True},
            {"name": "infra-terraform", "full_name": "promptwars/infra-terraform", "default_branch": "main", "updated_at": "2026-11-18T16:20:00Z", "is_private": True, "is_simulated": True}
        ]

    def _demo_commits(self) -> List[Dict[str, Any]]:
        return [
            {
                "sha": "a7b8c9d",
                "message": "Update DB connection pool max_size from 50 to 5 and enable strict connection leak detection",
                "author": "sre-dev",
                "date": "2026-11-19T09:55:00Z",
                "is_simulated": True
            },
            {
                "sha": "f1e2d3c",
                "message": "Add unbounded in-memory cache for transaction event payloads before bulk flush",
                "author": "backend-lead",
                "date": "2026-11-19T14:08:00Z",
                "is_simulated": True
            },
            {
                "sha": "4b92e10",
                "message": "Refactor order search query to join user audit records without compound index",
                "author": "db-admin",
                "date": "2026-11-19T09:08:00Z",
                "is_simulated": True
            }
        ]
