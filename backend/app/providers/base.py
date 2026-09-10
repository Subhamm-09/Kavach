"""Base AI Provider Abstract Class for Kavach."""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BaseAIProvider(ABC):
    """Abstract interface for AI reasoning, classification, and response synthesis."""

    @abstractmethod
    async def classify_guardian_signal(
        self,
        signal_type: str,
        raw_input: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Classify incoming signal intent, severity, and recommend downstream agent routing."""
        pass

    @abstractmethod
    async def analyze_therapy_distress(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """Detect distress signals, danger cues, and evaluate Guardian handoff necessity."""
        pass

    @abstractmethod
    async def generate_therapy_response(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]],
        distress_level: str
    ) -> str:
        """Generate empathetic, trauma-informed supportive response without medical diagnosis."""
        pass

    @abstractmethod
    async def draft_formal_complaint(
        self,
        incident_narrative: str,
        perpetrator_details: Optional[str],
        citations: List[Dict[str, Any]],
        police_station: str,
        complainant_name: str
    ) -> str:
        """Draft a formal statutory police complaint using retrieved legal citations."""
        pass

    @abstractmethod
    async def analyze_emotion(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify emotion into canonical set with 1-10 intensity."""
        pass

    @abstractmethod
    async def classify_chat_intent(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify conversational intent for intelligent branching."""
        pass

    @abstractmethod
    async def synthesize_final_response(
        self,
        user_message: str,
        therapy_res: Optional[Dict[str, Any]] = None,
        legal_res: Optional[Dict[str, Any]] = None,
        memories: Optional[List[str]] = None,
        emotion_res: Optional[Dict[str, Any]] = None,
        route_res: Optional[Dict[str, Any]] = None,
        proximity_res: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Synthesize humanized final user response, hiding all internal workflow traces."""
        pass

    @abstractmethod
    async def chatbot_extract_memory(
        self,
        user_message: str,
        final_response: str
    ) -> Dict[str, Any]:
        """Extract high-salience long-term memory to persist."""
        pass
