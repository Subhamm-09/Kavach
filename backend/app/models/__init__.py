"""Kavach SQLAlchemy Models Registry."""

from backend.app.database import Base
from backend.app.models.user import User
from backend.app.models.incident import Incident
from backend.app.models.case import Case
from backend.app.models.offender import Offender, IncidentOffenderCandidate
from backend.app.models.verification import VerificationResult
from backend.app.models.geospatial import RiskZone, HeatmapCell, GPSPing
from backend.app.models.consent import ConsentEvent
from backend.app.models.chat import ChatSession, ChatMessage
from backend.app.models.legal import LegalDocumentMetadata
from backend.app.models.evidence import EvidenceEvent
from backend.app.models.audit import AuditEvent, AgentRun, DatabaseSeedMeta

__all__ = [
    "Base",
    "User",
    "Incident",
    "Case",
    "Offender",
    "IncidentOffenderCandidate",
    "VerificationResult",
    "RiskZone",
    "HeatmapCell",
    "GPSPing",
    "ConsentEvent",
    "ChatSession",
    "ChatMessage",
    "LegalDocumentMetadata",
    "EvidenceEvent",
    "AuditEvent",
    "AgentRun",
    "DatabaseSeedMeta",
]
