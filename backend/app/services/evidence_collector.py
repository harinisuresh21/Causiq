from typing import List, Dict, Any

def normalize_event(
    event_id: str,
    source: str,
    service: str,
    timestamp: str,
    severity: str,
    event_type: str,
    description: str,
    metadata: Dict[str, Any] = None,
    is_simulated: bool = False
) -> Dict[str, Any]:
    """Normalize incoming raw evidence into canonical event schema."""
    return {
        "event_id": event_id,
        "source": source.lower().strip(),
        "service": service.strip(),
        "timestamp": timestamp,
        "severity": severity.lower().strip(),
        "event_type": event_type.lower().strip(),
        "description": description.strip(),
        "metadata": metadata or {},
        "is_simulated": is_simulated
    }

def build_chronological_timeline(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Sort events chronologically by ISO timestamp."""
    def parse_time(e):
        return e.get("timestamp", "")
    return sorted(events, key=parse_time)
