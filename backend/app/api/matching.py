"""Culprit Vector Matching and Verification API Routers."""

import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models.offender import Offender
from backend.app.models.case import Case
from backend.app.agents.culprit_matching import CulpritMatchingModule
from backend.app.agents.verification import VerificationAgent
from backend.app.schemas.matching import (
    OffenderMatchQuery,
    OffenderMatchResponse,
    CandidateMatchResult,
    VerificationEvaluationRequest,
    VerificationEvaluationResponse,
)

matching_router = APIRouter(prefix="/api/matching", tags=["Culprit Matching"])
verification_router = APIRouter(prefix="/api/verification", tags=["Verification"])
offenders_router = APIRouter(prefix="/api/offenders", tags=["Mock Offender Registry"])


@matching_router.post("/culprit-search", response_model=OffenderMatchResponse)
def match_culprit_description(payload: OffenderMatchQuery, db: Session = Depends(get_db)):
    """Embed narrative/description, query ChromaDB collection 'kavach_offender_profiles',
    and retrieve candidate matches. Similarity is candidate generation, NOT guilt proof.
    """
    candidates_raw = CulpritMatchingModule.match_candidates(
        db=db,
        perpetrator_description=payload.perpetrator_description,
        case_id=payload.case_id,
        top_k=payload.top_k or 3,
    )

    candidates = [CandidateMatchResult(**c) for c in candidates_raw]

    return OffenderMatchResponse(
        query_id=str(uuid.uuid4()),
        case_id=payload.case_id,
        total_candidates_found=len(candidates),
        similarity_threshold_used=settings.MATCH_SIMILARITY_THRESHOLD,
        candidates=candidates,
        passed_to_verification=True if candidates else False,
        notice="Vector similarity generates investigative candidates only. Guilt is determined solely via formal judicial process.",
    )


@verification_router.post("/evaluate", response_model=VerificationEvaluationResponse)
def evaluate_candidate_verification(payload: VerificationEvaluationRequest, db: Session = Depends(get_db)):
    """Evaluate candidate through Path A (Mock Registry match) or Path B (Independent Corroboration)."""
    result = VerificationAgent.evaluate_candidate(
        db=db,
        offender_id=payload.offender_id,
        case_id=payload.case_id,
        candidate_id=payload.candidate_id,
        verification_path=payload.verification_path or "PATH_B_CORROBORATION",
        corroboration_reports_count=payload.corroboration_reports_count or 1,
    )

    return VerificationEvaluationResponse(
        case_id=result["case_id"],
        offender_id=result["offender_id"],
        verification_path=result["verification_path"],
        outcome=result["outcome"],
        corroboration_count=result["corroboration_count"],
        corroboration_threshold=result["corroboration_threshold"],
        confidence_score=result["confidence_score"],
        decision_reason=result["decision_reason"],
        audit_event_logged=True,
        verified_at=result["verified_at"],
    )


@offenders_router.get("")
def list_mock_offenders(db: Session = Depends(get_db)):
    """Retrieve fictional offender profiles in the demo mock registry."""
    offenders = db.query(Offender).all()
    return [{
        "id": o.id,
        "offender_code": o.offender_code,
        "fictional_name": o.fictional_full_name,
        "aliases": o.aliases,
        "approximate_age": o.approximate_age,
        "build": o.build,
        "distinguishing_marks": o.distinguishing_marks,
        "modus_operandi": o.modus_operandi,
        "registered_zone": o.registered_zone,
        "risk_tier": o.risk_tier,
        "sections_charged": o.sections_charged,
        "is_verified": o.is_verified_in_registry,
        "disclaimer": "Fictional mock registry profile — not an actual government database.",
    } for o in offenders]
