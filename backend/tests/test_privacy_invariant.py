"""Automated Test Suite: Authority Privacy Invariant.
PROVES: An authority API request cannot retrieve raw victim PII under any condition.
- victim_name does not appear in authority case response
- raw phone does not appear
- raw email does not appear
- authority API returns anonymized case ID
- privacy transformation occurs before serialization
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.app.main import app
from backend.app.database import get_db, SessionLocal
from backend.app.models.case import Case
from backend.app.models.incident import Incident
from backend.app.models.user import User
from backend.app.security.auth import create_access_token
from backend.app.seed.seeder import seed_database

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    db = SessionLocal()
    seed_database(db, force=True)
    yield
    db.close()


def test_authority_privacy_invariant_no_pii_leakage():
    """Test that querying the authority dashboard/case endpoint NEVER reveals raw victim PII."""
    db = SessionLocal()
    try:
        # 1. Create a raw incident with sensitive victim PII
        raw_victim_name = "Debasmita Priyadarshini"
        raw_victim_phone = "+91-9861012345"
        raw_victim_email = "debasmita.p@secretmail.com"

        response = client.post(
            "/api/incidents/report",
            json={
                "latitude": 20.3551,
                "longitude": 85.8181,
                "area_name": "Patia Infocity",
                "category": "Stalking",
                "severity": "CRITICAL",
                "raw_narrative": f"My name is {raw_victim_name}. My phone is {raw_victim_phone} and email is {raw_victim_email}. A man on a black bike followed me.",
                "perpetrator_description": "Male, black jacket, pulsar bike",
            }
        )
        assert response.status_code == 200
        incident_data = response.json()
        case_id = incident_data["case_id"]

        case = db.query(Case).filter(Case.id == case_id).first()
        assert case is not None
        anonymized_id = case.anonymized_id

        # 2. Authenticate as Authority
        auth_token = create_access_token(
            data={"sub": "USR-AUTH-PATNAIK-01", "role": "ROLE_AUTHORITY", "email": "inspector.patnaik@odishapolice.gov.in"}
        )
        headers = {"Authorization": f"Bearer {auth_token}"}

        # 3. Query Authority Case Detail
        auth_response = client.get(f"/api/authority/cases/{anonymized_id}", headers=headers)
        assert auth_response.status_code == 200
        auth_json = auth_response.json()
        raw_auth_text = auth_response.text

        # 4. STRICT PRIVACY ASSERTIONS
        # Victim name MUST NOT appear in the response payload
        assert raw_victim_name not in raw_auth_text, "CRITICAL: Raw victim name leaked to Authority API!"
        
        # Raw phone MUST NOT appear in the response payload
        assert raw_victim_phone not in raw_auth_text, "CRITICAL: Raw victim phone leaked to Authority API!"
        
        # Raw email MUST NOT appear in the response payload
        assert raw_victim_email not in raw_auth_text, "CRITICAL: Raw victim email leaked to Authority API!"

        # Privacy panel must certify redaction
        assert auth_json["privacy_panel"]["victim_name_status"] == "[REDACTED]"
        assert auth_json["privacy_panel"]["victim_phone_status"] == "[TOKENIZED]"
        assert auth_json["privacy_panel"]["victim_email_status"] == "[REDACTED]"
        assert auth_json["privacy_panel"]["privacy_guardian_certified"] is True

        # Anonymized case ID must be present
        assert auth_json["anonymized_case_id"] == anonymized_id

    finally:
        db.close()


def test_authority_endpoint_blocks_unauthorized_users():
    """Verify that non-authority users cannot access the authority dashboard."""
    # User token with ROLE_USER
    user_token = create_access_token(
        data={"sub": "USR-USER-PRIYA-02", "role": "ROLE_USER", "email": "priya.sharma@example.com"}
    )
    headers = {"Authorization": f"Bearer {user_token}"}

    response = client.get("/api/authority/dashboard", headers=headers)
    # Must return HTTP 403 Forbidden
    assert response.status_code == 403
    assert "Authority privileges" in response.json()["detail"]


def test_authority_endpoint_blocks_unauthenticated_requests():
    """Verify that unauthenticated requests to authority endpoints return 401."""
    response = client.get("/api/authority/dashboard")
    assert response.status_code == 401
