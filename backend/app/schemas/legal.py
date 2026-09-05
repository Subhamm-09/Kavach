"""Pydantic schemas for Legal RAG Agent, citations, and formal complaint generation."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class LegalQueryRequest(BaseModel):
    query: str
    incident_context: Optional[str] = None
    case_id: Optional[str] = None


class LegalCitation(BaseModel):
    document_name: str
    section: Optional[str] = None
    page: Optional[int] = None
    chunk_id: str
    source: str
    snippet: str
    relevance_score: float


class LegalQueryResponse(BaseModel):
    query: str
    is_knowledge_base_loaded: bool
    status_message: str
    answer: str
    citations: List[LegalCitation] = []
    applicable_sections: List[str] = []
    recommended_next_steps: List[str] = []


class ComplaintDraftRequest(BaseModel):
    case_id: Optional[str] = None
    complainant_name: Optional[str] = "Complainant"
    incident_date: Optional[str] = None
    incident_location: Optional[str] = "Bhubaneswar, Odisha"
    incident_narrative: str
    perpetrator_details: Optional[str] = None
    police_station: Optional[str] = "Infocity Police Station, Bhubaneswar"


class ComplaintDraftResponse(BaseModel):
    draft_id: str
    case_id: Optional[str] = None
    police_station_addressed: str
    subject_line: str
    applicable_statutory_sections: List[str]
    draft_body_formatted: str
    citations_used: List[LegalCitation] = []
    evidence_checklist: List[str] = []
    created_at: datetime


class LegalAidContact(BaseModel):
    name: str
    authority_type: str
    contact_phone: str
    address: str
    working_hours: str
    is_emergency: bool
