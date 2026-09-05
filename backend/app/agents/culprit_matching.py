"""Culprit-Matching Module.
Executes vector similarity search against ChromaDB offender profiles ('kavach_offender_profiles').
Normalizes text and strips sensitive victim details before embedding.
Produces investigative candidates with similarity scores and passes them to Verification Agent.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.privacy.redaction import redact_pii_from_text
from backend.app.rag.offender_store import OffenderVectorStore


class CulpritMatchingModule:
    """Culprit Matching vector pipeline."""

    @classmethod
    def match_candidates(
        cls,
        db: Session,
        perpetrator_description: str,
        case_id: Optional[str] = None,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """1. Normalize text & strip sensitive victim details.
        2. Query ChromaDB collection 'kavach_offender_profiles'.
        3. Return top-N candidate matches with scores.
        """
        # Step 1: Strip PII from input
        sanitized_query, _ = redact_pii_from_text(perpetrator_description)

        # Step 2: Query ChromaDB
        candidates = OffenderVectorStore.search_candidates(
            perpetrator_description=sanitized_query,
            top_k=top_k
        )

        return candidates

    @classmethod
    def execute(cls, state: KavachGraphState, db: Session) -> KavachGraphState:
        """LangGraph execution node for Culprit Matching."""
        desc = state.get("raw_input", "")
        case_ids = state.get("open_case_ids", [])
        case_id = case_ids[0] if case_ids else None

        candidates = cls.match_candidates(db=db, perpetrator_description=desc, case_id=case_id)

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "CulpritMatchingModule"
        state["similarity_results"] = candidates
        state["candidate_offender_ids"] = [c["offender_id"] for c in candidates]

        top_cand = candidates[0] if candidates else None
        cand_summary = f"Matched {len(candidates)} candidate(s). Top: {top_cand['offender_code']} ({int(top_cand['similarity_score']*100)}% similarity)" if top_cand else "No candidates found."

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "CulpritMatchingModule",
            "signal_type": "OFFENDER_VECTOR_MATCH",
            "action": "Queried ChromaDB offender profile collection",
            "tool_invoked": "ChromaOffenderVectorStore",
            "input_summary": f"Perpetrator query: '{desc[:50]}...'",
            "output_summary": cand_summary,
            "severity": "MEDIUM" if candidates else "LOW",
            "handoff_to": "VerificationAgent"
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
