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
            danger_keywords = [
                "following me", "stalking", "stalker", "not safe", "scared", "someone is behind",
                "help me", "danger", "hurt", "im hurt", "i'm hurt", "bleeding", "injured", "pain",
                "trapped", "cornered", "attacking", "attacked", "hit me", "punched",
                "touched", "groped", "molested", "assault", "assaulted", "forced",
                "knife", "weapon", "emergency", "sos", "112", "108", "address"
            ]
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
        text_lower = (message_text or "").lower()
        imminent_danger_cues = [
            "following me", "stalking", "stalker", "someone is following", "he is following",
            "trailing me", "chasing", "cornered", "trapped",
            "danger", "help me", "hurt me", "hurt", "im hurt", "i'm hurt", "bleeding",
            "injured", "injury", "in pain", "hit me", "punched", "beaten", "attacked",
            "scared", "don't feel safe", "unlit alley", "not safe",
            "touched", "touched me", "touched inappropriately", "groped", "molested", "spanked", "spank",
            "assault", "assaulted", "forced me", "unwanted touch",
            "knife", "weapon", "gun", "threatened", "threaten", "kill me", "grabbed me", "grabbed",
            "emergency", "sos", "call police", "call ambulance", "call 112", "call 108",
            "knows my address", "outside my house", "outside my home", "at my door", "save me"
        ]
        emotional_distress_cues = [
            "anxious", "anxiety", "overwhelmed", "shaking", "panic", "panicking",
            "crying", "trauma", "afraid", "terrified", "frightened", "alone",
            "nervous", "uneasy", "distressed", "creepy", "uncomfortable"
        ]

        detected_cues = [c for c in imminent_danger_cues if c in text_lower]
        emo_cues = [c for c in emotional_distress_cues if c in text_lower]

        if detected_cues:
            return {
                "is_distressed": True,
                "distress_level": "IMMINENT_DANGER",
                "distress_score": 0.95,
                "detected_intent": "IMMINENT_DANGER",
                "trigger_cues": detected_cues,
                "guardian_handoff_required": True,
                "recommended_action": "ACTIVATE_GUARDIAN_SAFETY_INTERVENTION",
            }
        elif emo_cues:
            return {
                "is_distressed": True,
                "distress_level": "ELEVATED",
                "distress_score": 0.70,
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
        """Deterministic empathetic responses adapting to specific user statements."""
        text = (message_text or "").lower()

        if distress_level == "IMMINENT_DANGER":
            # Acute physical injury
            if any(k in text for k in ["bleeding", "hurt", "injured", "pain", "broken", "ambulance"]):
                return (
                    "Please focus on your immediate physical safety right now. "
                    "If you are injured or bleeding, call Emergency Medical Services (108) or Police (112) immediately. "
                    "Move to a safe, well-lit place where people or shopkeepers are nearby to assist you while help is on the way."
                )
            # Assault / inappropriate touch
            if any(k in text for k in ["touched", "groped", "molested", "assault", "forced"]):
                return (
                    "What happened is completely wrong and is a punishable offense under Bharatiya Nyaya Sanhita (BNS § 74/75). "
                    "Please get to a safe, populated, or well-lit space where you feel secure. "
                    "You can reach the Women Helpline (1091) or Emergency Police (112) right away for immediate support. "
                    "Whenever you feel ready, we can securely record the details or walk through your protective options."
                )
            # Severe stalking / address known
            if any(k in text for k in ["knows my address", "outside my house", "outside my home", "at my door"]):
                return (
                    "This is a serious escalation. Ensure all doors and windows are securely locked immediately. "
                    "Call Odisha Police (112) immediately so a patrol unit can be sent to your location. "
                    "If possible, call a trusted friend, family member, or neighbour to stay with you right now."
                )
            # Default imminent danger (outdoor pursuit / following)
            return (
                "Your physical safety is the absolute priority right now. "
                "If you are outdoors, immediately move toward an open shop, well-lit petrol pump, or main road where other people are present. "
                "Keep your phone active and avoid dark shortcuts. "
                "Tell me if you can keep walking safely, or if you need direct emergency dispatch (Odisha Police 112) right now."
            )

        if distress_level == "ELEVATED" or any(k in text for k in ["anxious", "scared", "worried", "panic", "shaking", "alone"]):
            return (
                "It makes complete sense that you're feeling shaken by this. "
                "You are in a secure space here, and we can take this one step at a time. "
                "Would it help more right now to talk through what just happened, look at safe route options, or explore your protective rights?"
            )

        # Workplace or manager harassment
        if any(k in text for k in ["manager", "boss", "colleague", "coworker", "office", "workplace"]):
            return (
                "Dealing with inappropriate conduct at work can feel deeply exhausting and isolating. "
                "You have the right to a harassment-free environment under the POSH Act and BNS provisions. "
                "We can keep a timestamped private log of these incidents, or discuss formal and informal options whenever you feel ready."
            )

        # Cyber harassment or stalking
        if any(k in text for k in ["photo", "message", "call", "online", "instagram", "whatsapp", "threat"]):
            return (
                "Digital harassment or unsolicited messaging is a serious violation of your boundaries. "
                "Be sure to preserve unedited screenshots showing timestamps and handles. "
                "Would you like me to explain how to lodge a cyber cell complaint, or draft a formal notice?"
            )

        # Questions like "what should I do?"
        if any(k in text for k in ["what should i do", "what can i do", "help me", "advice"]):
            return (
                "First, ensure you are in a safe, lit environment. "
                "From here, we can take a few concrete steps: document the incident details, check a secure walking route, or prepare a written record for authorities. "
                "Tell me a bit more about what occurred so we can pick the best path forward."
            )

        # General greetings
        if re.search(r"\b(hi|hello|hey)\b", text):
            return (
                "Hi, I'm Kavach. I'm here to support your safety whenever you feel uncomfortable or unsafe. "
                "Whether you need to check a route, talk through an incident, or understand your legal rights, tell me what's on your mind."
            )

        return (
            "I'm listening closely. You don't have to carry this by yourself. "
            "Can you tell me a little more about what happened and what feels most urgent right now?"
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

    async def analyze_emotion(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Deterministic emotional state classifier across 9 canonical emotions."""
        text = (message_text or "").lower()

        # Fear / Terror
        if any(k in text for k in ["terrified", "panic", "shaking", "someone is following", "threatened", "horror", "imminent danger"]):
            return {
                "emotion": "fear",
                "intensity": 9,
                "confidence": 0.95,
                "triggers": ["acute_threat", "physiological_panic"],
                "pacing_guidance": "Immediate safety grounding, short calming sentences, direct safety inquiry."
            }
        if any(k in text for k in ["scared", "afraid", "dark alley", "following me", "stalking"]):
            return {
                "emotion": "fear",
                "intensity": 8,
                "confidence": 0.90,
                "triggers": ["proximity_threat", "fear"],
                "pacing_guidance": "Concise supportive focus, prioritize safe location."
            }

        # Anxiety / Nervousness
        if any(k in text for k in ["anxious", "nervous", "uneasy", "stressed", "worried", "unsettled"]):
            return {
                "emotion": "anxiety",
                "intensity": 6,
                "confidence": 0.88,
                "triggers": ["anticipatory_stress"],
                "pacing_guidance": "Reassuring, validate feelings without alarm."
            }

        # Hopelessness / Despair
        if any(k in text for k in ["hopeless", "give up", "no point", "no one cares", "trapped", "cannot take this"]):
            return {
                "emotion": "hopelessness",
                "intensity": 8,
                "confidence": 0.85,
                "triggers": ["isolation", "despair"],
                "pacing_guidance": "Deep empathy, reaffirm presence and dignity."
            }

        # Anger / Rage
        if any(k in text for k in ["furious", "angry", "rage", "pissed", "outraged", "violated"]):
            return {
                "emotion": "anger",
                "intensity": 7,
                "confidence": 0.86,
                "triggers": ["violation", "injustice"],
                "pacing_guidance": "Validate legitimate frustration, remain calm and steady."
            }

        # Frustration / Exhaustion
        if any(k in text for k in ["frustrated", "tired of", "again and again", "annoyed", "exhausted", "bothering me"]):
            return {
                "emotion": "frustration",
                "intensity": 6,
                "confidence": 0.84,
                "triggers": ["recurring_nuisance"],
                "pacing_guidance": "Acknowledge the exhausting pattern, offer actionable support."
            }

        # Sadness
        if any(k in text for k in ["sad", "crying", "depressed", "heartbroken", "hurt"]):
            return {
                "emotion": "sadness",
                "intensity": 6,
                "confidence": 0.82,
                "triggers": ["emotional_pain"],
                "pacing_guidance": "Warm, gentle supportive presence."
            }

        # Relief
        if any(k in text for k in ["safe now", "reached home", "fine now", "relieved", "thank goodness"]):
            return {
                "emotion": "relief",
                "intensity": 4,
                "confidence": 0.85,
                "triggers": ["safe_arrival"],
                "pacing_guidance": "Affirm positive outcome, invite rest."
            }

        # Confusion
        if any(k in text for k in ["confused", "don't know", "what should i do", "lost", "uncertain"]):
            return {
                "emotion": "confusion",
                "intensity": 5,
                "confidence": 0.80,
                "triggers": ["dilemma"],
                "pacing_guidance": "Clear, simple step-by-step guidance."
            }

        # Neutral default
        return {
            "emotion": "neutral",
            "intensity": 3,
            "confidence": 0.75,
            "triggers": [],
            "pacing_guidance": "Conversational, informative, open."
        }

    async def classify_chat_intent(
        self,
        message_text: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Classify conversational intent for graph routing."""
        text = (message_text or "").lower()

        # Route request / Navigation / Going home
        if any(k in text for k in [
            "route", "direction", "navigation", "how to reach", "way home", "safest path",
            "go home", "going home", "get home", "heading home", "head home", "reach home",
            "take me home", "want to leave", "get out of here", "safe exit", "i want to go home",
            "take a cab", "find a route", "walk home"
        ]):
            return {
                "intent": "route_request",
                "confidence": 0.95,
                "reasoning": "User requested safe route, navigation, or directions to go home"
            }

        # Safety request
        if any(k in text for k in ["is it safe", "danger zone", "hotspot", "street light", "lighting", "safe here", "patrolling"]):
            return {
                "intent": "safety_request",
                "confidence": 0.90,
                "reasoning": "User inquired about area safety or lighting"
            }

        # Incident reporting
        if any(k in text for k in ["file fir", "lodge complaint", "report officially", "give formal complaint", "file police report"]):
            return {
                "intent": "incident_reporting",
                "confidence": 0.93,
                "reasoning": "User desires to initiate formal reporting"
            }

        # Legal info
        if any(k in text for k in ["legal", "law", "bns", "rights", "ipc", "section", "statute", "court", "lawyer", "police station"]):
            return {
                "intent": "legal_information",
                "confidence": 0.91,
                "reasoning": "User inquired about statutory provisions or legal rights"
            }

        # Emotional support / Distress
        if any(k in text for k in ["terrified", "scared", "afraid", "panic", "anxious", "sad", "hopeless", "depressed", "nervous", "upset", "crying", "following me", "stalking", "help me"]):
            return {
                "intent": "emotional_support",
                "confidence": 0.94,
                "reasoning": "User expressed emotional distress, fear, or trauma"
            }

        # General chat (using regex word boundaries to avoid matching substrings like 'this' for 'hi')
        if re.search(r"\b(hi|hello|hey|who are you|what can you do|what is kavach)\b", text):
            return {
                "intent": "general_chat",
                "confidence": 0.88,
                "reasoning": "Standard introductory greetings or generic query"
            }

        # Default to emotional support
        return {
            "intent": "emotional_support",
            "confidence": 0.86,
            "reasoning": "Default conversational or trauma-informed emotional check-in"
        }

    async def synthesize_final_response(
        self,
        user_message: str,
        therapy_res: Optional[Dict[str, Any]] = None,
        legal_res: Optional[Dict[str, Any]] = None,
        memories: Optional[List[str]] = None,
        emotion_res: Optional[Dict[str, Any]] = None,
        route_res: Optional[Dict[str, Any]] = None,
        proximity_res: Optional[Dict[str, Any]] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """Deterministic synthesis of humanized response respecting all safety and tone rules."""
        raw_text = (user_message or "").lower()
        emotion_res = emotion_res or {}
        emotion = emotion_res.get("emotion", "neutral")
        intensity = emotion_res.get("intensity", 3)

        # 0. Acute Physical Injury & Medical Emergency
        if any(k in raw_text for k in ["bleeding", "im hurt", "i'm hurt", "hurt", "injured", "injury", "broken", "ambulance", "in pain"]):
            return (
                "Please focus on your immediate physical safety right now. "
                "If you are bleeding or injured, call Emergency Medical Services (108) or Police (112) immediately. "
                "Move to a safe, visible, and well-lit area or approach nearby people or an open shop for assistance while emergency help is on the way."
            )

        # 1. Sexual Harassment / Inappropriate Touch / Assault
        if any(k in raw_text for k in ["touched inappropriately", "touched me", "touched", "groped", "molested", "spanked", "spank", "grabbed me", "grabbed", "assaulted", "assault", "forced me", "unwanted touch"]):
            return (
                "What happened is completely wrong and is a punishable offense under Bharatiya Nyaya Sanhita (BNS § 74/75). "
                "First, get to a safe, populated, or well-lit space where you feel secure. "
                "You can connect directly with the Women Helpline (1091) or Emergency Police (112) for immediate protection. "
                "Whenever you feel ready, we can also quietly log the incident details to preserve evidence for legal action."
            )

        # 2. Stalker Knows Address / Immediate Threat at Residence
        if any(k in raw_text for k in ["knows my address", "knows where i live", "outside my house", "outside my home", "at my door"]):
            return (
                "This is a serious escalation. Ensure all doors and windows are securely locked immediately, and do not confront anyone outside. "
                "Contact Odisha Police (112) immediately so a patrol unit can be dispatched to your location. "
                "If possible, inform a trusted neighbour, family member, or friend to be with you right now."
            )

        # 3. Workplace / Coworker / Boss harassment
        if any(k in raw_text for k in ["coworker", "colleague", "manager", "boss", "office", "workplace"]):
            mem_note = " I remember this has happened before with this person. " if memories else " "
            if any(k in raw_text for k in ["what should i do", "how to handle", "advice", "what can i do"]):
                return (
                    f"Dealing with a colleague or manager behaving this way is unacceptable and stressful.{mem_note}"
                    "Here are three practical steps: 1) Save every text, email, and timestamp without replying. "
                    "2) Avoid being isolated in meeting rooms or corridors with them. "
                    "3) You have the legal right to file an Internal Complaints Committee (ICC) complaint under the POSH Act or BNS § 354A. "
                    "Would you like me to help you format a confidential factual log of what happened?"
                )
            return (
                f"That sounds very stressful and uncomfortable.{mem_note}"
                "You have the right to feel completely secure at work. "
                "If they are around you right now, try to stay in open areas near other colleagues. "
                "Whenever you feel ready, we can draft a formal complaint or look into confidential protective steps."
            )

        # 2. Active Outdoor Stalking / Imminent Threat
        if any(k in raw_text for k in ["following me", "behind me", "dark street", "cornered", "alley", "chasing"]):
            if "what should i do" in raw_text:
                return (
                    "Do not go into dark shortcuts or isolated spaces. "
                    "Head immediately into the nearest open shop, cafe, petrol pump, or populated main road. "
                    "Keep your phone ready. Are you near a spot with people around right now, or should I alert emergency contacts?"
                )
            return (
                "Your physical safety is the absolute priority right now. "
                "Step toward a well-lit area or an open shop where people are around. "
                "Are you in a spot where you can keep walking, or do you need me to connect you with emergency dispatch (112) immediately?"
            )

        # 3. Direct Advice Questions ("What should I do?")
        if any(k in raw_text for k in ["what should i do", "what can i do", "help me", "advice", "suggestions"]):
            return (
                "First, make sure you're in a secure, well-lit place where you feel grounded. "
                "Next, we have three clear options: 1) We can log the facts and dates to preserve tamper-evident evidence. "
                "2) We can look up your legal protections under the Bharatiya Nyaya Sanhita (BNS). "
                "3) Or we can check safe routes to get you to your destination. Which of those would give you the most peace of mind right now?"
            )

        # 4. Cyber Harassment / Messages / Photos
        if any(k in raw_text for k in ["photo", "photos", "picture", "screenshot", "message", "whatsapp", "instagram", "calling"]):
            return (
                "Unsolicited messages or threats over digital channels are punishable offenses under BNS § 354D and Section 66E of the IT Act. "
                "Do not delete the messages—preserve clear screenshots showing the sender's details and timestamps. "
                "Would you like me to help you draft a formal cyber complaint to the police station?"
            )

        # 5. High Intensity Panic / Fear (>= 8)
        if emotion == "fear" and intensity >= 8:
            return (
                "That sounds deeply unsettling. Try to take a slow, steady breath with me. "
                "Your safety comes first. If you are outside, stay on the main street where there are lights and traffic. "
                "Tell me what is happening around you right now so I can guide you."
            )

        # 6. High Intensity Anxiety (>= 7)
        if emotion == "anxiety" and intensity >= 7:
            mem_ref = " I know this has been weighing on you recently. " if memories else " "
            return (
                f"That sounds very heavy, and it makes complete sense that you're feeling on edge.{mem_ref}"
                "You're in a secure space here. Let's take things one step at a time. "
                "Tell me what happened most recently—I'm right here with you."
            )

        # 7. Legal Guidance synthesis
        if legal_res and legal_res.get("answer"):
            sections = legal_res.get("applicable_sections", [])
            clean_sections = [s.strip() for s in sections if len(s.strip()) < 35 and any(k in s.lower() for k in ["section", "bns", "act", "posh"])]
            sec_text = f" Under provisions such as {', '.join(clean_sections[:2])}," if clean_sections else " Under the Bharatiya Nyaya Sanhita (BNS) and Indian legal protections,"
            return (
                f"You have clear legal rights in this situation.{sec_text} Indian law protects you against repeated harassment, stalking, and intimidation. "
                "You can choose to file a formal complaint or preserve evidence quietly until you're ready. "
                "Would you like me to help you prepare a written draft for the local station, or walk through your options first?"
            )

        # 8. Safe Route synthesis
        if route_res and route_res.get("recommended_route"):
            rec = route_res.get("recommended_route", {})
            name = rec.get("name", "recommended route")
            dist = rec.get("total_distance_km", "")
            dist_str = f" ({dist} km)" if dist else ""
            return (
                f"I checked the area telemetry and mapped out a well-lit path along {name}{dist_str}. "
                "This route stays on active, monitored corridors and avoids dimly lit stretches. "
                "Would you like step-by-step guidance as you walk?"
            )

        # 9. Proximity Risk synthesis
        if proximity_res and proximity_res.get("calculated_risk_score", 0) >= 60:
            zone = proximity_res.get("nearest_zone_name", "this area")
            return (
                f"Just a quiet heads-up: lighting around {zone} is sparse right now. "
                "Keep your phone handy and stick to the main road if possible. "
                "I am keeping an eye on your check-in—let me know the moment you feel uncomfortable."
            )

        # 10. Locality-specific safety inquiries (Bhubaneswar context)
        bhubaneswar_areas = {
            "infocity": "Infocity has active tech corridors, but the forest periphery and unlit side cuts can feel isolated after dark. Stick to the main DLF / Infocity Avenue.",
            "patia": "Patia has good commercial activity, but smaller internal colonies have patchy lighting. Stay along the main KIIT road where shops remain open.",
            "kiit": "Around KIIT Square and Campus road, security sweeps are regular. If you need assistance, moving toward campus gates or main street cafes is recommended.",
            "khandagiri": "Khandagiri junction is busy, but surrounding foothill paths get dark quickly. Use the well-lit NH highway lanes.",
            "ghatikia": "Ghatikia and Kalinga Nagar stretches are wider and quieter at night. Prefer primary arterial roads over inner sector lanes.",
            "saheed nagar": "Saheed Nagar is generally well-populated with frequent PCR patrol rounds. Keep to the central commercial lanes.",
            "jayadev vihar": "Jayadev Vihar is a major junction with steady traffic and active CCTV coverage around the flyover.",
            "master canteen": "Master Canteen has high pedestrian transit and 24/7 railway police presence nearby.",
        }
        for area, advice in bhubaneswar_areas.items():
            if area in raw_text:
                return (
                    f"Regarding {area.title()}: {advice} "
                    "Would you like me to map out the safest well-lit route through this area or check real-time radar risk?"
                )

        # 11. Greetings & Introductory queries (Varied)
        if re.search(r"\b(hi|hello|hey|greetings|namaste)\b", raw_text):
            greetings = [
                "Hi, I'm Kavach. I'm here to support your personal safety whenever you feel uncomfortable or uneasy. Tell me what's on your mind—whether you want to check an area, find a safe route, or talk through something that happened.",
                "Hello. I'm your confidential Kavach companion. Whether you need immediate safety directions, want to understand your legal rights under BNS, or simply need a safe space to talk, I'm listening.",
                "Hey there. You're in a secure, private space. How are you feeling right now, and how can I best support you today?"
            ]
            pick = sum(ord(c) for c in raw_text) % len(greetings)
            return greetings[pick]

        # 12. Emotion-tailored empathetic responses for conversational check-ins
        if emotion == "confusion":
            return (
                "It is completely understandable to feel unsure about what step to take next. "
                "We don't have to rush. Would it help more to check area safety, talk through what occurred, or explore your options quietly?"
            )
        elif emotion in ["sadness", "hopelessness"]:
            return (
                "I hear how heavy and overwhelming this feels right now. Please know that your feelings are valid, and you don't have to navigate this by yourself. "
                "Whenever you feel ready, I'm here to help you take whatever small step brings you the most comfort and safety."
            )
        elif emotion in ["anger", "frustration"]:
            return (
                "Your frustration is completely justified—having your boundaries crossed or dealing with continuous stress is exhausting. "
                "We can channel this whenever you're ready: whether documenting tamper-evident facts, checking legal protections, or planning precautions."
            )
        elif emotion == "relief":
            return (
                "I'm so glad to hear you're in a safer, more grounded space now. Take a moment to rest and breathe. "
                "I'll remain right here if you need anything else or want to log any notes later."
            )

        # 13. Transit / Heading Home / Leaving Unsafe Area
        if any(k in raw_text for k in ["go home", "going home", "get home", "head home", "way home", "take me home", "leave here", "want to go home", "home", "leave"]):
            route_name = route_res.get("recommended_route", {}).get("name", "the main well-lit corridor") if route_res else "the main illuminated commercial avenue"
            return (
                f"Let's get you home safely right now. Stick strictly to {route_name} where there are active streetlights, CCTV, and people around, and avoid all dark cuts or unlit alleys. "
                "Keep your phone active in your hand. "
                "Would you like me to guide you step-by-step along the safest path home, or should I help you connect with Police (112) or a trusted contact?"
            )

        # 14. Multi-turn context awareness (check prior conversation turns)
        past_user_texts = " ".join([h.get("text", "").lower() for h in (conversation_history or []) if h.get("sender") == "USER"])
        has_prior_distress = any(k in past_user_texts for k in ["following", "stalker", "touched", "spanked", "hurt", "bike", "scared", "harass", "threat", "cornered", "attacked"])

        # Prior distress follow-up (e.g. user asking "what now", "what should i do", "what next", or expressing fear)
        if has_prior_distress:
            if any(k in raw_text for k in ["what should i do", "what to do", "now what", "what next", "how to leave", "help me", "help"]):
                return (
                    "Given what you've just been through, your safety is the absolute top priority. "
                    "First, make sure you are in a safe, lit place with people or shopkeepers around. "
                    "From here: 1) Call Emergency Police (112) or Women Helpline (1091) if you feel in immediate danger. "
                    "2) I can map the safest illuminated route home for you. 3) We can preserve a secure timestamped log of the assault for legal action under BNS § 74. Which of these can I help you with first?"
                )

        # 15. Acknowledgments / short responses
        if re.search(r"^\s*(ok|okay|yes|yeah|sure|alright|fine|understood|thanks|thank you)\b", raw_text):
            return (
                "I'm right here with you. Take a slow, steady breath. "
                "Your safety is what matters most. Tell me if you are in a secure location right now, or if you'd like me to map out a safe route home or connect you to emergency support."
            )

        # 16. Therapy base response fallback
        if therapy_res and therapy_res.get("text"):
            raw_therapy = therapy_res.get("text", "")
            if "supporting your safety" not in raw_therapy and "processing your message" not in raw_therapy:
                raw_therapy = re.sub(r"^(Thank you for sharing|I understand your concern|I am here to help)[,.]?\s*", "", raw_therapy, flags=re.IGNORECASE)
                if raw_therapy.strip() and len(raw_therapy.strip()) > 15:
                    return raw_therapy.strip()

        # 17. Multi-turn fallback (NEVER ask 'tell me what happened' if dialogue already exists)
        if conversation_history and len(conversation_history) >= 2:
            return (
                "I am right here with you every step of the way. Given what occurred earlier, please stay in a well-lit, populated area and do not walk alone through dark stretches. "
                "Would you like me to guide you along a safe route, connect you directly with emergency support (112 / 1091), or assist with incident logging?"
            )

        # General initial supportive fallback
        return (
            "I'm listening closely. Could you tell me a little more about what's going on or what happened? "
            "Whether you need practical safety guidance, legal options, or simply someone to talk to, I'm right here with you."
        )

    async def chatbot_extract_memory(
        self,
        user_message: str,
        final_response: str
    ) -> Dict[str, Any]:
        """Determine if statement should be saved to long-term memory."""
        text = user_message.lower()
        if any(k in text for k in ["manager", "boss", "stalking", "follow", "repeatedly", "again", "every day", "threatened"]):
            return {
                "should_store": True,
                "memory": user_message.strip()
            }
        return {
            "should_store": False,
            "memory": ""
        }

