"""Memory Retrieval Agent graph node (Node 2).
Retrieves relevant ongoing harassment patterns, recurring fears, offender descriptors,
and prior incidents from persistent memory store.
Enforces strict salience boundaries: never retrieves or persists trivial small talk or greetings.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.memory.store import UserMemoryStore
from backend.app.schemas.conversation import MemoryRetrievalResult


class MemoryRetrievalAgentNode:
    """Memory Retrieval Agent executing in the LangGraph graph."""

    @classmethod
    def execute(cls, state: KavachGraphState, db: Optional[Session] = None) -> KavachGraphState:
        """Query memory store for high-salience context matching current turn."""
        user_message = state.get("raw_input", "")
        user_id = state.get("user_id")
        session_id = state.get("session_id")

        retrieved: list[str] = []

        if db:
            # 1. Query relevant memories from store
            retrieved = UserMemoryStore.retrieve_relevant_memories(
                db=db,
                query_text=user_message,
                user_id=user_id,
                session_id=session_id,
                top_k=3
            )

            # 2. If the current turn contains a high-salience pattern, persist it
            UserMemoryStore.store_memory_if_salient(
                db=db,
                user_message=user_message,
                user_id=user_id,
                session_id=session_id
            )

        mem_res = MemoryRetrievalResult(
            retrieved_memories=retrieved,
            memory_count=len(retrieved),
            query_matched=user_message[:60] if retrieved else None
        ).model_dump()

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "MemoryRetrievalAgent"
        state["memory_result"] = mem_res

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "MemoryRetrievalAgent",
            "signal_type": "EPISODIC_MEMORY_QUERY",
            "action": f"Retrieved {len(retrieved)} salient memory records",
            "tool_invoked": "UserMemoryStore",
            "input_summary": f"Context query: '{user_message[:50]}...'",
            "output_summary": f"Matched memories: {len(retrieved)}. Top: {retrieved[0][:60] if retrieved else 'None'}",
            "severity": "INFO",
            "handoff_to": "IntentRouterAgent"
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
