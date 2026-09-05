"""Chat models for trauma-informed Therapy Agent interactions."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    session_token = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(String(50), default="ACTIVE")  # ACTIVE, ESCALATED_TO_GUARDIAN, COMPLETED
    created_at = Column(DateTime, default=datetime.utcnow)
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False, index=True)
    sender = Column(String(50), nullable=False)  # USER, THERAPY_AGENT, GUARDIAN_ORCHESTRATOR, SYSTEM
    text = Column(Text, nullable=False)
    
    # Distress Analysis
    distress_detected = Column(Boolean, default=False)
    distress_score = Column(Float, default=0.0)  # 0.0 to 1.0
    intent_classified = Column(String(100), nullable=True)  # e.g., "IMMINENT_DANGER", "EMOTIONAL_DISTRESS", "QUERY"
    handoff_triggered = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    session = relationship("ChatSession", back_populates="messages")
