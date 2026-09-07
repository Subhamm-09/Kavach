# KAVACH — Privacy Architecture & Guardian Subsystem

## 1. The Fundamental Privacy Invariant

> [!IMPORTANT]
> **MANDATORY INVARIANT**: Under no circumstances shall raw citizen Personally Identifiable Information (PII)—including victim names, raw phone numbers, raw email addresses, Aadhaar numbers, or exact residential addresses—be returned in responses to Authority endpoints or logged to immutable audit records.

---

## 2. PII Redaction & Tokenization Engine

Kavach employs a dual-layer sanitization pipeline combining regex-based scrubbing and deterministic keyed HMAC-SHA256 tokenization:

```
[ Citizen Raw Input ]
       |
       v
[ Regex Scrubber ] ------------> Replaces Names, Phone Numbers (+91/10-digit), Emails, Aadhaar with [REDACTED]
       |
       v
[ HMAC-SHA256 Engine ] --------> Generates Deterministic Token: TOK_USR_<HMAC(phone/email, SECRET_KEY)>
       |
       v
[ Sanitized Case Record ] -----> Stored & Serialized to Authority Hub
```

### 2.1. Redaction Patterns
- **Phone Numbers**: Matches `+91`, `0`, and standard 10-digit Indian mobile prefixes (`^[6-9]\d{9}$`). Replaced with `[PHONE_REDACTED]` or `[TOKENIZED_CONTACT]`.
- **Email Addresses**: Standard RFC 5322 regex. Replaced with `[EMAIL_REDACTED]`.
- **Aadhaar Numbers**: 12-digit Indian national identity pattern. Replaced with `[AADHAAR_REDACTED]`.
- **Citizen Names**: Named Entity & contextual keyword matching (e.g. `I am <Name>`, `My name is <Name>`). Replaced with `[CITIZEN_REDACTED]`.

### 2.2. Deterministic Tokenization (`TOK_USR_...`)
To enable law enforcement to link recurring incidents originating from the same victim without revealing the victim's true identity, Kavach computes an HMAC-SHA256 hash using a server-side secret key:

```python
# app/privacy/tokenization.py
import hmac
import hashlib

def tokenize_identifier(identifier: str, secret_key: str) -> str:
    digest = hmac.new(
        secret_key.encode("utf-8"),
        identifier.strip().lower().encode("utf-8"),
        hashlib.sha256
    ).hexdigest()[:10]
    return f"TOK_USR_{digest}"
```

---

## 3. Serialization Boundary Enforcement

Privacy is enforced at the schema and serialization boundary:

1. **Relational Database Separation**: Raw citizen accounts are stored in `users`, but cases reference only `victim_token`.
2. **Schema-Level Exclusion**: The Authority API endpoints (`/api/authority/*`) serialize responses using `SanitizedAuthorityCaseResponse`, which completely omits fields for `victim_name`, `phone`, and `email`.
3. **Audit Trail Scrubbing**: All agent reasoning steps pass through `PrivacyGuardianService.sanitize_for_audit()` before being written to `audit_events`.

---

## 4. Automated Test Verification

The privacy invariant is continuously tested in the test suite (`backend/tests/test_privacy_invariant.py`):

```bash
pytest backend/tests/test_privacy_invariant.py -v
```

### Verification Assertions:
1. `test_authority_privacy_invariant_no_pii_leakage`: Queries `/api/authority/cases/{case_id}` and asserts that no substring of the victim's name, email, or raw phone appears in the payload.
2. `test_authority_endpoint_blocks_unauthorized_users`: Asserts that citizen tokens receive HTTP 403 Forbidden.
3. `test_authority_endpoint_blocks_unauthenticated_requests`: Asserts that requests without tokens receive HTTP 401 Unauthorized.
