"""Gemini AI Provider using the official Google GenAI SDK.
Falls back automatically to DeterministicFallbackProvider if GEMINI_API_KEY is unset, rate-limited, or fails.
"""

import os
import json
import time
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

from backend.app.config import settings
from backend.app.providers.base import BaseAIProvider
from backend.app.providers.fallback import DeterministicFallbackProvider


def _parse_json_defensively(raw_text: str) -> Dict[str, Any]:
    """Parse JSON from model response, stripping any markdown code fences if present."""
    text = raw_text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return json.loads(text)


class GeminiProvider(BaseAIProvider):
    """Google Gemini AI Provider implementation with async client and auto-recovering circuit-breaker fallback."""

    def __init__(self):
        self.fallback = DeterministicFallbackProvider()
        self.api_key = (settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")).strip()
        self.client = None
        self.quota_exhausted_until = 0.0
        if self.api_key:
            try:
                self.client = genai.Client(
                    api_key=self.api_key,
                    http_options=types.HttpOptions(
                        retry_options=types.HttpRetryOptions(attempts=1)
                    )
                )
            except Exception as e:
                print(f"[GEMINI INIT WARNING] Failed to initialize Gemini client: {e}")
                self.client = None

    @property
    def is_available(self) -> bool:
        """Check if Gemini client is active and not in a temporary rate-limit cooldown window."""
        if not self.client:
            return False
        if time.time() < self.quota_exhausted_until:
            return False
        return True

    def _handle_failure(self, err: Exception, stage: str):
        err_str = str(err)
        if any(code in err_str for code in ["400", "401", "403", "429", "503", "RESOURCE_EXHAUSTED", "UNAVAILABLE", "INVALID_ARGUMENT", "quota"]):
            self.quota_exhausted_until = time.time() + 45.0
            print(f"[GEMINI CIRCUIT BREAKER] {stage} rate-limited or unavailable ({err_str[:90]}). Temporary 45s fallback active.")
        else:
            print(f"[GEMINI CALL FALLBACK] {stage} failed ({err_str[:90]}), using fallback.")

    async def _generate_content_resilient(self, prompt: str, config: Optional[types.GenerateContentConfig] = None) -> Any:
        """Attempt primary configured model asynchronously; if 503 or transient failure, try fallback model."""
        models_to_try = [settings.GEMINI_MODEL]
        if "flash-latest" not in settings.GEMINI_MODEL:
            models_to_try.append("gemini-flash-latest")

        last_err = None
        for m in models_to_try:
            try:
                kwargs = {"model": m, "contents": prompt}
                if config:
                    kwargs["config"] = config
                return await self.client.aio.models.generate_content(**kwargs)
            except Exception as e:
                last_err = e
                err_str = str(e)
                if "503" in err_str or "UNAVAILABLE" in err_str:
                    print(f"[GEMINI RETRY] Model {m} busy (503), trying secondary model...")
                    continue
                raise e
        raise last_err

    async def classify_guardian_signal(
        self,
        signal_type: str,
        raw_input: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Classify incoming signal using fast heuristics for standard workflows, reserving LLM for complex queries."""
        if signal_type in ["THERAPY_CHAT", "CHAT_CUE", "GPS_PING", "PROXIMITY_EVENT"]:
            return await self.fallback.classify_guardian_signal(signal_type, raw_input, context)

        if not self.is_available:
            return await self.fallback.classify_guardian_signal(signal_type, raw_input, context)

        prompt = f"""You are the Guardian Orchestrator Agent for KAVACH, an agentic safety platform in Bhubaneswar.
Classify the incoming signal and determine the downstream agent routing and escalation decision.

=========================================
FEW-SHOT REFERENCE
=========================================
Signal Type: "CHAT_CUE"
Raw Input: "A suspicious vehicle is trailing me near Infocity."
Output:
{{
  "intent": "IMMINENT_PURSUIT_RISK",
  "severity": "HIGH",
  "confidence": 0.96,
  "selected_agents": ["TherapyAgent", "SafeRouteAgent", "LegalAgent"],
  "escalation_required": true,
  "escalation_action": "ACTIVATE_PERIMETER_SHELTER_MONITORING",
  "reasoning_summary": "Active vehicle trailing reported in Infocity corridor requiring immediate safety handoff and safe routing."
}}

=========================================
CURRENT SIGNAL TO CLASSIFY
=========================================
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
            response = await self._generate_content_resilient(
                prompt=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.0,
                )
            )
            result = _parse_json_defensively(response.text)
            return result
        except Exception as e:
            self._handle_failure(e, "Guardian classification")
            return await self.fallback.classify_guardian_signal(signal_type, raw_input, context)

    async def analyze_therapy_distress(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """Analyze message for distress or imminent danger using deterministic safety perception, reserving LLM for synthesis."""
        return await self.fallback.analyze_therapy_distress(message_text, conversation_history)

    async def generate_therapy_response(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]],
        distress_level: str
    ) -> str:
        """Generate trauma-informed conversational response asynchronously using Gemini."""
        if not self.is_available:
            return await self.fallback.generate_therapy_response(message_text, conversation_history, distress_level)

        prompt = f"""You are the Therapy Agent for KAVACH, a trauma-informed safety platform in India.
Provide a supportive, grounding, empathetic response.
CRITICAL RULES:
- Do NOT diagnose any medical, psychiatric, or psychological conditions.
- Keep the user's physical safety as the top priority.
- If distress_level is IMMINENT_DANGER, encourage moving to safety and mention that Guardian is activated.
- Keep response calm, clear, and concise.

=========================================
FEW-SHOT REFERENCE
=========================================
User Message: "I am feeling very anxious. A man was staring at me and whistling as I walked back from the office in Patia."
Distress Level: ELEVATED
Ideal Response: "I hear you, and it is completely natural to feel shaken after an incident like that. You are in a safer space right now. Take a slow, steady breath with me. If you are still on your commute, stay in well-lit areas or near open stores. Would you like me to note this down in your secure incident log or check your route home?"

=========================================
CURRENT USER CONTEXT
=========================================
User Message: "{message_text}"
Distress Level: {distress_level}
"""
        try:
            response = await self._generate_content_resilient(
                prompt=prompt,
                config=types.GenerateContentConfig(temperature=0.25)
            )
            return response.text.strip()
        except Exception as e:
            self._handle_failure(e, "Therapy response generation")
            return await self.fallback.generate_therapy_response(message_text, conversation_history, distress_level)

    async def draft_formal_complaint(
        self,
        incident_narrative: str,
        perpetrator_details: Optional[str],
        citations: List[Dict[str, Any]],
        police_station: str,
        complainant_name: str
    ) -> str:
        """Draft formal statutory police complaint asynchronously using Gemini."""
        if not self.is_available:
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
            response = await self._generate_content_resilient(
                prompt=prompt,
                config=types.GenerateContentConfig(temperature=0.1)
            )
            return response.text.strip()
        except Exception as e:
            self._handle_failure(e, "Complaint drafting")
            return await self.fallback.draft_formal_complaint(
                incident_narrative, perpetrator_details, citations, police_station, complainant_name
            )

    async def analyze_emotion(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify emotional state using deterministic affective perception, reserving LLM tokens for response synthesis."""
        return await self.fallback.analyze_emotion(message_text, conversation_history)

    async def classify_chat_intent(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify conversational intent using deterministic rule routing, reserving LLM tokens for response synthesis."""
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
        if not self.is_available:
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

=========================================
FEW-SHOT IN-CONTEXT EXAMPLES
=========================================
[EXAMPLE 1 - High Urgency / Physical Stalking]
User Input: "A man on a black bike is following me down the dark lane near KIIT."
Context: Proximity Alert: Patia High Risk Sector
Ideal Output: "That sounds frightening, and keeping you safe is the first priority right now. Head directly toward the well-lit main road near KIIT Square or the nearest open shop immediately. I am monitoring your perimeter and will guide you away from unlit sectors."

[EXAMPLE 2 - Workplace Harassment / POSH Guidance]
User Input: "My manager threatened my appraisal if I refuse to meet him privately after office hours."
Context: Legal Sections: POSH Act Section 3(2), BNS Section 75
Ideal Output: "This is completely unacceptable and crosses clear legal and workplace boundaries. Under workplace protections like the POSH framework, using performance evaluations to coerce private meetings is strictly prohibited. You have the right to report this to your Internal Committee, and we can help you assemble the factual record."
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
            res = await self._generate_content_resilient(
                prompt=f"{system_instruction}\n\n{user_prompt}",
                config=types.GenerateContentConfig(temperature=0.30)
            )
            return res.text.strip()
        except Exception as e:
            self._handle_failure(e, "Final response synthesis")
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
        # Fast heuristic extraction saves LLM quota for synthesis while preserving accuracy
        return await self.fallback.chatbot_extract_memory(user_message, final_response)


# Global AI Provider instance
ai_provider = GeminiProvider()
