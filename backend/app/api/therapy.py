"""Therapy Agent Chat API Router."""

import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.chat import ChatSession, ChatMessage
from backend.app.security.auth import get_current_user_optional
from backend.app.schemas.chat import ChatMessageCreate, ChatMessageResponse, ChatSessionDetailResponse
from backend.app.agents.therapy import TherapyAgentNode
from backend.app.graph.orchestrator import LangGraphOrchestrationService

router = APIRouter(prefix="/api/therapy", tags=["Therapy Agent"])


@router.post("/chat", response_model=ChatMessageResponse)
async def send_therapy_message(
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Send a message to the trauma-informed conversational agent pipeline.
    Executes the full LangGraph state graph including emotion analysis, memory retrieval,
    intent routing, and sanitized response synthesis.
    """
    token = payload.session_token or f"SESS-{uuid.uuid4().hex[:8]}"
    user_id = current_user.id if current_user else None

    # Execute the full LangGraph Conversational Pipeline
    state = await LangGraphOrchestrationService.run_pipeline(
        db=db,
        signal_type="THERAPY_CHAT",
        raw_input=payload.text,
        location={"lat": payload.user_latitude, "lng": payload.user_longitude} if payload.user_latitude else None,
        user_id=user_id,
        session_id=token,
    )

    final_resp = state.get("final_response") or {}
    final_text = final_resp.get("text")
    therapy_res = state.get("therapy_result") or {}

    response_text = final_text or therapy_res.get("text") or "I am listening and here to support your safety."

    # Update the stored assistant message in DB to retain the synthesized text
    if final_text and therapy_res.get("message_id"):
        db_msg = db.query(ChatMessage).filter(ChatMessage.id == therapy_res["message_id"]).first()
        if db_msg:
            db_msg.text = final_text
            db.commit()

    distress_analysis = therapy_res.get("distress_analysis") or {
        "is_distressed": False,
        "distress_level": "NONE",
        "distress_score": 0.0,
        "detected_intent": state.get("chat_intent", "GENERAL"),
        "trigger_cues": [],
        "guardian_handoff_required": False,
        "recommended_action": "SUPPORT",
    }

    return ChatMessageResponse(
        message_id=therapy_res.get("message_id", str(uuid.uuid4())),
        session_token=token,
        sender="THERAPY_AGENT",
        text=response_text,
        distress_analysis=distress_analysis,
        guardian_handoff=therapy_res.get("guardian_handoff"),
        timestamp=therapy_res.get("timestamp") or datetime.utcnow(),
    )


@router.get("/session/{session_token}", response_model=ChatSessionDetailResponse)
def get_therapy_session_history(session_token: str, db: Session = Depends(get_db)):
    """Retrieve conversation history and distress indicators for a session."""
    session = db.query(ChatSession).filter(ChatSession.session_token == session_token).first()
    if not session:
        return ChatSessionDetailResponse(
            session_token=session_token,
            status="NEW",
            message_count=0,
            created_at=datetime.utcnow(),
            messages=[],
        )

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    msg_responses = []
    for m in messages:
        msg_responses.append(
            ChatMessageResponse(
                message_id=m.id,
                session_token=session_token,
                sender=m.sender,
                text=m.text,
                distress_analysis={
                    "is_distressed": m.distress_detected,
                    "distress_level": "ELEVATED" if m.distress_detected else "NONE",
                    "distress_score": m.distress_score,
                    "detected_intent": m.intent_classified or "GENERAL",
                    "trigger_cues": [],
                    "guardian_handoff_required": m.handoff_triggered,
                    "recommended_action": "SUPPORT",
                },
                guardian_handoff=None,
                timestamp=m.created_at,
            )
        )

    return ChatSessionDetailResponse(
        session_token=session.session_token,
        status=session.status,
        message_count=len(messages),
        created_at=session.created_at,
        messages=msg_responses,
    )
