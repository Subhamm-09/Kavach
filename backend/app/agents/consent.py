"""Mode-Selection / Consent Agent.
Manages user tracking modes (MANUAL vs LIVE).
Detects repeated manual check-ins in elevated risk zones, suggests switching
to LIVE tracking mode, and records explicit user consent.
Never silently switches modes without recording consent.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.graph.state import KavachGraphState
from backend.app.models.consent import ConsentEvent


class ModeSelectionConsentAgent:
    """Mode-Selection / Consent Agent ensuring transparent user control."""

    @classmethod
    def evaluate_mode_transition(
        cls,
        db: Session,
        session_id: str,
        current_mode: str,
        manual_checkin_count: int,
        current_risk_score: float,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Inspect tracking mode and suggest live tracking if repeated check-ins occur in high risk zones."""
        should_suggest_live = (
            current_mode.upper() == "MANUAL"
            and manual_checkin_count >= 2
            and current_risk_score >= 45.0
        )

        suggestion_message = None
        if should_suggest_live:
            suggestion_message = (
                "You have performed multiple manual safety check-ins in an elevated risk area. "
                "Kavach suggests switching to 'Live Autonomous Guard' mode for real-time proximity monitoring. "
                "Would you like to activate Live Tracking?"
            )

        return {
            "current_mode": current_mode,
            "manual_checkin_count": manual_checkin_count,
            "current_risk_score": current_risk_score,
            "suggestion_active": should_suggest_live,
            "suggestion_message": suggestion_message,
            "consent_required": True,
        }

    @classmethod
    def record_consent_switch(
        cls,
        db: Session,
        session_id: str,
        new_mode: str,
        trigger_reason: str,
        user_id: Optional[str] = None
    ) -> ConsentEvent:
        """Record explicit user consent for mode transition."""
        prev_mode = "MANUAL" if new_mode.upper() == "LIVE" else "LIVE"
        consent = ConsentEvent(
            user_id=user_id,
            session_id=session_id,
            previous_mode=prev_mode,
            new_mode=new_mode.upper(),
            trigger_reason=trigger_reason,
            user_confirmed=True,
            consent_timestamp=datetime.utcnow(),
        )
        db.add(consent)
        db.commit()
        db.refresh(consent)
        return consent
