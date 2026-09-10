"""Pydantic schemas for the extended conversational agent workflow:
- Emotion Analysis
- Chat Intent Routing
- Salient Memory Retrieval & Persistence
- Final Synthesized Response
"""

from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field


CanonicalEmotion = Literal[
    "fear",
    "anxiety",
    "sadness",
    "anger",
    "frustration",
    "confusion",
    "hopelessness",
    "relief",
    "neutral"
]

ChatIntentType = Literal[
    "emotional_support",
    "general_chat",
    "legal_information",
    "incident_reporting",
    "route_request",
    "safety_request"
]


class EmotionAnalysisResult(BaseModel):
    """Schema for Node 3: Emotion Analysis."""
    emotion: CanonicalEmotion = Field(
        default="neutral",
        description="Canonical emotional classification"
    )
    intensity: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Intensity rating on a scale from 1 (mild) to 10 (extreme/panic)"
    )
    confidence: float = Field(
        default=0.85,
        ge=0.0,
        le=1.0,
        description="Classifier confidence"
    )
    triggers: List[str] = Field(
        default_factory=list,
        description="Identified distress or emotional trigger tokens"
    )
    pacing_guidance: str = Field(
        default="Maintain balanced, supportive pacing.",
        description="Tone and length recommendation for response synthesis"
    )


class ChatIntentResult(BaseModel):
    """Schema for Node 4: Intent Router."""
    intent: ChatIntentType = Field(
        default="emotional_support",
        description="Classified conversational branch target"
    )
    confidence: float = Field(
        default=0.85,
        ge=0.0,
        le=1.0
    )
    reasoning: str = Field(
        default="Determined by keyword heuristics and semantic classifier",
        description="Internal routing justification (never exposed to user)"
    )


class MemoryItem(BaseModel):
    """Schema for individual salient memory."""
    id: Optional[str] = None
    memory_text: str
    category: Literal["HARASSMENT", "FEAR", "OFFENDER", "INCIDENT", "PREFERENCE", "GENERAL"] = "GENERAL"
    salience_score: float = 0.8
    created_at: Optional[datetime] = None


class MemoryRetrievalResult(BaseModel):
    """Schema for Node 2: Memory Retrieval."""
    retrieved_memories: List[str] = Field(
        default_factory=list,
        description="List of concise, relevant memory statements"
    )
    memory_count: int = 0
    query_matched: Optional[str] = None


class FinalResponseResult(BaseModel):
    """Schema for Node 1: Response Synthesizer (user-facing)."""
    text: str = Field(
        ...,
        description="Natural, empathetic, and humanized response. Stripped of all internal reasoning."
    )
    tone: str = Field(
        default="supportive",
        description="Tone adapted to emotional intensity"
    )
    requires_followup: bool = False
    escalation_advised: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
