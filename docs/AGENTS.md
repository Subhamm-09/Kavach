# KAVACH — Complete 11-Agent Specification

Every component in the Kavach ecosystem is designed with strict boundaries separating **LLM Reasoning** from **Deterministic Backend Calculations**.

---

## Agent Index

1. [Guardian Orchestrator Agent](#1-guardian-orchestrator-agent)
2. [Proximity Risk Agent](#2-proximity-risk-agent)
3. [Safety Heatmap Agent](#3-safety-heatmap-agent)
4. [Safe-Route Agent](#4-safe-route-agent)
5. [Mode-Selection / Consent Agent](#5-mode-selection--consent-agent)
6. [Culprit-Matching Module](#6-culprit-matching-module)
7. [Verification Agent](#7-verification-agent)
8. [Privacy-Guardian Agent](#8-privacy-guardian-agent)
9. [Legal Agent](#9-legal-agent)
10. [Therapy Agent](#10-therapy-agent)
11. [Evidence-Compiler Agent](#11-evidence-compiler-agent)

---

### 1. Guardian Orchestrator Agent
- **Purpose**: Central routing, intent/severity classification, and autonomous escalation controller.
- **Trigger**: Any incoming signal (GPS telemetry, therapy cue, legal request, incident report).
- **Inputs**: `signal_type`, `raw_input`, `location`, `context`.
- **Reasoning Responsibility**: Classify intent, assess threat severity, and determine downstream agent execution order.
- **Deterministic vs LLM**: LLM interprets unstructured text and decides multi-agent handoff; deterministic rules enforce minimum emergency escalation thresholds.
- **Tools**: `IntentSeverityClassifier`, `AuditLogger`.
- **Outputs**: `intent`, `severity`, `selected_agents`, `escalation_level`.
- **Downstream Handoff**: Routes to Proximity, Therapy, Culprit Matching, or Legal.

---

### 2. Proximity Risk Agent
- **Purpose**: Evaluates spatial distance between citizen telemetry and known threat coordinates/unlit sectors.
- **Trigger**: Live or simulated GPS telemetry ping.
- **Inputs**: `latitude`, `longitude`, `speed_kmh`, `session_id`.
- **Reasoning Responsibility**: Evaluate compound danger metrics (dwell time, time of day, proximity to critical offenders).
- **Deterministic vs LLM**: Distance calculated via mathematical **Haversine formula**; agent reasons about whether to escalate to Guardian.
- **Tools**: `HaversineDistanceCalculator`, `HeatmapRadarQuery`.
- **Outputs**: `calculated_risk_score`, `nearest_zone_name`, `escalation_triggered`.
- **Downstream Handoff**: Hands off to `GuardianOrchestrator` if distance $\le 150\text{ m}$ to high-risk zone.

---

### 3. Safety Heatmap Agent
- **Purpose**: Computes continuous 0–100 risk surface for Bhubaneswar grid cells.
- **Trigger**: Spatial query or grid refresh.
- **Inputs**: Center coordinates, environmental ratings, incident history, offender registry.
- **Reasoning Responsibility**: Interpret aggregate neighborhood safety levels and determine risk tier.
- **Deterministic vs LLM**: Fully deterministic mathematical formula:
  $$\text{Risk} = \text{EnvPenalty} + \sum (\text{IncidentSeverity} \times \text{DistanceDecay} \times \text{RecencyFactor}) + \text{OffenderContribution}$$
- **Tools**: `SpatialGridCalculator`, `HistoricalIncidentAggregator`.
- **Outputs**: `risk_score`, `risk_level` (LOW, MODERATE, ELEVATED, HIGH, CRITICAL).

---

### 4. Safe-Route Agent
- **Purpose**: Selects safety-optimized navigation corridors rather than solely distance-minimal paths.
- **Trigger**: Navigation request with origin and destination.
- **Inputs**: `origin_lat`, `origin_lng`, `dest_lat`, `dest_lng`.
- **Reasoning Responsibility**: Balance extra walking time against safety advantages and produce factual explanations.
- **Deterministic vs LLM**: Pathfinding uses **Dijkstra / A\*** with safety-weighted edge penalties; LLM/Deterministic summarizer constructs factual explanations.
- **Tools**: `DijkstraSafetyGraphRouter`.
- **Outputs**: `recommended_route`, `alternative_routes`, `factual_explanation`.

---

### 5. Mode-Selection / Consent Agent
- **Purpose**: Manages user tracking modes (`MANUAL` vs `LIVE`) and ensures explicit consent.
- **Trigger**: Multiple manual check-ins in elevated risk sectors.
- **Inputs**: `current_mode`, `checkin_count`, `current_risk_score`.
- **Reasoning Responsibility**: Formulate non-coercive suggestions to activate live tracking.
- **Deterministic vs LLM**: Deterministic threshold checks for suggestion trigger; records immutable consent event in database.
- **Outputs**: `suggestion_active`, `suggestion_message`, `consent_state`.

---

### 6. Culprit-Matching Module
- **Purpose**: Vector similarity candidate generation against offender profiles.
- **Trigger**: Perpetrator physical or behavioral description submission.
- **Inputs**: `perpetrator_description`, `location_zone`.
- **Reasoning Responsibility**: Extract salient physical traits and behavioral modus operandi.
- **Deterministic vs LLM**: Cosine vector distance over ChromaDB `kavach_offender_profiles` collection combined with keyword trait overlap.
- **Outputs**: `candidates` (List of candidate IDs, similarity scores, matched traits).
- **Downstream Handoff**: Transmits candidates strictly to `VerificationAgent` (never directly to users).

---

### 7. Verification Agent
- **Purpose**: Enforces defensibility boundary between candidate generation and verified records.
- **Trigger**: Candidate match received from Culprit Matching Module.
- **Inputs**: `offender_id`, `case_id`, `corroboration_reports_count`.
- **Reasoning Responsibility**: Assess corroboration credibility and assign verification state (`VERIFIED`, `REJECTED`, `NEEDS_HUMAN_REVIEW`).
- **Deterministic vs LLM**: Evaluates configured threshold ($N=3$ corroborating reports across spatial cluster).
- **Outputs**: `outcome`, `confidence_score`, `decision_reason`.

---

### 8. Privacy-Guardian Agent
- **Purpose**: Hard security and privacy boundary transforming raw citizen data into sanitized authority projections.
- **Trigger**: Incident reporting or authority case serialization.
- **Inputs**: `raw_narrative`, `user_id`, `phone`, `email`.
- **Reasoning Responsibility**: Extract behavioral and environmental patterns while identifying direct and indirect PII.
- **Deterministic vs LLM**: Regex & HMAC-SHA256 deterministic tokenization for phone/email; PII scrubbing for names.
- **Outputs**: Sanitized narrative, `[REDACTED]` name, `[TOKENIZED]` phone, anonymized case ID.

---

### 9. Legal Agent
- **Purpose**: RAG statutory research and automated formal police complaint drafting.
- **Trigger**: Citizen legal query or complaint request.
- **Inputs**: `query`, `incident_narrative`, `police_station`.
- **Reasoning Responsibility**: Map incident facts to relevant Bharatiya Nyaya Sanhita (BNS) provisions and draft formal complaint letters.
- **Deterministic vs LLM**: Vector search over ChromaDB `kavach_legal_documents`; LLM synthesizes citations into formal statutory complaint format.
- **Tools**: `ChromaLegalRAGStore`, `ComplaintDrafter`.
- **Outputs**: `answer`, `citations`, `applicable_sections`, `draft_body_formatted`.

---

### 10. Therapy Agent
- **Purpose**: Trauma-informed text-only conversational support and danger detection.
- **Trigger**: Citizen message in therapy chat.
- **Inputs**: `message_text`, `conversation_history`.
- **Reasoning Responsibility**: Detect distress/danger cues without providing clinical diagnoses; provide grounding support.
- **Deterministic vs LLM**: LLM generates supportive dialogue; safety classifier monitors for danger keywords (`following`, `stalking`, `scared`).
- **Outputs**: `therapy_response`, `distress_analysis`, `guardian_handoff`.
- **Downstream Handoff**: Directly hands off to `GuardianOrchestrator` upon detecting danger cues.

---

### 11. Evidence-Compiler Agent
- **Purpose**: Chronological milestone compilation and digital evidence dossier generation.
- **Trigger**: Case escalation, resolution, or export request.
- **Inputs**: Case ID, audit events, telemetry pings, chat messages, verification results.
- **Reasoning Responsibility**: Assemble coherent case narratives for cross-agency defensibility.
- **Deterministic vs LLM**: Query aggregation and structured HTML/JSON compilation from SQLite database.
- **Outputs**: `EvidenceDossier` (HTML export, chronological timeline, legal checklist).
