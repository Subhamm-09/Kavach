"""Kavach 11 Agent & Component Registry."""

from backend.app.agents.guardian import GuardianOrchestratorAgent
from backend.app.agents.proximity_risk import ProximityRiskAgentNode
from backend.app.agents.safety_heatmap import SafetyHeatmapAgentNode
from backend.app.agents.safe_route import SafeRouteAgentNode
from backend.app.agents.consent import ModeSelectionConsentAgent
from backend.app.agents.culprit_matching import CulpritMatchingModule
from backend.app.agents.verification import VerificationAgent
from backend.app.agents.privacy_guardian import PrivacyGuardianAgentNode
from backend.app.agents.legal import LegalAgentNode
from backend.app.agents.therapy import TherapyAgentNode
from backend.app.agents.evidence_compiler import EvidenceCompilerAgent

__all__ = [
    "GuardianOrchestratorAgent",
    "ProximityRiskAgentNode",
    "SafetyHeatmapAgentNode",
    "SafeRouteAgentNode",
    "ModeSelectionConsentAgent",
    "CulpritMatchingModule",
    "VerificationAgent",
    "PrivacyGuardianAgentNode",
    "LegalAgentNode",
    "TherapyAgentNode",
    "EvidenceCompilerAgent",
]
