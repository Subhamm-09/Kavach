"""Pydantic schemas for LangGraph Agent Activity, shared states, and routing decisions."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AgentActivityEvent(BaseModel):
    event_id: str
    timestamp: datetime
    agent_name: str  # Guardian, ProximityRisk, SafetyHeatmap, SafeRoute, ModeConsent, CulpritMatching, Verification, PrivacyGuardian, Legal, Therapy, EvidenceCompiler
    signal_type: str
    action: str
    tool_invoked: Optional[str] = None
    input_summary: str
    output_summary: str
    severity: str
    handoff_to: Optional[str] = None


class GuardianRoutingDecision(BaseModel):
    request_id: str
    signal_type: str
    detected_intent: str
    severity: str
    confidence: float
    selected_agents: List[str]
    escalation_required: bool
    escalation_action: Optional[str] = None
    reasoning_summary: str
    timestamp: datetime


class AgentPipelineRunRequest(BaseModel):
    signal_type: str  # GPS_PING, THERAPY_CUE, LEGAL_QUERY, INCIDENT_REPORT, OFFENDER_MATCH, CONSENT_TOGGLE
    payload: Dict[str, Any]
    user_id: Optional[str] = None
    session_id: Optional[str] = None


class AgentPipelineRunResponse(BaseModel):
    run_id: str
    status: str
    routing_decision: GuardianRoutingDecision
    timeline_events: List[AgentActivityEvent]
    final_output: Dict[str, Any]
    audit_logged: bool
