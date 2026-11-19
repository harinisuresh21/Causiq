from datetime import datetime, timedelta
from typing import List, Dict, Any

SCENARIOS: Dict[str, Dict[str, Any]] = {
    "scenario_1": {
        "id": "scenario_1",
        "title": "Database Connection Pool Exhaustion & Auth API Outage",
        "service": "Database / Authentication Service",
        "severity": "critical",
        "description": "Post-deployment cascading HTTP 500 errors across Authentication and Order APIs triggered by connection timeouts and pool exhaustion.",
        "affected_services": ["Database", "Authentication Service", "Order API", "API Gateway"],
        "events": [
            {
                "event_id": "EV-101",
                "source": "jenkins",
                "service": "API Gateway",
                "timestamp": "2026-11-19T10:00:00Z",
                "severity": "info",
                "event_type": "deployment",
                "description": "Production release v2.4.1 completed. Deployed by pipeline #412.",
                "metadata": {"pipeline": "prod-deploy-pipeline", "build_num": 412, "commit_sha": "a7b8c9d"}
            },
            {
                "event_id": "EV-102",
                "source": "github",
                "service": "Authentication Service",
                "timestamp": "2026-11-19T09:55:00Z",
                "severity": "info",
                "event_type": "commit",
                "description": "Commit a7b8c9d: 'Update DB connection pool max_size from 50 to 5 and enable strict connection leak detection'",
                "metadata": {"author": "dev-lead", "commit": "a7b8c9d", "file": "config/database.yaml"}
            },
            {
                "event_id": "EV-103",
                "source": "cloudwatch",
                "service": "Database",
                "timestamp": "2026-11-19T10:02:15Z",
                "severity": "warning",
                "event_type": "db_timeout",
                "description": "AWS RDS PostgreSQL: Connection acquisition latency exceeded 5000ms threshold for auth-db cluster.",
                "metadata": {"metric": "ConnectionAcquisitionWaitTime", "value": 5210, "threshold": 5000}
            },
            {
                "event_id": "EV-104",
                "source": "application_logs",
                "service": "Authentication Service",
                "timestamp": "2026-11-19T10:03:04Z",
                "severity": "error",
                "event_type": "app_error",
                "description": "TimeoutError: QueuePool limit of size 5 overflow 10 reached, connection timed out, timeout 30.00 (Background on this error at: https://sqlalche.me/e/20/3o7r)",
                "metadata": {"status_code": 500, "endpoint": "/api/v1/auth/login", "client_ip": "10.0.4.12"}
            },
            {
                "event_id": "EV-105",
                "source": "application_logs",
                "service": "Order API",
                "timestamp": "2026-11-19T10:04:12Z",
                "severity": "error",
                "event_type": "app_error",
                "description": "Failed to validate user bearer token: Auth service returned HTTP 500 Internal Server Error. Aborting order checkout flow.",
                "metadata": {"status_code": 500, "endpoint": "/api/v1/orders/checkout"}
            },
            {
                "event_id": "EV-106",
                "source": "prometheus",
                "service": "Database",
                "timestamp": "2026-11-19T10:05:00Z",
                "severity": "critical",
                "event_type": "monitoring_alert",
                "description": "ALERT fired: DbConnectionPoolExhausted - Active connections 100% of maximum pool size for > 3 minutes.",
                "metadata": {"alert_name": "DbConnectionPoolExhausted", "severity": "critical"}
            },
            {
                "event_id": "EV-107",
                "source": "docker",
                "service": "Authentication Service",
                "timestamp": "2026-11-19T10:06:22Z",
                "severity": "error",
                "event_type": "container_restart",
                "description": "Container auth-service-prod-1 restart triggered by Kubernetes liveness probe failure (HTTP GET /health returned 503).",
                "metadata": {"exit_code": 137, "container_id": "c71a82f3b90e", "restart_count": 3}
            }
        ]
    },
    "scenario_2": {
        "id": "scenario_2",
        "title": "Severe Memory Leak and OOMKilled Container Restarts",
        "service": "Background Worker / Payment Service",
        "severity": "critical",
        "description": "Gradual memory ballooning post-deployment leading to memory saturation at 92% and recurring container OOM crashes.",
        "affected_services": ["Background Worker", "Payment Service", "Docker"],
        "events": [
            {
                "event_id": "EV-201",
                "source": "cloudwatch",
                "service": "Background Worker",
                "timestamp": "2026-11-19T14:00:00Z",
                "severity": "info",
                "event_type": "monitoring_metric",
                "description": "Baseline memory utilization stable at 45% (920MB / 2048MB allocated).",
                "metadata": {"metric": "MemoryUtilization", "value": 45}
            },
            {
                "event_id": "EV-202",
                "source": "jenkins",
                "service": "Background Worker",
                "timestamp": "2026-11-19T14:10:00Z",
                "severity": "info",
                "event_type": "deployment",
                "description": "Production release v3.1.0 completed. Added batch event caching mechanism in worker consumer.",
                "metadata": {"pipeline": "worker-deploy", "build_num": 89, "commit_sha": "f1e2d3c"}
            },
            {
                "event_id": "EV-203",
                "source": "github",
                "service": "Background Worker",
                "timestamp": "2026-11-19T14:08:00Z",
                "severity": "info",
                "event_type": "commit",
                "description": "Commit f1e2d3c: 'Add unbounded in-memory cache for transaction event payloads before bulk flush'",
                "metadata": {"author": "sre-dev", "file": "workers/transaction_consumer.py"}
            },
            {
                "event_id": "EV-204",
                "source": "cloudwatch",
                "service": "Background Worker",
                "timestamp": "2026-11-19T14:15:30Z",
                "severity": "warning",
                "event_type": "monitoring_metric",
                "description": "Memory utilization increased rapidly to 70% (1433MB). Rate of heap expansion: +25MB/minute.",
                "metadata": {"metric": "MemoryUtilization", "value": 70}
            },
            {
                "event_id": "EV-205",
                "source": "prometheus",
                "service": "Background Worker",
                "timestamp": "2026-11-19T14:25:10Z",
                "severity": "critical",
                "event_type": "monitoring_alert",
                "description": "ALERT HighMemoryUsage: Container memory saturation at 92.4% (1892MB / 2048MB cgroup limit).",
                "metadata": {"alert": "ContainerMemoryNearLimit", "threshold": 90}
            },
            {
                "event_id": "EV-206",
                "source": "docker",
                "service": "Background Worker",
                "timestamp": "2026-11-19T14:30:05Z",
                "severity": "critical",
                "event_type": "container_restart",
                "description": "Container payment-worker-pod killed by Linux kernel OOM (Out Of Memory) Killer (Exit Code 137).",
                "metadata": {"exit_code": 137, "reason": "OOMKilled", "container": "worker-core-01"}
            }
        ]
    },
    "scenario_3": {
        "id": "scenario_3",
        "title": "API Latency Spike & Query Plan Regression",
        "service": "API Gateway / Database",
        "severity": "high",
        "description": "API latency jumped from 180ms to 2500ms following an unindexed table join migration, degrading user checkout requests.",
        "affected_services": ["API Gateway", "Database", "Payment Service"],
        "events": [
            {
                "event_id": "EV-301",
                "source": "cloudwatch",
                "service": "API Gateway",
                "timestamp": "2026-11-19T09:00:00Z",
                "severity": "info",
                "event_type": "monitoring_metric",
                "description": "P95 API average response time stable at 180ms across all endpoints.",
                "metadata": {"metric": "P95Latency", "value": 180, "unit": "ms"}
            },
            {
                "event_id": "EV-302",
                "source": "jenkins",
                "service": "Database",
                "timestamp": "2026-11-19T09:10:00Z",
                "severity": "info",
                "event_type": "deployment",
                "description": "Migration pipeline completed: applied migration 0082_expand_user_history_joins.sql.",
                "metadata": {"migration": "0082_expand_user_history_joins.sql", "executor": "db-ci"}
            },
            {
                "event_id": "EV-303",
                "source": "github",
                "service": "Database",
                "timestamp": "2026-11-19T09:08:00Z",
                "severity": "warning",
                "event_type": "commit",
                "description": "Commit 4b92e10: 'Refactor order search query to join user audit records without compound index'",
                "metadata": {"author": "backend-eng", "file": "queries/order_history.sql"}
            },
            {
                "event_id": "EV-304",
                "source": "cloudwatch",
                "service": "API Gateway",
                "timestamp": "2026-11-19T09:15:20Z",
                "severity": "warning",
                "event_type": "latency_spike",
                "description": "P95 latency spiked to 2,520ms on GET /api/v1/orders/history. Throughput dropped 40%.",
                "metadata": {"metric": "P95Latency", "value": 2520, "unit": "ms"}
            },
            {
                "event_id": "EV-305",
                "source": "prometheus",
                "service": "Database",
                "timestamp": "2026-11-19T09:18:45Z",
                "severity": "critical",
                "event_type": "monitoring_alert",
                "description": "ALERT HighDatabaseCPU: PostgreSQL primary instance CPU sustained at 94% due to sequential table scans.",
                "metadata": {"cpu_percent": 94.2, "alert": "HighDatabaseCPU"}
            },
            {
                "event_id": "EV-306",
                "source": "application_logs",
                "service": "API Gateway",
                "timestamp": "2026-11-19T09:20:10Z",
                "severity": "error",
                "event_type": "app_error",
                "description": "GatewayTimeout: Downstream payment-service upstream request timed out after 3000ms deadline exceeded.",
                "metadata": {"status_code": 504, "endpoint": "/api/v1/orders/history"}
            }
        ]
    }
}
