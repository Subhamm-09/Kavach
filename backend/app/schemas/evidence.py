"""Pydantic schemas for Evidence Dossier compilation."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class EvidenceTimelineEvent(BaseModel):
    timestamp: datetime
    agent_name: str
    event_type: str
    severity: str
    summary: str
    metadata: Optional[Dict[str, Any]] = None


class EvidenceDossier(BaseModel):
    dossier_id: str
    case_id: str
    tracking_number: str
    anonymized_case_id: str
    case_title: str
    generated_at: datetime
    severity_level: str
    verification_status: str
    
    # Chronological Incident & Agent milestones
    timeline: List[EvidenceTimelineEvent] = []
    
    # GPS & Proximity history
    gps_risk_history: List[Dict[str, Any]] = []
    
    # Chat & Distress transcripts
    distress_events: List[Dict[str, Any]] = []
    
    # Culprit Matching & Verification summary
    offender_correlation: Optional[Dict[str, Any]] = None
    
    # Legal citations & Complaint draft
    legal_summary: Optional[Dict[str, Any]] = None
    
    # Exportable HTML or formatted text representation
    exportable_html: str
