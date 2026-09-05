"""Privacy-Guardian Agent node.
Executes the privacy transformation boundary, stripping victim PII,
generating tokenized subject handles, and producing sanitized authority case data.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.privacy.guardian import PrivacyGuardianService
from backend.app.models.case import Case


class PrivacyGuardianAgentNode:
    """Privacy-Guardian Agent executing in the LangGraph graph."""

    @classmethod
    def execute(cls, state: KavachGraphState, db: Session) -> KavachGraphState:
        """Sanitize raw narratives and generate authority-safe projection."""
        raw_text = state.get("raw_input", "")
        transform_result = PrivacyGuardianService.transform_raw_incident(raw_text)

        state["previous_agent"] = state.get("current_agent")
        state["current_agent"] = "PrivacyGuardianAgent"
        state["privacy_result"] = {
            "is_privacy_certified": True,
            "victim_name_status": "[REDACTED]",
            "victim_phone_status": "[TOKENIZED]",
            "victim_email_status": "[REDACTED]",
            "sanitized_narrative": transform_result["sanitized_narrative"],
            "redacted_entity_types": transform_result["redacted_entity_types"],
        }

        event = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "agent_name": "PrivacyGuardianAgent",
            "signal_type": "PRIVACY_TRANSFORMATION",
            "action": "Applied PII Redaction and Deterministic Tokenization",
            "tool_invoked": "PrivacyProjectionEngine",
            "input_summary": f"Raw text with {len(transform_result['redacted_entity_types'])} potential PII types",
            "output_summary": "Generated sanitized authority projection: Victim identity [REDACTED/TOKENIZED].",
            "severity": "INFO",
            "handoff_to": "EvidenceCompilerAgent"
        }

        if "activity_timeline" not in state or state["activity_timeline"] is None:
            state["activity_timeline"] = []
        state["activity_timeline"].append(event)

        return state
