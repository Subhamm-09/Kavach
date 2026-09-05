"""Safety Heatmap Agent graph node."""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.geospatial.heatmap import SafetyHeatmapAgent as HeatmapEngine


class SafetyHeatmapAgentNode:
    """Safety Heatmap Agent executing in the LangGraph graph."""

    @classmethod
    def execute(cls, state: KavachGraphState, db: Session) -> KavachGraphState:
        """Fetch heatmap data and attach to state."""
        heatmap_data = HeatmapEngine.get_bhubaneswar_heatmap(db)

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "SafetyHeatmapAgent"
        state["heatmap_result"] = {
            "total_cells": heatmap_data.total_cells,
            "high_risk_zone_count": heatmap_data.high_risk_zone_count,
            "calculated_at": heatmap_data.calculated_at.isoformat(),
        }

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "SafetyHeatmapAgent",
            "signal_type": "HEATMAP_COMPUTATION",
            "action": "Calculated spatial risk surface for Bhubaneswar",
            "tool_invoked": "SafetyHeatmapEngine",
            "input_summary": "Evaluated environmental lighting, patrol frequency, incident recency, and offender proximity",
            "output_summary": f"Generated {heatmap_data.total_cells} risk cells ({heatmap_data.high_risk_zone_count} high/critical risk)",
            "severity": "INFO",
            "handoff_to": None
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
