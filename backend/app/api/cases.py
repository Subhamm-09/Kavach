"""Cases & Incidents User-Facing API Routers."""

import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.case import Case
from backend.app.models.incident import Incident
from backend.app.security.auth import get_current_user_optional, get_current_user
from backend.app.privacy.guardian import PrivacyGuardianService
from backend.app.privacy.tokenization import generate_anonymized_case_id
from backend.app.agents.evidence_compiler import EvidenceCompilerAgent
from backend.app.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    CaseCreate,
    CaseUserResponse,
)
from backend.app.schemas.evidence import EvidenceDossier

cases_router = APIRouter(prefix="/api/cases", tags=["Cases"])
incidents_router = APIRouter(prefix="/api/incidents", tags=["Incidents"])
evidence_router = APIRouter(prefix="/api/evidence", tags=["Evidence Compiler"])


@incidents_router.post("/report", response_model=IncidentResponse)
def report_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Report a safety incident. Automatically triggers Privacy-Guardian sanitization."""
    user_id = current_user.id if current_user else None

    # Transform through Privacy Guardian
    sanitized = PrivacyGuardianService.transform_raw_incident(
        raw_narrative=payload.raw_narrative,
        perpetrator_description=payload.perpetrator_description
    )

    # Create associated Case
    case_id = str(uuid.uuid4())
    case = Case(
        id=case_id,
        tracking_number=f"CASE-2026-{uuid.uuid4().hex[:6].upper()}",
        anonymized_id=generate_anonymized_case_id(case_id),
        user_id=user_id,
        title=f"Incident Report: {payload.category} ({payload.area_name})",
        status="OPEN",
        severity=payload.severity or "MEDIUM",
        verification_status="UNVERIFIED",
        corroboration_count=1,
        privacy_guardian_applied=True,
    )
    db.add(case)
    db.commit()

    inc = Incident(
        id=f"INC-{uuid.uuid4().hex[:8].upper()}",
        case_id=case.id,
        user_id=user_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        area_name=payload.area_name,
        category=payload.category,
        severity=payload.severity or "MEDIUM",
        raw_narrative=payload.raw_narrative,
        sanitized_narrative=sanitized["sanitized_narrative"],
        perpetrator_description=payload.perpetrator_description,
        lighting_condition=payload.lighting_condition or "POOR",
        crowd_density=payload.crowd_density or "ISOLATED",
        status="REPORTED",
    )
    db.add(inc)
    db.commit()
    db.refresh(inc)

    return inc


@incidents_router.get("/recent", response_model=List[IncidentResponse])
def get_recent_incidents(limit: int = 20, db: Session = Depends(get_db)):
    """Retrieve recent safety incident markers for map overlay."""
    incidents = db.query(Incident).order_by(Incident.timestamp.desc()).limit(limit).all()
    return incidents


@cases_router.get("", response_model=List[CaseUserResponse])
def list_user_cases(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Retrieve cases created by the user or recent public/demo cases."""
    if current_user:
        cases = db.query(Case).filter(Case.user_id == current_user.id).order_by(Case.created_at.desc()).all()
    else:
        cases = db.query(Case).order_by(Case.created_at.desc()).limit(10).all()
    return cases


@cases_router.get("/{case_id}", response_model=CaseUserResponse)
def get_case_by_id(case_id: str, db: Session = Depends(get_db)):
    """Retrieve user-facing case details."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        case = db.query(Case).filter(Case.tracking_number == case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")
    return case


@evidence_router.get("/dossier/{case_id}", response_model=EvidenceDossier)
def get_evidence_dossier(case_id: str, db: Session = Depends(get_db)):
    """Compile and retrieve structured evidence dossier for a case."""
    return EvidenceCompilerAgent.compile_case_dossier(db=db, case_id=case_id)
