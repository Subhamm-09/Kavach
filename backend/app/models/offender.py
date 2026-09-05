"""Offender and Candidate models representing the mock offender registry and match candidates."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from backend.app.database import Base


class Offender(Base):
    __tablename__ = "offenders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    offender_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "MOCK-OFF-01"
    fictional_full_name = Column(String(255), nullable=False)
    aliases = Column(String(255), nullable=True)  # e.g. "Raju, Jaggu"
    approximate_age = Column(Integer, nullable=True)
    approximate_height = Column(String(50), nullable=True)  # e.g. "5'9\""
    build = Column(String(100), nullable=True)  # e.g. "Athletic", "Heavy", "Slim"
    distinguishing_marks = Column(Text, nullable=True)  # e.g. "Scar across left forearm, eagle tattoo"
    
    modus_operandi = Column(Text, nullable=False)  # Detailed narrative of crime patterns
    conviction_history = Column(Text, nullable=True)
    sections_charged = Column(String(255), nullable=True)  # e.g. "BNS 354, 509 / IPC 354D"
    
    last_known_latitude = Column(Float, nullable=False)
    last_known_longitude = Column(Float, nullable=False)
    registered_zone = Column(String(255), nullable=False)  # e.g. "Patia Infocity", "Saheed Nagar"
    
    risk_tier = Column(String(50), default="HIGH")  # LOW, MODERATE, HIGH, CRITICAL
    source_type = Column(String(100), default="MOCK_REGISTRY")
    source_reference = Column(String(255), default="Bhubaneswar Police Commissionerate Mock Archive")
    is_verified_in_registry = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    candidates = relationship("IncidentOffenderCandidate", back_populates="offender")


class IncidentOffenderCandidate(Base):
    __tablename__ = "incident_offender_candidates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False, index=True)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=True, index=True)
    offender_id = Column(String(36), ForeignKey("offenders.id"), nullable=False, index=True)
    
    similarity_score = Column(Float, nullable=False)  # Cosine similarity (0.0 to 1.0)
    matched_attributes = Column(Text, nullable=True)  # JSON string of matched MO traits
    match_rationale = Column(Text, nullable=True)
    
    status = Column(String(50), default="CANDIDATE")  # CANDIDATE, FLAGGED, VERIFIED, DISMISSED
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="candidates")
    offender = relationship("Offender", back_populates="candidates")
