from typing import Dict, Any, List

class AWSCloudWatchAdapter:
    def __init__(self, region: str = "us-east-1"):
        self.region = region

    def get_alarms(self) -> List[Dict[str, Any]]:
        return [
            {
                "alarm_name": "RDS-HighConnectionLatency",
                "state": "ALARM",
                "metric": "ConnectionAcquisitionWaitTime",
                "threshold": 5000,
                "current_value": 5210,
                "timestamp": "2026-11-19T10:02:15Z",
                "is_simulated": True
            },
            {
                "alarm_name": "API-P95LatencySpike",
                "state": "ALARM",
                "metric": "TargetResponseTime",
                "threshold": 500,
                "current_value": 2520,
                "timestamp": "2026-11-19T09:15:20Z",
                "is_simulated": True
            }
        ]

class DockerAdapter:
    def get_container_events(self) -> List[Dict[str, Any]]:
        return [
            {
                "container_name": "auth-service-prod-1",
                "status": "restarting",
                "exit_code": 137,
                "reason": "Liveness probe timeout",
                "timestamp": "2026-11-19T10:06:22Z",
                "is_simulated": True
            },
            {
                "container_name": "payment-worker-pod",
                "status": "terminated",
                "exit_code": 137,
                "reason": "OOMKilled",
                "timestamp": "2026-11-19T14:30:05Z",
                "is_simulated": True
            }
        ]

class PrometheusAdapter:
    def get_active_alerts(self) -> List[Dict[str, Any]]:
        return [
            {
                "alertname": "DbConnectionPoolExhausted",
                "severity": "critical",
                "instance": "postgres-primary:5432",
                "description": "Active connections 100% of maximum pool size",
                "is_simulated": True
            }
        ]

class JenkinsAdapter:
    def get_recent_builds(self) -> List[Dict[str, Any]]:
        return [
            {
                "job": "prod-deploy-pipeline",
                "number": 412,
                "result": "SUCCESS",
                "commit": "a7b8c9d",
                "timestamp": "2026-11-19T10:00:00Z",
                "is_simulated": True
            }
        ]
