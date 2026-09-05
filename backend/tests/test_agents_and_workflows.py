"""Automated Test Suite for Agents, Proximity Escalation, Therapy Handoff, and Matching."""

import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.app.main import app
from backend.app.database import SessionLocal
from backend.app.seed.seeder import seed_database
from backend.app.agents.guardian import GuardianOrchestratorAgent
from backend.app.agents.therapy import TherapyAgentNode
from backend.app.agents.culprit_matching import CulpritMatchingModule
from backend.app.agents.verification import VerificationAgent
from backend.app.geospatial.proximity import ProximityRiskAgent
from backend.app.geospatial.routing import SafeRouteAgent

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def init_db():
    db = SessionLocal()
    seed_database(db, force=True)
    yield
    db.close()


def test_proximity_autonomous_escalation():
    """Test that a GPS ping near the Patia Infocity dark zone triggers autonomous escalation."""
    db = SessionLocal()
    try:
        # Step 1: Normal safe coordinate in lit commercial zone (e.g. Chandrasekharpur / Nalco)
        safe_res = ProximityRiskAgent.evaluate_gps_ping(
            db=db,
            session_id="TEST-GPS-SESS-1",
            lat=20.3150,
            lng=85.8220,
        )
        assert safe_res["escalation_triggered"] is False
        assert safe_res["risk_level"] in ["LOW", "MODERATE"]

        # Step 2: Ingress into Flagged Hotspot (ZONE-PATIA-01: 20.3550, 85.8180)
        hotspot_res = ProximityRiskAgent.evaluate_gps_ping(
            db=db,
            session_id="TEST-GPS-SESS-1",
            lat=20.3551,
            lng=85.8181,
        )
        # MUST trigger autonomous escalation
        assert hotspot_res["escalation_triggered"] is True
        assert hotspot_res["guardian_action"] is not None
        assert "Infocity" in hotspot_res["nearest_zone_name"] or "ZONE-PATIA-01" in hotspot_res["nearest_zone_name"]
        assert hotspot_res["handoff_details"]["target_agent"] == "GuardianOrchestrator"
    finally:
        db.close()


@pytest.mark.asyncio
async def test_therapy_danger_cue_distress_handoff():
    """Test that distress cues in therapy chat trigger a Guardian handoff."""
    db = SessionLocal()
    try:
        # Danger statement
        user_message = "I don't feel safe and someone is following me in this unlit alley."
        
        chat_res = await TherapyAgentNode.process_chat_message(
            db=db,
            session_token="TEST-THERAPY-SESS-1",
            user_message=user_message,
            user_lat=20.3550,
            user_lng=85.8180,
        )

        assert chat_res["distress_analysis"]["is_distressed"] is True
        assert chat_res["distress_analysis"]["guardian_handoff_required"] is True
        assert chat_res["guardian_handoff"] is not None
        assert chat_res["guardian_handoff"]["target_agent"] == "GuardianOrchestrator"
        assert "following" in "".join(chat_res["distress_analysis"]["trigger_cues"])
    finally:
        db.close()


def test_culprit_vector_matching_and_verification():
    """Test vector similarity search in ChromaDB and Verification Agent evaluation."""
    db = SessionLocal()
    try:
        # Submit description matching MOCK-OFF-01
        perp_desc = "Male riding a black pulsar motorcycle with a crescent scar on his left cheek."
        
        candidates = CulpritMatchingModule.match_candidates(
            db=db,
            perpetrator_description=perp_desc,
            top_k=3,
        )
        assert len(candidates) > 0
        top_cand = candidates[0]
        assert top_cand["offender_code"] == "MOCK-OFF-01"
        assert top_cand["similarity_score"] >= 0.65

        # Verification Path B (Corroboration)
        ver_res = VerificationAgent.evaluate_candidate(
            db=db,
            offender_id=top_cand["offender_id"],
            case_id="CASE-TEST-101",
            verification_path="PATH_B_CORROBORATION",
            corroboration_reports_count=3,
        )
        assert ver_res["outcome"] == "VERIFIED"
        assert ver_res["corroboration_count"] == 3
    finally:
        db.close()


def test_safe_routing_factual_avoidance():
    """Test that safe-routing calculates a route that bypasses unlit risk zones and returns factual explanations."""
    db = SessionLocal()
    try:
        routes_res = SafeRouteAgent.compute_safe_routes(
            db=db,
            origin_lat=20.3550,
            origin_lng=85.8180,
            dest_lat=20.2660,
            dest_lng=85.8410,
        )
        assert routes_res.recommended_route is not None
        assert routes_res.recommended_route.is_recommended is True
        assert len(routes_res.recommended_route.waypoints) > 2
        assert "bypassing" in routes_res.recommended_route.factual_explanation.lower() or "avoids" in routes_res.recommended_route.factual_explanation.lower()
    finally:
        db.close()
