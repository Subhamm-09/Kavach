"""Gemini AI Provider using the official Google GenAI SDK.
Falls back automatically to DeterministicFallbackProvider if GEMINI_API_KEY is unset or fails.
"""

import os
import json
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

from backend.app.config import settings
from backend.app.providers.base import BaseAIProvider
from backend.app.providers.fallback import DeterministicFallbackProvider


class GeminiProvider(BaseAIProvider):
    """Google Gemini AI Provider implementation."""

    def __init__(self):
        self.fallback = DeterministicFallbackProvider()
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[GEMINI INIT WARNING] Failed to initialize Gemini client: {e}")
                self.client = None

    async def classify_guardian_signal(
        self,
        signal_type: str,
        raw_input: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Classify incoming signal using Gemini structured JSON response."""
        if not self.client:
            return await self.fallback.classify_guardian_signal(signal_type, raw_input, context)

        prompt = f"""You are the Guardian Orchestrator Agent for KAVACH, an agentic safety platform in Bhubaneswar.
Classify the incoming signal and determine the downstream agent routing and escalation decision.

Signal Type: {signal_type}
Raw Input: {raw_input}
Context: {json.dumps(context or {}, default=str)}

Respond with a valid JSON object matching this schema:
{{
  "intent": "<string>",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": <float 0.0 to 1.0>,
  "selected_agents": ["<AgentName>", ...],
  "escalation_required": <bool>,
  "escalation_action": "<string>",
  "reasoning_summary": "<concise 1-2 sentence explanation>"
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                )
            )
            result = json.loads(response.text)
            return result
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Guardian classification failed ({e}), using fallback.")
            return await self.fallback.classify_guardian_signal(signal_type, raw_input, context)

    async def analyze_therapy_distress(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """Analyze message for distress or imminent danger using Gemini."""
        if not self.client:
            return await self.fallback.analyze_therapy_distress(message_text, conversation_history)

        prompt = f"""You are the Therapy Agent's safety perception module for KAVACH.
Analyze the user's message for distress and imminent safety risks (e.g. stalking, being followed, unsafe area, physical threat).

Message: "{message_text}"

Respond with JSON:
{{
  "is_distressed": <bool>,
  "distress_level": "NONE" | "MILD" | "ELEVATED" | "IMMINENT_DANGER",
  "distress_score": <float 0.0 to 1.0>,
  "detected_intent": "<string>",
  "trigger_cues": ["<extracted words or phrases>", ...],
  "guardian_handoff_required": <bool>,
  "recommended_action": "<string>"
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Therapy analysis failed ({e}), using fallback.")
            return await self.fallback.analyze_therapy_distress(message_text, conversation_history)

    async def generate_therapy_response(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]],
        distress_level: str
    ) -> str:
        """Generate trauma-informed conversational response using Gemini."""
        if not self.client:
            return await self.fallback.generate_therapy_response(message_text, conversation_history, distress_level)

        prompt = f"""You are the Therapy Agent for KAVACH, a trauma-informed safety platform in India.
Provide a supportive, grounding, empathetic response.
CRITICAL RULES:
- Do NOT diagnose any medical, psychiatric, or psychological conditions.
- Keep the user's physical safety as the top priority.
- If distress_level is IMMINENT_DANGER, encourage moving to safety and mention that Guardian is activated.
- Keep response calm, clear, and concise.

User Message: "{message_text}"
Distress Level: {distress_level}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.3)
            )
            return response.text.strip()
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Therapy response generation failed ({e}), using fallback.")
            return await self.fallback.generate_therapy_response(message_text, conversation_history, distress_level)

    async def draft_formal_complaint(
        self,
        incident_narrative: str,
        perpetrator_details: Optional[str],
        citations: List[Dict[str, Any]],
        police_station: str,
        complainant_name: str
    ) -> str:
        """Draft formal statutory police complaint using Gemini."""
        if not self.client:
            return await self.fallback.draft_formal_complaint(
                incident_narrative, perpetrator_details, citations, police_station, complainant_name
            )

        citations_text = "\n".join([f"- {c.get('document_name')}: {c.get('snippet')}" for c in citations])
        prompt = f"""You are the Legal Agent for KAVACH in Bhubaneswar, Odisha.
Draft a formal criminal complaint to the Station House Officer (SHO) of {police_station} under Bharatiya Nyaya Sanhita (BNS) / relevant Indian statutes.

Complainant: {complainant_name}
Incident Facts: {incident_narrative}
Perpetrator Descriptors: {perpetrator_details or 'As described'}
Retrieved Legal Citations:
{citations_text}

Format the output cleanly as a formal legal complaint letter.
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.2)
            )
            return response.text.strip()
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Complaint drafting failed ({e}), using fallback.")
            return await self.fallback.draft_formal_complaint(
                incident_narrative, perpetrator_details, citations, police_station, complainant_name
            )


# Global AI Provider instance
ai_provider = GeminiProvider()
