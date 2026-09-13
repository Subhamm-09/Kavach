"""Intent Router Agent graph node (Node 4).
Prevents unnecessary downstream execution of legal RAG and formal complaint drafting
on routine conversational or emotional support check-ins.
Classifies intent into:
- emotional_support -> response_synthesizer
- general_chat -> response_synthesizer
- legal_information -> legal
- incident_reporting -> legal
- route_request -> safe_route
- safety_request -> proximity_risk
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.providers.gemini import ai_provider
from backend.app.schemas.conversation import ChatIntentResult


class IntentRouterAgentNode:
    """Intent Router Agent executing in the LangGraph graph."""

    @classmethod
    async def execute(cls, state: KavachGraphState, db: Optional[Session] = None) -> KavachGraphState:
        """Classify conversational intent for smart graph branching."""
        user_message = state.get("raw_input", "")

        intent_data = await ai_provider.classify_chat_intent(
            message_text=user_message,
            conversation_history=state.get("conversation_history", [])
        )

        classified_intent = intent_data.get("intent", "emotional_support")
        confidence = float(intent_data.get("confidence", 0.85))
        reasoning = intent_data.get("reasoning", "Classified based on intent semantics")

        chat_intent_res = ChatIntentResult(
            intent=classified_intent,
            confidence=confidence,
            reasoning=reasoning
        ).model_dump()

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "IntentRouterAgent"
        state["chat_intent"] = classified_intent

        target_node = cls.resolve_target_node(classified_intent)

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "IntentRouterAgent",
            "signal_type": "CHAT_INTENT_ROUTING",
            "action": f"Routed chat turn to: {target_node} (Intent: {classified_intent})",
            "tool_invoked": "IntentBranchingRouter",
            "input_summary": f"Text: '{user_message[:50]}...'",
            "output_summary": f"Branching to '{target_node}'. Confidence: {confidence:.2f}",
            "severity": "INFO",
            "handoff_to": target_node
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state

    @classmethod
    def resolve_target_node(cls, intent: Optional[str]) -> str:
        """Map classified conversational intent to the corresponding LangGraph node."""
        intent_normalized = (intent or "emotional_support").lower()

        if intent_normalized in ["legal_information", "incident_reporting"]:
            return "legal"
        elif intent_normalized == "route_request":
            return "safe_route"
        elif intent_normalized == "safety_request":
            return "proximity_risk"
        else:
            # emotional_support, general_chat, or default
            return "response_synthesizer"


def chat_intent_router(state: KavachGraphState) -> str:
    """Routing function called by LangGraph conditional edges."""
    intent = state.get("chat_intent", "emotional_support")
    return IntentRouterAgentNode.resolve_target_node(intent)
