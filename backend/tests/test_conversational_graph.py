"""Automated Test Suite for Extended Conversational Graph:
- Emotion Analysis (Node 3)
- Memory Retrieval & Persistence (Node 2)
- Intent Router (Node 4)
- Response Synthesizer (Node 1)
"""

import pytest
import asyncio
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.seed.seeder import seed_database
from backend.app.graph.orchestrator import LangGraphOrchestrationService
from backend.app.memory.store import UserMemoryStore


@pytest.fixture(scope="module", autouse=True)
def init_db():
    db = SessionLocal()
    seed_database(db, force=True)
    yield
    db.close()


@pytest.mark.asyncio
async def test_emotional_support_flow_bypasses_legal():
    """Test that pure emotional/distress chat bypasses the legal RAG workflow and synthesizes human response."""
    db = SessionLocal()
    try:
        user_message = "I am so terrified, someone has been following me down this dark street."
        state = await LangGraphOrchestrationService.run_pipeline(
            db=db,
            signal_type="THERAPY_CHAT",
            raw_input=user_message,
            session_id="SESS-TEST-CONV-1"
        )

        # 1. Verify Emotion Analysis
        assert state.get("emotion_result") is not None
        assert state["emotion_result"]["emotion"] == "fear"
        assert state["emotion_result"]["intensity"] >= 8

        # 2. Verify Intent Router
        assert state.get("chat_intent") in ["emotional_support", "safety_request"]

        # 3. Verify Legal was BYPASSED for emotional support
        if state.get("chat_intent") == "emotional_support":
            assert state.get("legal_result") is None, "Legal workflow should NOT execute for pure emotional support!"

        # 4. Verify Final Response Synthesizer populated state['final_response']
        final_res = state.get("final_response")
        assert final_res is not None
        assert "text" in final_res
        assert len(final_res["text"]) > 20

        # 5. Verify NO internal workflow traces are leaked to the user
        text = final_res["text"].lower()
        forbidden_terms = [
            "risk score",
            "intent:",
            "severity: high",
            "therapyagent",
            "guardiansignals",
            "workflow trace",
            "chromadb",
            "affectiveperceptionengine"
        ]
        for term in forbidden_terms:
            assert term not in text, f"Internal reasoning leak detected: '{term}' found in user response!"

    finally:
        db.close()


@pytest.mark.asyncio
async def test_legal_information_flow_invokes_legal():
    """Test that a legal inquiry routes through the legal node and integrates statutes naturally."""
    db = SessionLocal()
    try:
        user_message = "What are my legal rights under BNS regarding repeated stalking and harassment?"
        state = await LangGraphOrchestrationService.run_pipeline(
            db=db,
            signal_type="THERAPY_CHAT",
            raw_input=user_message,
            session_id="SESS-TEST-LEGAL-1"
        )

        # 1. Verify Intent Router classified as legal
        assert state.get("chat_intent") == "legal_information"

        # 2. Verify Legal node DID execute
        assert state.get("legal_result") is not None

        # 3. Verify Final Response synthesized the legal rights naturally
        final_res = state.get("final_response")
        assert final_res is not None
        assert len(final_res["text"]) > 20
        assert "right" in final_res["text"].lower() or "bns" in final_res["text"].lower()

    finally:
        db.close()


@pytest.mark.asyncio
async def test_memory_storage_and_recall_across_turns():
    """Test that high-salience harassment is persisted in Turn 1 and recalled in Turn 2."""
    db = SessionLocal()
    try:
        user_id = "USER-MEMORY-TEST-99"

        # Turn 1: Report manager harassment
        turn1_message = "My manager has been repeatedly making inappropriate comments and threatening my position."
        state1 = await LangGraphOrchestrationService.run_pipeline(
            db=db,
            signal_type="THERAPY_CHAT",
            raw_input=turn1_message,
            user_id=user_id,
            session_id="SESS-TURN-1"
        )

        # Verify Turn 1 generated response
        assert state1.get("final_response") is not None

        # Verify Turn 2: User references ongoing issue
        turn2_message = "He cornered me again near the elevator today."
        state2 = await LangGraphOrchestrationService.run_pipeline(
            db=db,
            signal_type="THERAPY_CHAT",
            raw_input=turn2_message,
            user_id=user_id,
            session_id="SESS-TURN-2"
        )

        # Verify Memory was retrieved in Turn 2
        mem_res = state2.get("memory_result")
        assert mem_res is not None
        assert mem_res["memory_count"] > 0
        assert any("manager" in m.lower() for m in mem_res["retrieved_memories"])

        # Verify final response reflects ongoing pattern
        final_res = state2.get("final_response")
        assert final_res is not None

    finally:
        db.close()


@pytest.mark.asyncio
async def test_trivial_messages_not_stored_as_memories():
    """Test that small talk and greetings are filtered out and not stored as memories."""
    db = SessionLocal()
    try:
        user_id = "USER-TRIVIAL-TEST-1"
        greetings = ["Hello", "Good morning!", "Hi there", "How are you?"]

        for g in greetings:
            stored = UserMemoryStore.store_memory_if_salient(
                db=db,
                user_message=g,
                user_id=user_id,
                session_id="SESS-TRIVIAL"
            )
            assert stored is None, f"Trivial greeting '{g}' was improperly stored in memory!"

    finally:
        db.close()
