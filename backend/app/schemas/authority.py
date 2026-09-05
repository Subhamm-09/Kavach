"""Pydantic schemas for Authority-facing endpoints.
Strictly isolated from raw victim PII by the Privacy-Guardian Agent.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AuthorityPrivacyBanner(BaseModel):
    victim_name_status: str = "[REDACTED]"
    victim_phone_status: str = "[TOKENIZED]"
    victim_email_status: str = "[REDACTED]"
    victim_identity_access: str = "RESTRICTED / NOT_AVAILABLE"
    privacy_guardian_certified: bool = True
    tokenized_subject_ref: str


class SanitizedIncidentAuthorityView(BaseModel):
    incident_id: str
    timestamp: datetime
    approximate_latitude: float
    approximate_longitude: float
    area_name: str
    category: str
    severity: str
    # Strictly sanitized narrative (PII redacted/tokenized)
    sanitized_narrative: str
    # Extracted perpetrator physical and behavioral descriptors
    perpetrator_pattern_descriptors: Optional[str] = None
    lighting_condition: str
    crowd_density: str


class AuthorityCandidateMatch(BaseModel):
    candidate_id: str
    offender_id: str
    fictional_alias_or_code: str
    similarity_score: float
    matched_attributes: Optional[Dict[str, Any]] = None
    risk_tier: str
    status: str


class SanitizedAuthorityCaseResponse(BaseModel):
    # Public anonymized ID
    anonymized_case_id: str
    title: str
    status: str
    severity: str
    verification_status: str  # UNVERIFIED, NEEDS_HUMAN_REVIEW, VERIFIED, REJECTED
    corroboration_count: int
    corroboration_threshold: int = 3
    extracted_pattern: Optional[Dict[str, Any]] = None
    
    # Prominent Privacy Guardian transformation panel
    privacy_panel: AuthorityPrivacyBanner
    
    # Sanitized Incidents list (no victim PII)
    sanitized_incidents: List[SanitizedIncidentAuthorityView] = []
    
    # Vector-matched candidates
    candidates: List[AuthorityCandidateMatch] = []
    
    created_at: datetime
    updated_at: datetime


class CorrelatedPatternItem(BaseModel):
    anonymized_case_id: str
    incident_pattern: str
    area_cluster: str
    candidate_offender_code: Optional[str] = None
    similarity_score: Optional[float] = None
    corroboration_count: int
    verification_status: str
    risk_tier: str
    trend: str  # e.g., "Rising in Evening", "Cluster Spike"
    last_event_timestamp: datetime


class OffenderPatternCard(BaseModel):
    offender_code: str
    fictional_name: str
    aliases: Optional[str] = None
    risk_tier: str
    registered_zone: str
    incident_cluster_count: int
    matched_cases_count: int
    verification_status: str
    modus_operandi_summary: str
    last_known_lat: float
    last_known_lng: float


class AuthorityDashboardSummary(BaseModel):
    total_active_cases: int
    total_flagged_clusters: int
    pending_verification_count: int
    verified_serial_patterns: int
    privacy_redaction_rate_percent: float = 100.0
    correlated_patterns: List[CorrelatedPatternItem]
    offender_patterns: List[OffenderPatternCard]
    active_risk_zones_count: int
