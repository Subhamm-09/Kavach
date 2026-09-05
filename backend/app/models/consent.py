"""ConsentEvent model tracking tracking mode transitions and explicit user consent."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from backend.app.database import Base


class ConsentEvent(Base):
    __tablename__ = "consent_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    session_id = Column(String(100), nullable=False)
    previous_mode = Column(String(50), default="MANUAL")  # MANUAL, LIVE
    new_mode = Column(String(50), nullable=False)  # MANUAL, LIVE
    trigger_reason = Column(Text, nullable=False)  # e.g., "Frequent manual check-ins in elevated risk area"
    user_confirmed = Column(Boolean, default=True)
    consent_timestamp = Column(DateTime, default=datetime.utcnow)
