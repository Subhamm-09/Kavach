"""Safe-Route Agent graph node."""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.geospatial.routing import SafeRouteAgent as RoutingEngine


class SafeRouteAgentNode:
    """Safe-Route Agent executing in the LangGraph graph."""

    @classmethod
    def execute(
        cls,
        state: KavachGraphState,
        db: Session,
        origin_lat: Optional[float] = None,
        origin_lng: Optional[float] = None,
        dest_lat: Optional[float] = None,
        dest_lng: Optional[float] = None,
    ) -> KavachGraphState:
        """Calculate safety-optimized routing options."""
        loc = state.get("location", {})
        o_lat = origin_lat or loc.get("lat", 20.3550)
        o_lng = origin_lng or loc.get("lng", 85.8180)
        d_lat = dest_lat or 20.2660  # Default to Master Canteen
        d_lng = dest_lng or 85.8410

        route_res = RoutingEngine.compute_safe_routes(
            db=db,
            origin_lat=o_lat,
            origin_lng=o_lng,
            dest_lat=d_lat,
            dest_lng=d_lng,
        )

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "SafeRouteAgent"
        state["route_result"] = {
            "recommended_route": route_res.recommended_route.model_dump(),
            "alternative_routes": [r.model_dump() for r in route_res.alternative_routes],
            "reasoning_summary": route_res.reasoning_summary,
        }

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "SafeRouteAgent",
            "signal_type": "ROUTE_REQUEST",
            "action": "Calculated safety-cost optimized routing graph",
            "tool_invoked": "DijkstraSafetyGraphRouter",
            "input_summary": f"Origin: [{o_lat:.3f}, {o_lng:.3f}] -> Destination: [{d_lat:.3f}, {d_lng:.3f}]",
            "output_summary": f"Recommended: {route_res.recommended_route.name} ({route_res.recommended_route.total_distance_km}km). {route_res.reasoning_summary[:70]}...",
            "severity": "INFO",
            "handoff_to": None
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
