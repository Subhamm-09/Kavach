"""Case entity representing an aggregated safety case dossier."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from backend.app.database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Human-readable tracking number, e.g. CASE-2026-8F12A
    tracking_number = Column(String(100), unique=True, index=True, nullable=False)
    # Anonymized public ID exposed to Authority (e.g. KV-ANON-7842)
    anonymized_id = Column(String(100), unique=True, index=True, nullable=False)
    
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="OPEN")  # OPEN, UNDER_INVESTIGATION, ESCALATED, RESOLVED
    severity = Column(String(50), default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    
    # Verification State
    verification_status = Column(String(50), default="UNVERIFIED")  # UNVERIFIED, NEEDS_HUMAN_REVIEW, VERIFIED, REJECTED
    corroboration_count = Column(Integer, default=1)
    
    # Privacy flag
    privacy_guardian_applied = Column(Boolean, default=True)
    
    # Structured summary extracted by Privacy-Guardian
    extracted_pattern = Column(Text, nullable=True)  # JSON string of modus operandi tags, time patterns, etc.
    
    # Evidence / Legal draft
    formal_complaint_draft = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    incidents = relationship("Incident", back_populates="case", cascade="all, delete-orphan")
    candidates = relationship("IncidentOffenderCandidate", back_populates="case", cascade="all, delete-orphan")
    verification_results = relationship("VerificationResult", back_populates="case", cascade="all, delete-orphan")
