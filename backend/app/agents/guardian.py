"""Guardian Orchestrator Agent.
The central LangGraph orchestrator: receives signals, classifies intent/severity,
evaluates system context, decides downstream agent handoffs, maintains graph state,
and triggers autonomous escalations.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.providers.gemini import ai_provider
from backend.app.models.audit import AuditEvent


class GuardianOrchestratorAgent:
    """Guardian Orchestrator Agent managing the safety graph workflow."""

    @classmethod
    async def process_signal(
        cls,
        state: KavachGraphState,
        db: Optional[Session] = None
    ) -> KavachGraphState:
        """Analyze state, classify intent/severity, determine routing, and log audit event."""
        signal_type = state.get("signal_type", "GENERAL_SIGNAL")
        raw_input = state.get("raw_input", "")
        location = state.get("location")
        session_id = state.get("session_id", str(uuid.uuid4()))
        request_id = state.get("request_id", str(uuid.uuid4()))

        # Context for classification
        context = {
            "session_id": session_id,
            "location": location,
            "previous_agent": state.get("current_agent"),
            "proximity_result": state.get("proximity_result"),
        }

        # AI / Deterministic classification
        classification = await ai_provider.classify_guardian_signal(
            signal_type=signal_type,
            raw_input=raw_input,
            context=context
        )

        detected_intent = classification.get("intent", "GENERAL_SAFETY")
        severity = classification.get("severity", "LOW")
        confidence = classification.get("confidence", 0.9)
        selected_agents = classification.get("selected_agents", [])
        escalation_required = classification.get("escalation_required", False)
        escalation_action = classification.get("escalation_action", "NONE")
        reasoning = classification.get("reasoning_summary", "Guardian evaluated incoming telemetry.")

        # Update state
        state["intent"] = detected_intent
        state["severity"] = severity
        state["confidence"] = confidence
        state["previous_agent"] = state.get("current_agent", "Ingress")
        state["current_agent"] = "GuardianOrchestrator"
        state["next_agents"] = selected_agents
        state["escalation_level"] = "WARN_CONTACTS" if severity in ["HIGH", "CRITICAL"] else "NONE"

        # Record activity event
        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "GuardianOrchestrator",
            "signal_type": signal_type,
            "action": f"Classified intent: {detected_intent} (Severity: {severity})",
            "tool_invoked": "IntentSeverityClassifier",
            "input_summary": f"Signal '{signal_type}' received with payload: {raw_input[:60]}...",
            "output_summary": f"Routed to downstream agents: {', '.join(selected_agents)}. Escalation: {escalation_required}",
            "severity": severity,
            "handoff_to": selected_agents[0] if selected_agents else None
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        # Audit persistence if db session available
        if db:
            audit = AuditEvent(
                run_id=session_id,
                request_id=request_id,
                agent_name="GuardianOrchestrator",
                trigger=signal_type,
                action_taken=f"Routing -> {','.join(selected_agents)}",
                target=selected_agents[0] if selected_agents else None,
                result_summary=reasoning,
                severity=severity,
                user_ref=state.get("user_id"),
            )
            db.add(audit)
            db.commit()

        return state
