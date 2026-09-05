"""Strongly typed LangGraph State Schema for Kavach.
Shared across Guardian Orchestrator and all 10 downstream agents.
"""

from typing import TypedDict, List, Dict, Any, Optional
from pydantic import BaseModel, Field


class KavachGraphState(TypedDict, total=False):
    """LangGraph Shared State Schema."""
    request_id: str
    user_id: Optional[str]
    session_id: str
    signal_type: str  # GPS_PING, THERAPY_CUE, LEGAL_QUERY, INCIDENT_REPORT, OFFENDER_MATCH, CONSENT_TOGGLE
    
    # Input payloads
    raw_input: str
    normalized_input: str
    location: Optional[Dict[str, float]]  # {"lat": 20.35, "lng": 85.81}
    timestamp: str
    
    # Guardian Classification
    intent: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float
    current_agent: str
    previous_agent: Optional[str]
    next_agents: List[str]
    
    # Agent Results
    proximity_result: Optional[Dict[str, Any]]
    heatmap_result: Optional[Dict[str, Any]]
    route_result: Optional[Dict[str, Any]]
    therapy_result: Optional[Dict[str, Any]]
    legal_result: Optional[Dict[str, Any]]
    similarity_results: Optional[List[Dict[str, Any]]]
    candidate_offender_ids: Optional[List[str]]
    verification_result: Optional[Dict[str, Any]]
    privacy_result: Optional[Dict[str, Any]]
    evidence_result: Optional[Dict[str, Any]]
    consent_state: Optional[Dict[str, Any]]
    
    # System & Case Tracking
    open_case_ids: Optional[List[str]]
    escalation_level: str  # NONE, NOTIFY_USER, WARN_CONTACTS, EMERGENCY_DISPATCH
    authority_visibility: bool
    
    # Observability & Audit
    audit_events: List[Dict[str, Any]]
    activity_timeline: List[Dict[str, Any]]
    final_response: Dict[str, Any]
