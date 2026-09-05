"""Base AI Provider Abstract Class for Kavach."""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BaseAIProvider(ABC):
    """Abstract interface for AI reasoning and classification."""

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
