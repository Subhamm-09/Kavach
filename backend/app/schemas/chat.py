"""Pydantic schemas for Therapy Chat and distress detection."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel


class ChatMessageCreate(BaseModel):
    session_token: Optional[str] = None
    text: str
    user_latitude: Optional[float] = None
    user_longitude: Optional[float] = None


class DistressSignal(BaseModel):
    is_distressed: bool
    distress_level: str  # NONE, MILD, ELEVATED, IMMINENT_DANGER
    distress_score: float  # 0.0 to 1.0
    detected_intent: str
    trigger_cues: List[str]
    guardian_handoff_required: bool
    recommended_action: str


class ChatMessageResponse(BaseModel):
    message_id: str
    session_token: str
    sender: str
    text: str
    distress_analysis: DistressSignal
    guardian_handoff: Optional[Dict[str, Any]] = None
    timestamp: datetime


class ChatSessionDetailResponse(BaseModel):
    session_token: str
    status: str
    message_count: int
    created_at: datetime
    messages: List[ChatMessageResponse] = []
