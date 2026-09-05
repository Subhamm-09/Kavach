"""Verification Result model representing safety and corroboration decisions."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from backend.app.database import Base


class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=False, index=True)
    candidate_id = Column(String(36), ForeignKey("incident_offender_candidates.id"), nullable=True)
    
    # Path A: Official Registry Match; Path B: Corroborating Independent Reports
    verification_path = Column(String(50), nullable=False)  # PATH_A_REGISTRY, PATH_B_CORROBORATION
    outcome = Column(String(50), nullable=False)  # VERIFIED, REJECTED, NEEDS_HUMAN_REVIEW
    
    corroboration_reports_count = Column(Integer, default=1)
    corroboration_threshold_required = Column(Integer, default=3)
    confidence_score = Column(Float, default=0.0)
    audit_notes = Column(Text, nullable=True)
    
    verified_at = Column(DateTime, default=datetime.utcnow)
    case = relationship("Case", back_populates="verification_results")
