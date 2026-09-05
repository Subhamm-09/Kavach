"""Therapy Agent graph node.
Trauma-informed, text-only conversational support.
Detects distress and danger cues (e.g. stalking, being followed, unsafe area)
and initiates an immediate backend handoff to Guardian Orchestrator.
Never provides clinical diagnoses or audio/avatar components.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.providers.gemini import ai_provider
from backend.app.models.chat import ChatSession, ChatMessage


class TherapyAgentNode:
    """Therapy Agent executing in the LangGraph graph."""

    @classmethod
    async def process_chat_message(
        cls,
        db: Session,
        session_token: str,
        user_message: str,
        user_lat: Optional[float] = None,
        user_lng: Optional[float] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Process incoming therapy message:
        1. Find or create ChatSession
        2. Analyze distress and danger cues
        3. Trigger Guardian handoff if danger detected
        4. Generate empathetic supportive response
        5. Store messages in database
        """
        chat_session = db.query(ChatSession).filter(ChatSession.session_token == session_token).first()
        if not chat_session:
            chat_session = ChatSession(
                user_id=user_id,
                session_token=session_token,
                status="ACTIVE",
                created_at=datetime.utcnow(),
            )
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)

        # Retrieve recent conversation history
        past_msgs = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == chat_session.id)
            .order_by(ChatMessage.created_at.asc())
            .limit(10)
            .all()
        )
        history = [{"sender": m.sender, "text": m.text} for m in past_msgs]

        # Analyze distress
        distress_analysis = await ai_provider.analyze_therapy_distress(
            message_text=user_message,
            conversation_history=history,
        )

        distress_level = distress_analysis.get("distress_level", "NONE")
        handoff_required = distress_analysis.get("guardian_handoff_required", False)

        # Generate response
        therapy_response_text = await ai_provider.generate_therapy_response(
            message_text=user_message,
            conversation_history=history,
            distress_level=distress_level,
        )

        # Prepare Guardian handoff metadata
        guardian_handoff = None
        if handoff_required:
            chat_session.status = "ESCALATED_TO_GUARDIAN"
            guardian_handoff = {
                "handoff_id": str(uuid.uuid4()),
                "triggering_agent": "TherapyAgent",
                "target_agent": "GuardianOrchestrator",
                "distress_level": distress_level,
                "detected_cues": distress_analysis.get("trigger_cues", []),
                "action_recommended": "ACTIVATE_PROXIMITY_MONITORING_AND_SAFETY_SURFACE",
                "timestamp": datetime.utcnow().isoformat(),
            }

        # Store User Message
        user_msg_record = ChatMessage(
            session_id=chat_session.id,
            sender="USER",
            text=user_message,
            distress_detected=distress_analysis.get("is_distressed", False),
            distress_score=distress_analysis.get("distress_score", 0.0),
            intent_classified=distress_analysis.get("detected_intent", "GENERAL"),
            handoff_triggered=handoff_required,
            created_at=datetime.utcnow(),
        )
        db.add(user_msg_record)

        # Store Therapy Agent Response
        agent_msg_record = ChatMessage(
            session_id=chat_session.id,
            sender="THERAPY_AGENT",
            text=therapy_response_text,
            distress_detected=False,
            distress_score=0.0,
            intent_classified="SUPPORT_RESPONSE",
            handoff_triggered=False,
            created_at=datetime.utcnow(),
        )
        db.add(agent_msg_record)
        db.commit()

        return {
            "message_id": agent_msg_record.id,
            "session_token": session_token,
            "sender": "THERAPY_AGENT",
            "text": therapy_response_text,
            "distress_analysis": distress_analysis,
            "guardian_handoff": guardian_handoff,
            "timestamp": agent_msg_record.created_at,
        }

    @classmethod
    async def execute(cls, state: KavachGraphState, db: Session) -> KavachGraphState:
        """LangGraph execution node for Therapy Agent."""
        user_msg = state.get("raw_input", "")
        session_id = state.get("session_id", str(uuid.uuid4()))
        loc = state.get("location", {})

        result = await cls.process_chat_message(
            db=db,
            session_token=session_id,
            user_message=user_msg,
            user_lat=loc.get("lat"),
            user_lng=loc.get("lng"),
            user_id=state.get("user_id"),
        )

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "TherapyAgent"
        state["therapy_result"] = result

        distress_level = result["distress_analysis"].get("distress_level", "NONE")
        is_handoff = result["distress_analysis"].get("guardian_handoff_required", False)

        if is_handoff:
            state["severity"] = "CRITICAL"
            state["escalation_level"] = "EMERGENCY_DISPATCH"
            handoff_agent = "GuardianOrchestrator"
        else:
            handoff_agent = None

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "TherapyAgent",
            "signal_type": "THERAPY_CHAT",
            "action": f"Processed conversation. Distress level: {distress_level}",
            "tool_invoked": "TraumaInformedSafetyPerception",
            "input_summary": f"User: '{user_msg[:50]}...'",
            "output_summary": f"Distress: {distress_level}. Handoff to Guardian: {is_handoff}",
            "severity": state.get("severity", "LOW"),
            "handoff_to": handoff_agent
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
