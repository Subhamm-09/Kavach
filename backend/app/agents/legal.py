"""Legal Agent graph node.
Retrieves statutory documents from ChromaDB, formats grounded legal citations,
and drafts formal police complaints under Bharatiya Nyaya Sanhita (BNS).
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.rag.legal_store import LegalVectorStore
from backend.app.providers.gemini import ai_provider


class LegalAgentNode:
    """Legal Agent executing in the LangGraph graph."""

    @classmethod
    async def execute(cls, state: KavachGraphState, db: Session) -> KavachGraphState:
        """Process legal query or complaint drafting request."""
        query_text = state.get("raw_input", "")
        case_id = state.get("open_case_ids", [None])[0] if state.get("open_case_ids") else None

        # RAG query
        legal_response = LegalVectorStore.query_legal_guidance(query=query_text)

        # Generate complaint draft if intent warrants it
        citations_dicts = [c.model_dump() for c in legal_response.citations]
        complaint_draft = await ai_provider.draft_formal_complaint(
            incident_narrative=query_text,
            perpetrator_details=None,
            citations=citations_dicts,
            police_station="Infocity Police Station, Bhubaneswar",
            complainant_name="[Complainant / Protected Identity]"
        )

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "LegalAgent"
        state["legal_result"] = {
            "is_knowledge_base_loaded": legal_response.is_knowledge_base_loaded,
            "status_message": legal_response.status_message,
            "answer": legal_response.answer,
            "applicable_sections": legal_response.applicable_sections,
            "citations": citations_dicts,
            "complaint_draft": complaint_draft,
        }

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "LegalAgent",
            "signal_type": "LEGAL_RAG_SYNTHESIS",
            "action": "Queried ChromaDB Legal Corpus & Drafted Complaint",
            "tool_invoked": "ChromaLegalRAGStore",
            "input_summary": f"Query: '{query_text[:50]}...'",
            "output_summary": f"Retrieved {len(citations_dicts)} verified citations. Sections: {', '.join(legal_response.applicable_sections[:2])}",
            "severity": "INFO",
            "handoff_to": "EvidenceCompilerAgent"
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
