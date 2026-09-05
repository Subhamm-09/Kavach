"""Pydantic schemas for Culprit Vector Matching and Verification."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class OffenderMatchQuery(BaseModel):
    case_id: Optional[str] = None
    incident_narrative: Optional[str] = None
    perpetrator_description: str
    location_zone: Optional[str] = None
    top_k: Optional[int] = 3


class CandidateMatchResult(BaseModel):
    offender_id: str
    offender_code: str
    fictional_name: str
    aliases: Optional[str] = None
    similarity_score: float  # 0.0 to 1.0
    is_above_threshold: bool
    risk_tier: str
    registered_zone: str
    matched_traits: List[str]
    match_rationale: str
    conviction_summary: Optional[str] = None


class OffenderMatchResponse(BaseModel):
    query_id: str
    case_id: Optional[str] = None
    total_candidates_found: int
    similarity_threshold_used: float
    candidates: List[CandidateMatchResult]
    passed_to_verification: bool
    notice: str = "Vector similarity generates investigative candidates only. Guilt is determined solely via formal judicial process."


class VerificationEvaluationRequest(BaseModel):
    case_id: str
    candidate_id: Optional[str] = None
    offender_id: str
    verification_path: Optional[str] = "PATH_B_CORROBORATION"  # PATH_A_REGISTRY or PATH_B_CORROBORATION
    corroboration_reports_count: Optional[int] = 1


class VerificationEvaluationResponse(BaseModel):
    case_id: str
    offender_id: str
    verification_path: str
    outcome: str  # VERIFIED, REJECTED, NEEDS_HUMAN_REVIEW
    corroboration_count: int
    corroboration_threshold: int
    confidence_score: float
    decision_reason: str
    audit_event_logged: bool
    verified_at: datetime
