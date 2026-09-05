"""LangGraph Central StateGraph Orchestrator.
Coordinates the Guardian Orchestrator and all 10 downstream agents over shared state.
"""

import uuid
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from langgraph.graph import StateGraph, END

from backend.app.graph.state import KavachGraphState
from backend.app.agents.guardian import GuardianOrchestratorAgent
from backend.app.agents.proximity_risk import ProximityRiskAgentNode
from backend.app.agents.safety_heatmap import SafetyHeatmapAgentNode
from backend.app.agents.safe_route import SafeRouteAgentNode
from backend.app.agents.culprit_matching import CulpritMatchingModule
from backend.app.agents.verification import VerificationAgent
from backend.app.agents.privacy_guardian import PrivacyGuardianAgentNode
from backend.app.agents.legal import LegalAgentNode
from backend.app.agents.therapy import TherapyAgentNode
from backend.app.agents.evidence_compiler import EvidenceCompilerAgent


def create_kavach_graph(db: Session):
    """Build and compile the LangGraph StateGraph."""
    workflow = StateGraph(KavachGraphState)

    # Node wrappers passing the db session
    async def guardian_step(state: KavachGraphState) -> KavachGraphState:
        return await GuardianOrchestratorAgent.process_signal(state, db=db)

    def proximity_step(state: KavachGraphState) -> KavachGraphState:
        return ProximityRiskAgentNode.execute(state, db=db)

    def heatmap_step(state: KavachGraphState) -> KavachGraphState:
        return SafetyHeatmapAgentNode.execute(state, db=db)

    def route_step(state: KavachGraphState) -> KavachGraphState:
        return SafeRouteAgentNode.execute(state, db=db)

    async def therapy_step(state: KavachGraphState) -> KavachGraphState:
        return await TherapyAgentNode.execute(state, db=db)

    def matching_step(state: KavachGraphState) -> KavachGraphState:
        return CulpritMatchingModule.execute(state, db=db)

    def verification_step(state: KavachGraphState) -> KavachGraphState:
        return VerificationAgent.execute(state, db=db)

    def privacy_step(state: KavachGraphState) -> KavachGraphState:
        return PrivacyGuardianAgentNode.execute(state, db=db)

    async def legal_step(state: KavachGraphState) -> KavachGraphState:
        return await LegalAgentNode.execute(state, db=db)

    def evidence_step(state: KavachGraphState) -> KavachGraphState:
        return EvidenceCompilerAgent.execute(state, db=db)

    # Add Nodes
    workflow.add_node("guardian", guardian_step)
    workflow.add_node("proximity_risk", proximity_step)
    workflow.add_node("safety_heatmap", heatmap_step)
    workflow.add_node("safe_route", route_step)
    workflow.add_node("therapy", therapy_step)
    workflow.add_node("culprit_matching", matching_step)
    workflow.add_node("verification", verification_step)
    workflow.add_node("privacy_guardian", privacy_step)
    workflow.add_node("legal", legal_step)
    workflow.add_node("evidence_compiler", evidence_step)

    # Set Entry Point
    workflow.set_entry_point("guardian")

    # Conditional router from Guardian
    def guardian_router(state: KavachGraphState) -> str:
        sig = state.get("signal_type", "").upper()
        if "GPS" in sig or "PROXIMITY" in sig:
            return "proximity_risk"
        elif "THERAPY" in sig or "CHAT" in sig:
            return "therapy"
        elif "OFFENDER" in sig or "MATCH" in sig:
            return "culprit_matching"
        elif "LEGAL" in sig or "COMPLAINT" in sig:
            return "legal"
        elif "ROUTE" in sig:
            return "safe_route"
        elif "HEATMAP" in sig:
            return "safety_heatmap"
        else:
            return "evidence_compiler"

    workflow.add_conditional_edges(
        "guardian",
        guardian_router,
        {
            "proximity_risk": "proximity_risk",
            "therapy": "therapy",
            "culprit_matching": "culprit_matching",
            "legal": "legal",
            "safe_route": "safe_route",
            "safety_heatmap": "safety_heatmap",
            "evidence_compiler": "evidence_compiler",
        }
    )

    # Connect downstream handoff chains
    workflow.add_edge("proximity_risk", "safety_heatmap")
    workflow.add_edge("safety_heatmap", "safe_route")
    workflow.add_edge("safe_route", "evidence_compiler")

    workflow.add_edge("therapy", "legal")
    workflow.add_edge("legal", "evidence_compiler")

    workflow.add_edge("culprit_matching", "verification")
    workflow.add_edge("verification", "privacy_guardian")
    workflow.add_edge("privacy_guardian", "evidence_compiler")

    workflow.add_edge("evidence_compiler", END)

    return workflow.compile()


class LangGraphOrchestrationService:
    """Service to execute end-to-end LangGraph runs."""

    @classmethod
    async def run_pipeline(
        cls,
        db: Session,
        signal_type: str,
        raw_input: str,
        location: Optional[Dict[str, float]] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        open_case_ids: Optional[list] = None,
    ) -> KavachGraphState:
        """Initialize state and execute compiled graph."""
        req_id = str(uuid.uuid4())
        sess_id = session_id or str(uuid.uuid4())

        initial_state: KavachGraphState = {
            "request_id": req_id,
            "session_id": sess_id,
            "user_id": user_id,
            "signal_type": signal_type,
            "raw_input": raw_input,
            "normalized_input": raw_input.strip(),
            "location": location,
            "timestamp": "",
            "intent": "INITIALIZING",
            "severity": "LOW",
            "confidence": 0.0,
            "current_agent": "Entry",
            "previous_agent": None,
            "next_agents": [],
            "open_case_ids": open_case_ids or [],
            "escalation_level": "NONE",
            "authority_visibility": False,
            "audit_events": [],
            "activity_timeline": [],
            "final_response": {},
        }

        app = create_kavach_graph(db)
        final_state = await app.ainvoke(initial_state)
        return final_state
