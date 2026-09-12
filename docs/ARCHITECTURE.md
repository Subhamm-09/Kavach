# KAVACH — System Architecture

## 1. Executive Summary

**Kavach** is an agentic AI safety and intelligence platform engineered for the **IIT Bhubaneswar Agentic AI Hackathon**. Built around three operational pillars—**PREVENT**, **RESPOND**, and **PROSECUTE**—Kavach unifies proactive geospatial risk awareness, trauma-informed emergency response, and privacy-preserving law enforcement intelligence into a single full-stack architecture.

---

## 2. High-Level Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                      FRONTEND (Next.js 14 / React)                                 |
|  [ Prevent Map (Leaflet) ]   [ Respond Chat (Text) ]   [ Report PII Scrubber ]   [ Authority Hub ]|
+-------------------------------------------------+-------------------------------------------------+
                                                  | JSON REST / WebSockets
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                       BACKEND (FastAPI / ASGI)                                     |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                            LANGGRAPH CENTRAL STATEGRAPH ORCHESTRATOR                        |  |
|  |                                                                                             |  |
|  |                                  +-----------------------+                                  |  |
|  |                                  | Guardian Orchestrator |                                  |  |
|  |                                  +-----------+-----------+                                  |  |
|  |                                              |                                              |  |
|  |                 +----------------------------+----------------------------+                 |  |
|  |                 |                            |                            |                 |  |
|  |                 v                            v                            v                 |  |
|  |      [ PREVENT PILLAR ]             [ RESPOND PILLAR ]          [ PROSECUTE PILLAR ]        |  |
|  |   - Proximity Risk Agent         - Trauma Therapy Agent       - Culprit Matching Module     |  |
|  |   - Safety Heatmap Agent         - Legal RAG Agent            - Verification Agent          |  |
|  |   - Safe-Route Agent             - Evidence Compiler          - Privacy-Guardian Agent      |  |
|  |   - Mode/Consent Agent                                                                      |  |
|  +----------------------------------------------+----------------------------------------------+  |
|                                                 |                                                 |
|        +----------------------------------------+----------------------------------------+        |
|        |                                                                                 |        |
|        v                                                                                 v        |
|  +---------------------------+                                             +--------------------+ |
|  | DETERMINISTIC ENGINES     |                                             | VECTOR DB (Chroma) | |
|  | - Haversine Proximity     |                                             | - Offender Profiles| |
|  | - Spatial Heatmap Grid    |                                             | - Legal Documents  | |
|  | - Dijkstra Safe Routing   |                                             +--------------------+ |
|  | - PII Redaction/Tokenize  |                                                                    |
|  +-------------+-------------+                                                                    |
|                |                                                                                  |
|                v                                                                                  |
|  +---------------------------+                                                                    |
|  | RELATIONAL DB (SQLite)    |                                                                    |
|  | - Users & RBAC Roles      |                                                                    |
|  | - Incidents & Cases       |                                                                    |
|  | - Fictional Registry      |                                                                    |
|  | - Audit & Telemetry       |                                                                    |
|  +---------------------------+                                                                    |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. The 3 Architectural Pillars

### 3.1. PREVENT (Environmental Risk Identification)
- **Simulated GPS Telemetry**: Emits live coordinate updates along pre-mapped Bhubaneswar corridors (e.g., Patia Tech Corridor, Vani Vihar Outer Loop).
- **Proximity Risk Agent**: Continuously evaluates distance to unlit sectors and known threat coordinates.
- **Safety Heatmap Agent**: Computes a deterministic 0–100 risk score for geospatial grid cells based on incident density, recency weighting, lighting ratings, and patrol frequency.
- **Safe-Route Agent**: Calculates risk-weighted paths across a local road graph, generating factual explanations for route choices.
- **Mode-Selection / Consent Agent**: Recommends switching from Manual to Live tracking mode upon detecting repeated check-ins in elevated-risk zones, recording explicit user consent.

### 3.2. RESPOND (Trauma-Informed Care & Automated Redress)
- **Therapy Agent**: Provides confidential, trauma-informed text dialogue. Detects acute distress cues and automatically executes a handoff to the Guardian Orchestrator.
- **Legal Agent**: RAG-powered statutory assistant querying ChromaDB (`kavach_legal_documents`) to provide grounded Bharatiya Nyaya Sanhita (BNS) citations and draft formal police complaints.
- **Evidence-Compiler Agent**: Compiles chronological timelines, chat records, GPS history, and legal drafts into exportable digital dossiers.

### 3.3. PROSECUTE (Privacy-Preserving Law Enforcement Intelligence)
- **Culprit-Matching Module**: Runs vector similarity searches across ChromaDB (`kavach_offender_profiles`) using victim-scrubbed perpetrator descriptors.
- **Verification Agent**: Enforces Path A (Registry matching) and Path B (Independent Corroboration threshold, default $N=3$) to prevent false accusations.
- **Privacy-Guardian Agent**: Strictly isolates citizen PII before serialization to the Authority Dashboard (`[REDACTED]` names, `[TOKENIZED]` phone numbers, anonymized case IDs).

---

## 4. LangGraph Orchestration & Shared State

All 11 components communicate through a strongly typed LangGraph state object (`KavachGraphState`). The graph executes state transitions with full observability:

1. **Ingress Signal** received by FastAPI endpoint.
2. **Guardian Orchestrator** classifies intent and severity, logging an audit record.
3. **Downstream Agents** execute domain-specific deterministic tools and vector queries.
4. **State Checkpointing** records intermediate outputs into the audit trail.
5. **Final Structured Response** is serialized and returned to the client/WebSocket stream.

---

## 5. Technology Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.14 / 3.12, FastAPI, LangGraph, SQLAlchemy, SQLite, Pydantic v2 |
| **AI / LLM** | Google Gemini API (`gemini-2.5-flash`) via `google-genai` with deterministic fallback |
| **Vector Database** | ChromaDB (Local persistent storage with separate offender and legal collections) |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Mapping** | Leaflet / React-Leaflet with OpenStreetMap tiles (Bhubaneswar, Odisha coordinate space) |
| **Security & RBAC** | Passlib (Bcrypt), Python-Jose (JWT), OAuth2 scopes (`ROLE_USER`, `ROLE_AUTHORITY`) |
