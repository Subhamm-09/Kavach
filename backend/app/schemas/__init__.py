"""Kavach Schemas Registry."""

from backend.app.schemas.auth import Token, TokenData, UserRegister, UserLogin, UserResponse
from backend.app.schemas.geospatial import (
    GPSPingInput,
    GPSPingResponse,
    RiskZoneResponse,
    HeatmapCellResponse,
    HeatmapResponse,
    SafeRouteRequest,
    SafeRouteResponse,
    RoutePathOption,
)
from backend.app.schemas.incident import IncidentCreate, IncidentResponse, CaseCreate, CaseUserResponse
from backend.app.schemas.authority import (
    AuthorityPrivacyBanner,
    SanitizedIncidentAuthorityView,
    AuthorityCandidateMatch,
    SanitizedAuthorityCaseResponse,
    CorrelatedPatternItem,
    OffenderPatternCard,
    AuthorityDashboardSummary,
)
from backend.app.schemas.chat import (
    ChatMessageCreate,
    ChatMessageResponse,
    DistressSignal,
    ChatSessionDetailResponse,
)
from backend.app.schemas.legal import (
    LegalQueryRequest,
    LegalCitation,
    LegalQueryResponse,
    ComplaintDraftRequest,
    ComplaintDraftResponse,
    LegalAidContact,
)
from backend.app.schemas.evidence import EvidenceTimelineEvent, EvidenceDossier
from backend.app.schemas.matching import (
    OffenderMatchQuery,
    CandidateMatchResult,
    OffenderMatchResponse,
    VerificationEvaluationRequest,
    VerificationEvaluationResponse,
)
from backend.app.schemas.agent import (
    AgentActivityEvent,
    GuardianRoutingDecision,
    AgentPipelineRunRequest,
    AgentPipelineRunResponse,
)

__all__ = [
    "Token",
    "TokenData",
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "GPSPingInput",
    "GPSPingResponse",
    "RiskZoneResponse",
    "HeatmapCellResponse",
    "HeatmapResponse",
    "SafeRouteRequest",
    "SafeRouteResponse",
    "RoutePathOption",
    "IncidentCreate",
    "IncidentResponse",
    "CaseCreate",
    "CaseUserResponse",
    "AuthorityPrivacyBanner",
    "SanitizedIncidentAuthorityView",
    "AuthorityCandidateMatch",
    "SanitizedAuthorityCaseResponse",
    "CorrelatedPatternItem",
    "OffenderPatternCard",
    "AuthorityDashboardSummary",
    "ChatMessageCreate",
    "ChatMessageResponse",
    "DistressSignal",
    "ChatSessionDetailResponse",
    "LegalQueryRequest",
    "LegalCitation",
    "LegalQueryResponse",
    "ComplaintDraftRequest",
    "ComplaintDraftResponse",
    "LegalAidContact",
    "EvidenceTimelineEvent",
    "EvidenceDossier",
    "OffenderMatchQuery",
    "CandidateMatchResult",
    "OffenderMatchResponse",
    "VerificationEvaluationRequest",
    "VerificationEvaluationResponse",
    "AgentActivityEvent",
    "GuardianRoutingDecision",
    "AgentPipelineRunRequest",
    "AgentPipelineRunResponse",
]
