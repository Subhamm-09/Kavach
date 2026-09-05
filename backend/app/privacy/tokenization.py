"""Deterministic tokenization module for pseudonymizing PII."""

import hashlib
import hmac
from backend.app.config import settings


def tokenize_identifier(raw_value: str, prefix: str = "TOKEN") -> str:
    """Deterministically tokenize a sensitive identifier (e.g., phone, email, name)
    using HMAC-SHA256 so identical values produce identical tokens for correlation
    without exposing underlying PII.
    """
    if not raw_value:
        return f"{prefix}-ANON-0000"
    
    clean_val = raw_value.strip().lower()
    digest = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        clean_val.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()[:10].upper()
    
    return f"{prefix}-{digest}"


def tokenize_phone(raw_phone: str) -> str:
    """Tokenize a phone number (e.g. '+91-9876543210' -> 'TOKEN-TEL-7B29F4')"""
    return tokenize_identifier(raw_phone, prefix="TOKEN-TEL")


def tokenize_email(raw_email: str) -> str:
    """Tokenize an email (e.g. 'victim@example.com' -> 'TOKEN-USR-9D41A2')"""
    return tokenize_identifier(raw_email, prefix="TOKEN-USR")


def generate_anonymized_case_id(case_uuid: str) -> str:
    """Generate a clean anonymized case identifier (e.g., 'KV-CASE-4F9A2B')"""
    short_hash = hashlib.sha256(case_uuid.encode("utf-8")).hexdigest()[:6].upper()
    return f"KV-CASE-{short_hash}"
