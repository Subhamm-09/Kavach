"""Agents Pipeline & Observability Timeline API Router."""

from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.audit import AuditEvent, AgentRun
from backend.app.graph.orchestrator import LangGraphOrchestrationService
from backend.app.schemas.agent import (
    AgentPipelineRunRequest,
    AgentPipelineRunResponse,
    GuardianRoutingDecision,
    AgentActivityEvent,
)

router = APIRouter(prefix="/api/agents", tags=["Agent Observability & LangGraph"])


@router.post("/pipeline/run", response_model=AgentPipelineRunResponse)
async def trigger_agent_pipeline(payload: AgentPipelineRunRequest, db: Session = Depends(get_db)):
    """Trigger an end-to-end execution of the LangGraph state graph.
    Returns the step-by-step reasoning timeline, tool calls, and final decision.
    """
    raw_input = payload.payload.get("raw_input") or payload.payload.get("text") or payload.signal_type
    location = payload.payload.get("location")

    state = await LangGraphOrchestrationService.run_pipeline(
        db=db,
        signal_type=payload.signal_type,
        raw_input=str(raw_input),
        location=location,
        user_id=payload.user_id,
        session_id=payload.session_id,
    )

    routing_decision = GuardianRoutingDecision(
        request_id=state.get("request_id", ""),
        signal_type=payload.signal_type,
        detected_intent=state.get("intent", "GENERAL"),
        severity=state.get("severity", "LOW"),
        confidence=state.get("confidence", 0.9),
        selected_agents=state.get("next_agents", []),
        escalation_required=state.get("escalation_level") in ["WARN_CONTACTS", "EMERGENCY_DISPATCH"],
        escalation_action=state.get("escalation_level"),
        reasoning_summary=f"Guardian routed signal '{payload.signal_type}' through {len(state.get('activity_timeline', []))} graph nodes.",
        timestamp=datetime.utcnow(),
    )

    timeline_events = [
        AgentActivityEvent(
            event_id=ev.get("event_id", ""),
            timestamp=datetime.fromisoformat(ev.get("timestamp")) if isinstance(ev.get("timestamp"), str) else datetime.utcnow(),
            agent_name=ev.get("agent_name", "Guardian"),
            signal_type=ev.get("signal_type", payload.signal_type),
            action=ev.get("action", ""),
            tool_invoked=ev.get("tool_invoked"),
            input_summary=ev.get("input_summary", ""),
            output_summary=ev.get("output_summary", ""),
            severity=ev.get("severity", "INFO"),
            handoff_to=ev.get("handoff_to"),
        )
        for ev in state.get("activity_timeline", [])
    ]

    return AgentPipelineRunResponse(
        run_id=state.get("session_id", ""),
        status="COMPLETED",
        routing_decision=routing_decision,
        timeline_events=timeline_events,
        final_output={
            "proximity": state.get("proximity_result"),
            "heatmap": state.get("heatmap_result"),
            "route": state.get("route_result"),
            "therapy": state.get("therapy_result"),
            "legal": state.get("legal_result"),
            "matching": state.get("similarity_results"),
            "verification": state.get("verification_result"),
            "privacy": state.get("privacy_result"),
            "evidence": state.get("evidence_result"),
        },
        audit_logged=True,
    )


@router.get("/timeline")
def get_recent_agent_timeline(limit: int = 25, db: Session = Depends(get_db)):
    """Retrieve the recent agent activity & tool execution timeline from audit events."""
    events = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(limit).all()
    return [{
        "event_id": e.id,
        "timestamp": e.timestamp.isoformat(),
        "agent_name": e.agent_name,
        "signal_type": e.trigger,
        "action": e.action_taken,
        "tool_invoked": e.target,
        "output_summary": e.result_summary,
        "severity": e.severity,
    } for e in events]
