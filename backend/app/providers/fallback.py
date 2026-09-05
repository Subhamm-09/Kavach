"""Deterministic Fallback AI Provider.
Provides deterministic, rule-grounded reasoning when Gemini API Key is not configured,
ensuring offline hackathon demos execute flawlessly without crashing.
"""

import re
from typing import Dict, Any, List, Optional
from backend.app.providers.base import BaseAIProvider


class DeterministicFallbackProvider(BaseAIProvider):
    """Deterministic, rule-based fallback provider."""

    async def classify_guardian_signal(
        self,
        signal_type: str,
        raw_input: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Classify incoming signals deterministically using intent keywords and severity heuristics."""
        text_lower = (raw_input or "").lower()
        context = context or {}

        # 1. Proximity / GPS signal
        if signal_type in ["GPS_PING", "PROXIMITY_EVENT"]:
            risk_score = context.get("calculated_risk_score", 0.0)
            if risk_score >= 70.0 or "critical" in text_lower or context.get("is_inside_danger_zone"):
                return {
                    "intent": "IMMINENT_SAFETY_HAZARD",
                    "severity": "HIGH",
                    "confidence": 0.95,
                    "selected_agents": ["ProximityRiskAgent", "SafeRouteAgent"],
                    "escalation_required": True,
                    "escalation_action": "TRIGGER_HOTSPOT_ALERT_AND_REROUTE",
                    "reasoning_summary": "Proximity risk agent identified entry into a flagged unlit hotspot with active threat indicators."
                }
            elif risk_score >= 35.0:
                return {
                    "intent": "ELEVATED_RISK_MONITORING",
                    "severity": "MEDIUM",
                    "confidence": 0.88,
                    "selected_agents": ["ProximityRiskAgent", "SafetyHeatmapAgent"],
                    "escalation_required": False,
                    "escalation_action": "UPDATE_HEATMAP_RADAR",
                    "reasoning_summary": "Moderate ambient risk detected; continuous telemetry logging active."
                }
            else:
                return {
                    "intent": "ROUTINE_TELEMETRY",
                    "severity": "LOW",
                    "confidence": 0.98,
                    "selected_agents": ["ProximityRiskAgent"],
                    "escalation_required": False,
                    "escalation_action": "LOG_TELEMETRY",
                    "reasoning_summary": "Telemetry in safe corridor."
                }

        # 2. Therapy Chat signal
        if signal_type in ["THERAPY_CHAT", "CHAT_CUE"]:
            danger_keywords = ["following me", "stalking", "not safe", "scared", "someone is behind", "help me", "danger", "hurt", "trapped", "attacking"]
            is_danger = any(k in text_lower for k in danger_keywords)
            
            if is_danger:
                return {
                    "intent": "EMERGENCY_DISTRESS_DETECTED",
                    "severity": "CRITICAL",
                    "confidence": 0.94,
                    "selected_agents": ["TherapyAgent", "ProximityRiskAgent", "EvidenceCompilerAgent"],
                    "escalation_required": True,
                    "escalation_action": "INITIATE_GUARDIAN_INTERVENTION",
                    "reasoning_summary": "Therapy agent flagged imminent danger cues in conversation transcript."
                }
            else:
                return {
                    "intent": "CONVERSATIONAL_SUPPORT",
                    "severity": "LOW",
                    "confidence": 0.90,
                    "selected_agents": ["TherapyAgent"],
                    "escalation_required": False,
                    "escalation_action": "PROVIDE_EMPATHETIC_SUPPORT",
                    "reasoning_summary": "Trauma-informed supportive dialogue without acute distress triggers."
                }

        # 3. Offender / Incident Matching signal
        if signal_type in ["OFFENDER_MATCH", "INCIDENT_REPORT"]:
            return {
                "intent": "CULPRIT_IDENTIFICATION_WORKFLOW",
                "severity": "MEDIUM",
                "confidence": 0.92,
                "selected_agents": ["CulpritMatchingModule", "VerificationAgent", "PrivacyGuardianAgent"],
                "escalation_required": False,
                "escalation_action": "EXECUTE_VECTOR_CORRELATION_AND_VERIFICATION",
                "reasoning_summary": "Submitted perpetrator description routed through privacy filter to ChromaDB candidate matching."
            }

        # 4. Legal Assistance signal
        if signal_type in ["LEGAL_QUERY", "COMPLAINT_DRAFT"]:
            return {
                "intent": "LEGAL_RAG_ASSISTANCE",
                "severity": "MEDIUM",
                "confidence": 0.93,
                "selected_agents": ["LegalAgent", "EvidenceCompilerAgent"],
                "escalation_required": False,
                "escalation_action": "RETRIEVE_STATUTORY_CITATIONS",
                "reasoning_summary": "Routing to Legal RAG Agent for statutory citations and complaint drafting."
            }

        # Default fallback
        return {
            "intent": "GENERAL_SAFETY_SIGNAL",
            "severity": "LOW",
            "confidence": 0.85,
            "selected_agents": ["GuardianOrchestrator"],
            "escalation_required": False,
            "escalation_action": "MAINTAIN_STATE",
            "reasoning_summary": "General signal received and processed."
        }

    async def analyze_therapy_distress(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """Deterministic distress classifier."""
        text_lower = message_text.lower()
        imminent_danger_cues = ["following me", "stalking", "danger", "someone is following", "help me", "hurt me", "cornered", "scared", "don't feel safe", "unlit alley"]
        emotional_distress_cues = ["anxious", "overwhelmed", "shaking", "panic", "crying", "trauma", "afraid"]

        detected_cues = [c for c in imminent_danger_cues if c in text_lower]
        emo_cues = [c for c in emotional_distress_cues if c in text_lower]

        if detected_cues:
            return {
                "is_distressed": True,
                "distress_level": "IMMINENT_DANGER",
                "distress_score": 0.92,
                "detected_intent": "IMMINENT_DANGER",
                "trigger_cues": detected_cues,
                "guardian_handoff_required": True,
                "recommended_action": "ACTIVATE_GUARDIAN_SAFETY_INTERVENTION",
            }
        elif emo_cues:
            return {
                "is_distressed": True,
                "distress_level": "ELEVATED",
                "distress_score": 0.65,
                "detected_intent": "EMOTIONAL_DISTRESS",
                "trigger_cues": emo_cues,
                "guardian_handoff_required": False,
                "recommended_action": "CONTINUE_TRAUMA_INFORMED_GROUNDING",
            }
        else:
            return {
                "is_distressed": False,
                "distress_level": "NONE",
                "distress_score": 0.1,
                "detected_intent": "GENERAL_CONVERSATION",
                "trigger_cues": [],
                "guardian_handoff_required": False,
                "recommended_action": "MAINTAIN_SUPPORTIVE_PRESENCE",
            }

    async def generate_therapy_response(
        self,
        message_text: str,
        conversation_history: List[Dict[str, str]],
        distress_level: str
    ) -> str:
        """Deterministic empathetic responses."""
        if distress_level == "IMMINENT_DANGER":
            return (
                "I hear you, and your immediate physical safety is the absolute priority right now. "
                "I have discreetly alerted Guardian to activate proximity monitoring and prepare emergency escalation options. "
                "If you can do so safely, move toward a well-lit, populated area (such as an open shop, petrol pump, or main road). "
                "Are you in a spot where you can keep walking, or do you need me to trigger direct emergency dispatch (112) immediately?"
            )
        elif distress_level == "ELEVATED":
            return (
                "Thank you for sharing that with me. It is completely understandable to feel shaken after an incident like this. "
                "Let's take a slow, deep breath together. You are in a secure space here. "
                "Would you like to review safe route options, explore legal remedies, or simply take a moment to ground yourself?"
            )
        else:
            return (
                "I'm here with you. Kavach provides confidential, trauma-informed support whenever you feel uncertain or unsafe. "
                "How can I best assist you right now?"
            )

    async def draft_formal_complaint(
        self,
        incident_narrative: str,
        perpetrator_details: Optional[str],
        citations: List[Dict[str, Any]],
        police_station: str,
        complainant_name: str
    ) -> str:
        """Deterministic statutory complaint formatting."""
        statutory_refs = "Bharatiya Nyaya Sanhita (BNS) Sections 354, 354D, 509 and Information Technology Act § 66E"
        if citations:
            statutory_refs = ", ".join([f"{c.get('document_name', 'Statute')} § {c.get('section', 'General')}" for c in citations[:3]])

        draft = f"""TO:
The Officer-in-Charge / Station House Officer,
{police_station},
Bhubaneswar Urban Police District, Odisha.

SUBJECT: Formal Criminal Complaint regarding Stalking, Criminal Intimidation, and Harassment under {statutory_refs}.

Respected Officer,

I, {complainant_name}, resident of Bhubaneswar, am writing to lodge a formal written complaint regarding an incident of criminal harassment and stalking that occurred within your jurisdictional limits.

1. STATEMENT OF FACTS:
{incident_narrative}

2. PERPETRATOR DETAILS & IDENTIFYING TRAITS:
{perpetrator_details or 'Individual matching description provided to the investigation officer.'}

3. APPLICABLE LEGAL PROVISIONS & STATUTORY CITATIONS:
The conduct described directly violates the following provisions:
- Section 354D, BNS / IPC (Offence of Stalking / Continuous surveillance)
- Section 354, BNS / IPC (Assault or criminal force to woman with intent to outrage modesty)
- Section 509, BNS / IPC (Word, gesture or act intended to insult modesty of woman)

4. PRAYER / RELIEF SOUGHT:
In light of the immediate danger and ongoing pattern, it is respectfully prayed that:
a) A First Information Report (FIR) / General Diary entry be registered immediately.
b) CCTV footage of the identified corridor be requisitioned and preserved.
c) Appropriate preventive patrolling and protective measures be initiated.

Yours sincerely,
{complainant_name}
(Digitally compiled via Kavach Agentic Safety Platform)
"""
        return draft.strip()
