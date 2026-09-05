"""Proximity Risk Agent graph node and wrapper."""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.geospatial.proximity import ProximityRiskAgent as ProximityEngine


class ProximityRiskAgentNode:
    """Proximity Risk Agent executing in the LangGraph graph."""

    @classmethod
    def execute(cls, state: KavachGraphState, db: Session) -> KavachGraphState:
        """Evaluate proximity for state's location and update state."""
        loc = state.get("location")
        if not loc or "lat" not in loc or "lng" not in loc:
            return state

        session_id = state.get("session_id", str(uuid.uuid4()))
        lat = float(loc["lat"])
        lng = float(loc["lng"])
        user_id = state.get("user_id")

        eval_result = ProximityEngine.evaluate_gps_ping(
            db=db,
            session_id=session_id,
            lat=lat,
            lng=lng,
            user_id=user_id,
        )

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "ProximityRiskAgent"
        state["proximity_result"] = eval_result

        # Check for handoff
        if eval_result.get("escalation_triggered"):
            state["severity"] = "HIGH" if eval_result.get("calculated_risk_score", 0) >= 70 else "MEDIUM"
            state["escalation_level"] = "WARN_CONTACTS"
            handoff_agent = "GuardianOrchestrator"
        else:
            handoff_agent = None

        # Add activity timeline entry
        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "ProximityRiskAgent",
            "signal_type": "GPS_TELEMETRY",
            "action": f"Proximity evaluated at ({lat:.4f}, {lng:.4f})",
            "tool_invoked": "GeospatialProximityEngine",
            "input_summary": f"GPS coordinate: [{lat}, {lng}], Nearest: {eval_result.get('nearest_zone_name')}",
            "output_summary": f"Risk Score: {eval_result.get('calculated_risk_score')} ({eval_result.get('risk_level')}). Escalation: {eval_result.get('escalation_triggered')}",
            "severity": state["severity"],
            "handoff_to": handoff_agent
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
