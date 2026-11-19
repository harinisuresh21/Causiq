import re
from typing import List, Dict, Any
from app.services.redaction_service import redact_text

LOG_PATTERN = re.compile(
    r"(?P<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s+"
    r"\[?(?P<severity>INFO|WARN|WARNING|ERROR|FATAL|CRITICAL)\]?\s+"
    r"(?:\[(?P<service>[\w\-]+)\]\s+)?(?P<message>.*)"
)

def parse_raw_log_lines(raw_text: str, default_service: str = "app-service") -> List[Dict[str, Any]]:
    """Parse unstructured log lines into normalized evidence events."""
    events = []
    lines = raw_text.strip().split("\n")
    idx = 1
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        redacted = redact_text(line)
        match = LOG_PATTERN.match(redacted)
        
        if match:
            gd = match.groupdict()
            sev = gd["severity"].lower()
            if sev == "warn":
                sev = "warning"
            elif sev in ["fatal", "critical"]:
                sev = "critical"
                
            events.append({
                "event_id": f"LOG-{idx:03d}",
                "source": "application_logs",
                "service": gd["service"] or default_service,
                "timestamp": gd["timestamp"],
                "severity": sev,
                "event_type": "app_error" if sev in ["error", "critical"] else "log_entry",
                "description": gd["message"],
                "metadata": {"raw_line": redacted}
            })
        else:
            # Fallback simple line parser
            sev = "error" if "error" in redacted.lower() or "exception" in redacted.lower() else "info"
            events.append({
                "event_id": f"LOG-{idx:03d}",
                "source": "application_logs",
                "service": default_service,
                "timestamp": "2026-11-19T10:00:00Z",
                "severity": sev,
                "event_type": "app_error" if sev == "error" else "log_entry",
                "description": redacted,
                "metadata": {"raw_line": redacted}
            })
        idx += 1
        
    return events
