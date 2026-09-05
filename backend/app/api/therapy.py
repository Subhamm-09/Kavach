"""Therapy Agent Chat API Router."""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.chat import ChatSession, ChatMessage
from backend.app.security.auth import get_current_user_optional
from backend.app.schemas.chat import ChatMessageCreate, ChatMessageResponse, ChatSessionDetailResponse
from backend.app.agents.therapy import TherapyAgentNode

router = APIRouter(prefix="/api/therapy", tags=["Therapy Agent"])


@router.post("/chat", response_model=ChatMessageResponse)
async def send_therapy_message(
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Send a message to the trauma-informed Therapy Agent.
    Evaluates distress and danger cues and initiates Guardian handoff if safety is threatened.
    """
    token = payload.session_token or f"SESS-{uuid.uuid4().hex[:8]}"
    user_id = current_user.id if current_user else None

    result = await TherapyAgentNode.process_chat_message(
        db=db,
        session_token=token,
        user_message=payload.text,
        user_lat=payload.user_latitude,
        user_lng=payload.user_longitude,
        user_id=user_id,
    )
    return result


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
