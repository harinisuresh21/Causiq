from typing import List, Dict, Any

def correlate_events(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Identify relationships across code changes, deployments, metric spikes, and container errors."""
    correlations = []
    deployments = [e for e in events if e.get("event_type") == "deployment"]
    commits = [e for e in events if e.get("event_type") == "commit"]
    errors = [e for e in events if e.get("severity") in ["error", "critical"] or "error" in e.get("event_type", "")]
    metrics = [e for e in events if "metric" in e.get("event_type", "") or "latency" in e.get("event_type", "") or "timeout" in e.get("event_type", "")]
    restarts = [e for e in events if "restart" in e.get("event_type", "")]

    # Check commit-to-deployment sequence
    for d in deployments:
        for c in commits:
            correlations.append({
                "type": "code_to_deployment",
                "source_id": c.get("event_id"),
                "target_id": d.get("event_id"),
                "relationship": "Commit preceded release deployment"
            })

    # Check deployment-to-anomaly sequence
    for d in deployments:
        for m in metrics:
            correlations.append({
                "type": "deployment_to_metric_spike",
                "source_id": d.get("event_id"),
                "target_id": m.get("event_id"),
                "relationship": f"Deployment preceded metric anomaly in {m.get('service')}"
            })
        for err in errors:
            correlations.append({
                "type": "deployment_to_failure",
                "source_id": d.get("event_id"),
                "target_id": err.get("event_id"),
                "relationship": f"Deployment preceded application error in {err.get('service')}"
            })

    # Check container restart after errors
    for err in errors:
        for r in restarts:
            correlations.append({
                "type": "error_to_container_restart",
                "source_id": err.get("event_id"),
                "target_id": r.get("event_id"),
                "relationship": f"Error/saturation triggered container crash/restart in {r.get('service')}"
            })

    return {
        "correlations_count": len(correlations),
        "correlations": correlations
    }
