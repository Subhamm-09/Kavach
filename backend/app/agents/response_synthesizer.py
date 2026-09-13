"""Response Synthesizer Agent graph node (Node 1).
The DEDICATED and EXCLUSIVE node for generating user-facing responses.
Transforms all upstream agent findings (therapy, legal RAG, memories, emotion, routes, telemetry)
into a calm, humanized, trauma-informed conversational message while strictly concealing
all internal reasoning, risk labels, and workflow mechanics.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.providers.gemini import ai_provider
from backend.app.schemas.conversation import FinalResponseResult


class ResponseSynthesizerAgentNode:
    """Response Synthesizer Agent executing in the LangGraph graph."""

    @classmethod
    async def execute(cls, state: KavachGraphState, db: Optional[Session] = None) -> KavachGraphState:
        """Synthesize the unified user-facing response and populate state['final_response']."""
        raw_message = state.get("raw_input", "")

        therapy_res = state.get("therapy_result")
        legal_res = state.get("legal_result")
        mem_res = state.get("memory_result")
        emotion_res = state.get("emotion_result")
        route_res = state.get("route_result")
        proximity_res = state.get("proximity_result")

        memories = mem_res.get("retrieved_memories", []) if mem_res else []

        # Generate synthesized text through provider (strictly hides all internal details)
        synthesized_text = await ai_provider.synthesize_final_response(
            user_message=raw_message,
            therapy_res=therapy_res,
            legal_res=legal_res,
            memories=memories,
            emotion_res=emotion_res,
            route_res=route_res,
            proximity_res=proximity_res,
            conversation_history=state.get("conversation_history", [])
        )

        intensity = emotion_res.get("intensity", 3) if emotion_res else 3
        tone = "safety_grounding" if intensity >= 8 else ("reassuring" if intensity >= 6 else "supportive")
        escalation_advised = state.get("escalation_level") in ["WARN_CONTACTS", "EMERGENCY_DISPATCH"]

        final_response_data = FinalResponseResult(
            text=synthesized_text,
            tone=tone,
            requires_followup=intensity >= 7,
            escalation_advised=escalation_advised,
            timestamp=datetime.utcnow()
        ).model_dump()

        # Update Graph State
        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "ResponseSynthesizerAgent"
        state["final_response"] = final_response_data

        # Record internal activity event
        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "ResponseSynthesizerAgent",
            "signal_type": "FINAL_RESPONSE_SYNTHESIS",
            "action": "Generated sanitized humanized response for user",
            "tool_invoked": "HumanizedResponseSynthesizer",
            "input_summary": f"User query: '{raw_message[:50]}...'",
            "output_summary": f"Generated final message ({len(synthesized_text.split())} words, Tone: {tone})",
            "severity": "INFO",
            "handoff_to": "EvidenceCompilerAgent"
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
