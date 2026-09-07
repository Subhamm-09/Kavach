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



    async def analyze_emotion(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify emotional state across 9 canonical emotions and assign intensity 1-10."""
        if not self.client:
            return await self.fallback.analyze_emotion(message_text, conversation_history)

        prompt = f"""You are the Emotion Analysis Node for Kavach Safety Platform.
Classify the user's emotional state from their message into one of these canonical emotions:
- fear, anxiety, sadness, anger, frustration, confusion, hopelessness, relief, neutral

Also assign an emotional intensity from 1 (very mild) to 10 (extreme panic/terror/despair).

User Message: {message_text}

Respond ONLY with valid JSON:
{{
  "emotion": "<fear|anxiety|sadness|anger|frustration|confusion|hopelessness|relief|neutral>",
  "intensity": <int 1-10>,
  "confidence": <float 0.0-1.0>,
  "triggers": ["<keyword or trigger token>"],
  "pacing_guidance": "<short guidance for response tone>"
}}
"""
        try:
            res = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.1)
            )
            return json.loads(res.text.strip())
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Emotion analysis failed ({e}), using fallback.")
            return await self.fallback.analyze_emotion(message_text, conversation_history)

    async def classify_chat_intent(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify conversational intent into one of 6 target branches."""
        if not self.client:
            return await self.fallback.classify_chat_intent(message_text, conversation_history)

        prompt = f"""You are the Chat Intent Router for Kavach.
Determine the primary intent for routing within the safety graph:
- emotional_support (trauma support, emotional check-in, reassurance)
- general_chat (casual greetings, generic inquiry about the app)
- legal_information (asking about statutes, legal rights, BNS, FIR procedures)
- incident_reporting (formal complaint lodging, reporting a specific crime to police)
- route_request (asking for safe routes, walking directions, navigation)
- safety_request (asking about lighting, area safety, crime hotspots, patrols)

User Message: {message_text}

Respond ONLY with valid JSON:
{{
  "intent": "<emotional_support|general_chat|legal_information|incident_reporting|route_request|safety_request>",
  "confidence": <float 0.0-1.0>,
  "reasoning": "<brief justification>"
}}
"""
        try:
            res = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.1)
            )
            return json.loads(res.text.strip())
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Chat intent routing failed ({e}), using fallback.")
            return await self.fallback.classify_chat_intent(message_text, conversation_history)

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
        """Node 1: Dedicated Final Response Node.
        Synthesizes a warm, humanized, trauma-informed response while strictly concealing internal reasoning.
        """
        if not self.client:
            return await self.fallback.synthesize_final_response(
                user_message=user_message,
                therapy_res=therapy_res,
                legal_res=legal_res,
                memories=memories,
                emotion_res=emotion_res,
                route_res=route_res,
                proximity_res=proximity_res
            )

        emotion_info = emotion_res or {}
        intensity = emotion_info.get("intensity", 3)
        emotion = emotion_info.get("emotion", "neutral")

        system_instruction = f"""You are Kavach.
You support users experiencing:
- harassment
- discrimination
- stalking
- abuse
- unsafe situations
- emotional distress

Your goal:
Make users feel heard, understood, supported, and informed.

=========================================
STRICT PRIVACY & CONCEALMENT RULES
=========================================
NEVER reveal or mention:
- risk classifications (e.g., 'Risk: harassment', 'Severity: HIGH')
- intent classifications
- emotion classifications (e.g., 'Emotion: fear, Intensity: 8')
- workflow traces or node names (e.g., 'Guardian', 'TherapyAgent', 'SafeRouteAgent')
- node outputs or diagnostic summaries
- reasoning chains or chain of thought
- memory retrieval mechanisms
- RAG systems or database names

=========================================
HUMANIZATION & TONE RULES
=========================================
- Do not sound like customer support, a legal disclaimer, a call center, or a workflow engine.
- AVOID robotic openings such as:
  * "Thank you for sharing."
  * "I understand your concern."
  * "I am here to help."
- Use natural conversation variation:
  * "That sounds unsettling."
  * "Can you tell me more about that?"
  * "How long has this been happening?"
  * "What happened next?"
- Default response length: 2 to 6 sentences.
- Adapt tone to emotional intensity (Current Emotion: {emotion}, Intensity: {intensity}/10).
  * If intensity >= 7 (Fear/Panic): Keep sentences concise, grounding, and focused on current physical safety.
  * If intensity <= 4: Offer thoughtful context and clear options.
- Reference relevant memories naturally without saying 'According to our stored memories'.
- Integrate legal information conversationally without quoting penal codes like an interrogation.
The user should never feel they are talking to a workflow.
"""

        context_payload = {
            "user_message": user_message,
            "therapy_output": therapy_res.get("text") if therapy_res else None,
            "legal_guidance": legal_res.get("answer") if legal_res else None,
            "legal_sections": legal_res.get("applicable_sections") if legal_res else None,
            "relevant_memories": memories or [],
            "route_summary": route_res.get("recommended_route", {}).get("name") if route_res else None,
            "proximity_alert": proximity_res.get("nearest_zone_name") if proximity_res and proximity_res.get("escalation_triggered") else None
        }

        user_prompt = f"""CONTEXT AVAILABLE:
{json.dumps(context_payload, indent=2)}

CURRENT USER MESSAGE:
{user_message}

Generate the final, natural user-facing response:"""

        try:
            res = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=f"{system_instruction}\n\n{user_prompt}",
                config=types.GenerateContentConfig(temperature=0.35)
            )
            return res.text.strip()
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Final response synthesis failed ({e}), using fallback.")
            return await self.fallback.synthesize_final_response(
                user_message=user_message,
                therapy_res=therapy_res,
                legal_res=legal_res,
                memories=memories,
                emotion_res=emotion_res,
                route_res=route_res,
                proximity_res=proximity_res
            )

    async def chatbot_extract_memory(
        self,
        user_message: str,
        final_response: str
    ) -> Dict[str, Any]:
        """Decide whether to persist high-salience long-term memory."""
        if not self.client:
            return await self.fallback.chatbot_extract_memory(user_message, final_response)

        prompt = f"""You are the Memory Extraction Node for Kavach. Determine what should be stored for future conversations.
Store only: ongoing harassment situations, recurring concerns, major life events, important preferences, goals, important relationships.
Do NOT store trivial conversation details, small talk, or greetings.

User Message: {user_message}
Bot Response: {final_response}

Respond ONLY with valid JSON:
{{
  "should_store": <true_or_false>,
  "memory": "<concise high-salience memory statement or empty string>"
}}
"""
        try:
            res = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.1)
            )
            return json.loads(res.text.strip())
        except Exception as e:
            print(f"[GEMINI CALL FALLBACK] Memory extraction failed ({e}), using fallback.")
            return await self.fallback.chatbot_extract_memory(user_message, final_response)


# Global AI Provider instance
ai_provider = GeminiProvider()

