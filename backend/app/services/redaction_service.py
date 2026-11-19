import re

# Redact common secrets, tokens, API keys and passwords
PATTERNS = [
    (r"(?i)(password|passwd|pwd)[\s]*[:=][\s]*['\"]?([^\s'\",&]+)['\"]?", r"\1: [REDACTED_SECRET]"),
    (r"(?i)(bearer|token|access_token|auth_token)[\s]*[:=][\s]*['\"]?([^\s'\",&]+)['\"]?", r"\1: [REDACTED_TOKEN]"),
    (r"(?i)(api[_-]?key|secret[_-]?key)[\s]*[:=][\s]*['\"]?([^\s'\",&]+)['\"]?", r"\1: [REDACTED_KEY]"),
    (r"ghp_[a-zA-Z0-9]{36}", "[REDACTED_GITHUB_PAT]"),
    (r"AKIA[0-9A-Z]{16}", "[REDACTED_AWS_KEY]"),
    (r"(?i)postgres(?:ql)?://([^:]+):([^@]+)@", r"postgres://\1:[REDACTED_PWD]@"),
    (r"(?i)mysql://([^:]+):([^@]+)@", r"mysql://\1:[REDACTED_PWD]@")
]

def redact_text(text: str) -> str:
    if not text:
        return text
    redacted = text
    for pattern, replacement in PATTERNS:
        redacted = re.sub(pattern, replacement, redacted)
    return redacted
