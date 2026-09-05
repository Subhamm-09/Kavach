"""PII Redaction and entity scrubbing module."""

import re
from typing import Tuple, List

# Regex patterns for common Indian and international PII entities
PHONE_REGEX = re.compile(r'(?:\+?91[\-\s]?)?[6-9]\d{9}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
AADHAAR_REGEX = re.compile(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b')
VEHICLE_REG_REGEX = re.compile(r'\bOD[\s-]?[0-9]{2}[\s-]?[A-Z]{1,2}[\s-]?[0-9]{4}\b', re.IGNORECASE)

# Common personal indicator phrases
NAME_INDICATORS = [
    r'(?:my name is|i am|this is|myself)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
    r'(?:complainant|victim)\s+name(?:\s+is)?\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
]


def redact_pii_from_text(raw_text: str) -> Tuple[str, List[str]]:
    """Scrub direct personal identifiers from narrative text while preserving
    contextual incident details, environmental descriptors, and perpetrator traits.
    
    Returns:
        (sanitized_text, list_of_redacted_entity_types)
    """
    if not raw_text:
        return "", []

    sanitized = raw_text
    redacted_types = []

    # 1. Redact Emails
    if EMAIL_REGEX.search(sanitized):
        sanitized = EMAIL_REGEX.sub("[REDACTED-EMAIL]", sanitized)
        redacted_types.append("EMAIL")

    # 2. Redact Phone Numbers
    if PHONE_REGEX.search(sanitized):
        sanitized = PHONE_REGEX.sub("[TOKENIZED-PHONE]", sanitized)
        redacted_types.append("PHONE")

    # 3. Redact Aadhaar / National ID
    if AADHAAR_REGEX.search(sanitized):
        sanitized = AADHAAR_REGEX.sub("[REDACTED-ID]", sanitized)
        redacted_types.append("NATIONAL_ID")

    # 4. Redact Self-Identifying Name Patterns
    for pattern in NAME_INDICATORS:
        matches = re.finditer(pattern, sanitized, re.IGNORECASE)
        for match in matches:
            full_match = match.group(0)
            name_part = match.group(1) if match.groups() else ""
            if name_part:
                sanitized = sanitized.replace(name_part, "[VICTIM-NAME-REDACTED]")
                redacted_types.append("NAME")

    return sanitized, list(set(redacted_types))
