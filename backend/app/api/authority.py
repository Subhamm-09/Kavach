"""Authority API Router.
Requires authenticated ROLE_AUTHORITY privileges.
Enforces strict Privacy-Guardian isolation: NO victim name, phone, or email is ever returned.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.case import Case
from backend.app.security.auth import require_authority_role
from backend.app.services.authority_service import AuthorityService
from backend.app.schemas.authority import (
    AuthorityDashboardSummary,
    SanitizedAuthorityCaseResponse,
)

router = APIRouter(prefix="/api/authority", tags=["Authority Intelligence Dashboard"])


@router.get("/dashboard", response_model=AuthorityDashboardSummary)
def get_authority_dashboard_summary(
    db: Session = Depends(get_db),
    current_authority: User = Depends(require_authority_role)
):
    """Retrieve high-level intelligence summary, correlated pattern table, and offender pattern cards.
    Protected strictly for authenticated authority personnel (ROLE_AUTHORITY).
    """
    return AuthorityService.get_dashboard_summary(db=db)


@router.get("/cases/{anonymized_case_id}", response_model=SanitizedAuthorityCaseResponse)
def get_sanitized_case_detail(
    anonymized_case_id: str,
    db: Session = Depends(get_db),
    current_authority: User = Depends(require_authority_role)
):
    """Retrieve detailed case investigation dossier.
    STRICT PRIVACY GUARANTEE: Victim PII is scrubbed and tokenized prior to serialization.
    """
    case_detail = AuthorityService.get_sanitized_case_detail(db=db, anonymized_case_id=anonymized_case_id)
    if not case_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Anonymized case '{anonymized_case_id}' not found in active authority registry."
        )
    return case_detail
