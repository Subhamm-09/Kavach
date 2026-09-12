"""Database model for salient user memories across conversations."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text
from backend.app.database import Base


class UserMemory(Base):
    __tablename__ = "user_memories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    session_id = Column(String(100), nullable=True, index=True)
    
    # The high-salience factual statement
    memory_text = Column(Text, nullable=False)
    
    # Classification category: HARASSMENT, FEAR, OFFENDER, INCIDENT, PREFERENCE, GENERAL
    category = Column(String(50), default="GENERAL", index=True)
    
    # Salience / Importance score (0.0 to 1.0)
    salience_score = Column("importance_score", Float, default=0.8)
    
    created_at = Column(DateTime, default=datetime.utcnow)
