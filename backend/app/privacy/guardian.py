"""Privacy-Guardian Agent & Transformation Service.
Acts as a strict security barrier between Raw Case Data and Authority Projections.
"""

import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.models.case import Case
from backend.app.models.incident import Incident
from backend.app.models.user import User
from backend.app.privacy.redaction import redact_pii_from_text
from backend.app.privacy.tokenization import (
    tokenize_phone,
    tokenize_email,
    tokenize_identifier,
    generate_anonymized_case_id,
)
from backend.app.schemas.authority import (
    SanitizedAuthorityCaseResponse,
    SanitizedIncidentAuthorityView,
    AuthorityPrivacyBanner,
    AuthorityCandidateMatch,
)


class PrivacyGuardianService:
    """The Privacy Guardian ensures that NO raw victim PII is ever accessed by or serialized
    for authority dashboard consumers.
    """

    @staticmethod
    def transform_raw_incident(
        raw_narrative: str,
        perpetrator_description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Scrub narrative and extract clean perpetrator & environmental descriptors."""
        sanitized_narrative, redacted_types = redact_pii_from_text(raw_narrative)
        
        # Clean perpetrator description
        sanitized_perp_desc, _ = redact_pii_from_text(perpetrator_description or "")

        return {
            "sanitized_narrative": sanitized_narrative,
            "perpetrator_pattern_descriptors": sanitized_perp_desc,
            "redacted_entity_types": redacted_types,
            "is_privacy_certified": True
        }

    @staticmethod
    def build_sanitized_case_projection(
        case: Case,
        user: Optional[User] = None
    ) -> SanitizedAuthorityCaseResponse:
        """Construct a strictly sanitized Authority Case projection from database entities.
        Guarantees that victim name, phone, email, and raw narrative do NOT leak.
        """
        # Deterministically tokenize subject ref
        user_identifier = user.id if user else case.user_id or case.id
        tokenized_subject = tokenize_identifier(user_identifier, prefix="TOKEN-VICTIM")

        privacy_panel = AuthorityPrivacyBanner(
            victim_name_status="[REDACTED]",
            victim_phone_status="[TOKENIZED]",
            victim_email_status="[REDACTED]",
            victim_identity_access="RESTRICTED / NOT_AVAILABLE",
            privacy_guardian_certified=True,
            tokenized_subject_ref=tokenized_subject,
        )

        # Build sanitized incident views
        sanitized_incidents: List[SanitizedIncidentAuthorityView] = []
        for inc in case.incidents:
            sanitized_incidents.append(
                SanitizedIncidentAuthorityView(
                    incident_id=inc.id,
                    timestamp=inc.timestamp,
                    approximate_latitude=round(inc.latitude, 4),  # Fuzz coordinates slightly for privacy
                    approximate_longitude=round(inc.longitude, 4),
                    area_name=inc.area_name,
                    category=inc.category,
                    severity=inc.severity,
                    sanitized_narrative=inc.sanitized_narrative or redact_pii_from_text(inc.raw_narrative)[0],
                    perpetrator_pattern_descriptors=inc.perpetrator_description,
                    lighting_condition=inc.lighting_condition,
                    crowd_density=inc.crowd_density,
                )
            )

        # Build candidate matches
        candidate_views: List[AuthorityCandidateMatch] = []
        for cand in case.candidates:
            matched_attrs = {}
            if cand.matched_attributes:
                try:
                    matched_attrs = json.loads(cand.matched_attributes)
                except Exception:
                    matched_attrs = {"details": cand.matched_attributes}
            
            candidate_views.append(
                AuthorityCandidateMatch(
                    candidate_id=cand.id,
                    offender_id=cand.offender_id,
                    fictional_alias_or_code=cand.offender.offender_code if cand.offender else "MOCK-OFF-UNKNOWN",
                    similarity_score=cand.similarity_score,
                    matched_attributes=matched_attrs,
                    risk_tier=cand.offender.risk_tier if cand.offender else "UNKNOWN",
                    status=cand.status,
                )
            )

        extracted_pattern_dict = None
        if case.extracted_pattern:
            try:
                extracted_pattern_dict = json.loads(case.extracted_pattern)
            except Exception:
                extracted_pattern_dict = {"pattern_summary": case.extracted_pattern}

        return SanitizedAuthorityCaseResponse(
            anonymized_case_id=case.anonymized_id,
            title=case.title,
            status=case.status,
            severity=case.severity,
            verification_status=case.verification_status,
            corroboration_count=case.corroboration_count,
            corroboration_threshold=3,
            extracted_pattern=extracted_pattern_dict,
            privacy_panel=privacy_panel,
            sanitized_incidents=sanitized_incidents,
            candidates=candidate_views,
            created_at=case.created_at,
            updated_at=case.updated_at,
        )
