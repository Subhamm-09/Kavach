"""Emotion Analysis Agent graph node (Node 3).
Analyzes user input across 9 canonical emotional states:
- fear, anxiety, sadness, anger, frustration, confusion, hopelessness, relief, neutral
Assigns emotional intensity (1-10) to adapt conversational pacing and response tone.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.providers.gemini import ai_provider
from backend.app.schemas.conversation import EmotionAnalysisResult


class EmotionAnalysisAgentNode:
    """Emotion Analysis Agent executing in the LangGraph graph."""

    @classmethod
    async def execute(cls, state: KavachGraphState, db: Optional[Session] = None) -> KavachGraphState:
        """Analyze user input for emotional cues and intensity."""
        user_message = state.get("raw_input", "")

        # Evaluate emotional state via AI provider or deterministic rules
        analysis_data = await ai_provider.analyze_emotion(
            message_text=user_message,
            conversation_history=[]
        )

        emotion_result = EmotionAnalysisResult(
            emotion=analysis_data.get("emotion", "neutral"),
            intensity=int(analysis_data.get("intensity", 3)),
            confidence=float(analysis_data.get("confidence", 0.85)),
            triggers=analysis_data.get("triggers", []),
            pacing_guidance=analysis_data.get("pacing_guidance", "Maintain balanced, supportive pacing.")
        ).model_dump()

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "EmotionAnalysisAgent"
        state["emotion_result"] = emotion_result

        # Record activity event for timeline/auditing (internal only)
        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "EmotionAnalysisAgent",
            "signal_type": "EMOTION_EVALUATION",
            "action": f"Classified emotion: {emotion_result['emotion']} (Intensity: {emotion_result['intensity']}/10)",
            "tool_invoked": "AffectivePerceptionEngine",
            "input_summary": f"User text: '{user_message[:50]}...'",
            "output_summary": f"Emotion: {emotion_result['emotion']} (Level {emotion_result['intensity']}). Pacing: {emotion_result['pacing_guidance']}",
            "severity": "HIGH" if emotion_result["intensity"] >= 8 else ("MEDIUM" if emotion_result["intensity"] >= 6 else "INFO"),
            "handoff_to": "MemoryRetrievalAgent"
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
