"""EvidenceEvent entity tracking chronological case milestones."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from backend.app.database import Base


class EvidenceEvent(Base):
    __tablename__ = "evidence_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False, index=True)
    event_type = Column(String(100), nullable=False)  # GPS_ALERT, THERAPY_DISTRESS, PERPETRATOR_MATCH, VERIFICATION_RESULT, LEGAL_DRAFT
    agent_name = Column(String(100), nullable=False)  # Guardian, Proximity, Therapy, Legal, Verification, etc.
    severity = Column(String(50), default="INFO")
    summary = Column(Text, nullable=False)
    payload_json = Column(Text, nullable=True)  # Structured JSON metadata
    timestamp = Column(DateTime, default=datetime.utcnow)
