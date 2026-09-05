"""Legal Agent RAG & Statutory Guidance API Router."""

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.rag.legal_store import LegalVectorStore
from backend.app.rag.ingest import ingest_legal_directory
from backend.app.providers.gemini import ai_provider
from backend.app.schemas.legal import (
    LegalQueryRequest,
    LegalQueryResponse,
    ComplaintDraftRequest,
    ComplaintDraftResponse,
    LegalAidContact,
)

router = APIRouter(prefix="/api/legal", tags=["Legal Agent"])

ODISHA_LEGAL_AID_CONTACTS: List[LegalAidContact] = [
    LegalAidContact(
        name="District Legal Services Authority (DLSA), Khordha / Bhubaneswar",
        authority_type="Statutory Legal Aid Body",
        contact_phone="+91-674-2430118",
        address="ADR Centre, District Court Complex, Bhubaneswar, Odisha 751014",
        working_hours="10:00 AM - 5:00 PM (Mon-Sat)",
        is_emergency=False,
    ),
    LegalAidContact(
        name="Odisha State Commission for Women (OSCW) Helpline",
        authority_type="State Statutory Body",
        contact_phone="181 / +91-674-2396942",
        address="Toshali Bhawan, Block B-1, Satya Nagar, Bhubaneswar",
        working_hours="24x7 Emergency Helpline",
        is_emergency=True,
    ),
    LegalAidContact(
        name="Bhubaneswar Urban Police Cyber & Women Crime Desk",
        authority_type="Law Enforcement Special Cell",
        contact_phone="112 / +91-674-2540112",
        address="Police Commissionerate HQ, Vani Vihar, Bhubaneswar",
        working_hours="24x7 Emergency",
        is_emergency=True,
    ),
]


@router.post("/query", response_model=LegalQueryResponse)
def query_legal_guidance(payload: LegalQueryRequest, db: Session = Depends(get_db)):
    """Search ChromaDB legal corpus ('kavach_legal_documents') and return grounded statutory answers."""
    return LegalVectorStore.query_legal_guidance(
        query=payload.query,
        incident_context=payload.incident_context
    )


@router.post("/draft-complaint", response_model=ComplaintDraftResponse)
async def draft_police_complaint(payload: ComplaintDraftRequest, db: Session = Depends(get_db)):
    """Draft a formal statutory police complaint using retrieved legal provisions."""
    citations = LegalVectorStore.search_legal_documents(query=payload.incident_narrative, top_k=3)
    citations_dicts = [c.model_dump() for c in citations]

    complaint_body = await ai_provider.draft_formal_complaint(
        incident_narrative=payload.incident_narrative,
        perpetrator_details=payload.perpetrator_details,
        citations=citations_dicts,
        police_station=payload.police_station or "Infocity Police Station, Bhubaneswar",
        complainant_name=payload.complainant_name or "Complainant"
    )

    statutory_sections = ["BNS 354D (Stalking)", "BNS 354 (Outraging Modesty)", "BNS 509 (Insulting Modesty)", "IT Act § 66E"]
    if citations:
        statutory_sections = list(set([c.section for c in citations if c.section]))

    return ComplaintDraftResponse(
        draft_id=f"DRAFT-{uuid.uuid4().hex[:8].upper()}",
        case_id=payload.case_id,
        police_station_addressed=payload.police_station or "Infocity Police Station, Bhubaneswar",
        subject_line="Formal Police Complaint regarding Criminal Stalking and Intimidation",
        applicable_statutory_sections=statutory_sections,
        draft_body_formatted=complaint_body,
        citations_used=citations,
        evidence_checklist=[
            "Incident Timestamp and Exact GPS Coordinate Log",
            "CCTV Footprint Request for Identified Corridor",
            "Perpetrator Physical and Vehicle Descriptors",
            "Digital Communication & Chat Transcripts"
        ],
        created_at=datetime.utcnow(),
    )


@router.get("/aid-contacts", response_model=List[LegalAidContact])
def get_legal_aid_contacts():
    """Retrieve verified institutional legal aid and women helpline directories for Bhubaneswar."""
    return ODISHA_LEGAL_AID_CONTACTS


@router.post("/ingest")
def trigger_legal_ingest(db: Session = Depends(get_db)):
    """Trigger ingestion of statutory PDF/TXT files from /data/legal_documents/ into ChromaDB."""
    return ingest_legal_directory(db=db)
