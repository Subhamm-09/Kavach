# KAVACH — Full-Stack Agentic AI Safety Platform

> *A unified, multi-agent AI platform for proactive risk prevention, trauma-informed emergency response, and privacy-preserving law enforcement intelligence.*

---

## 🛡️ Executive Summary

**Kavach** is an enterprise-grade agentic AI safety platform built for high-stakes urban safety scenarios in **Bhubaneswar, Odisha, India**. Unlike static prototypes or ungrounded chatbots, Kavach is an end-to-end full-stack application integrating:

- **11 Specialized AI Agents** coordinated by a central **LangGraph StateGraph** orchestrator.
- **Dual Vector & Relational Storage**: **ChromaDB** for perpetrator intelligence and statutory BNS legal RAG, alongside **SQLite / SQLAlchemy** for audit logging and case management.
- **Deterministic Math & Privacy Encoders**: Real Haversine spatial math, Dijkstra risk-weighted graph routing, regex PII scrubbing, and HMAC-SHA256 deterministic tokenization.
- **Strict Law Enforcement Privacy Invariant**: Authority endpoints **never expose raw citizen PII** (`victim_name`, raw phone, raw email), verified by automated test assertions.
- **Dual AI Engine**: Seamless integration with **Google Gemini (`gemini-2.5-flash`)** with an automatic **Deterministic Fallback Engine** for 100% offline hackathon reliability.

---

## 🏛️ The 3 Pillars & 11-Agent Ecosystem

```
+-----------------------------------------------------------------------------------+
|                         LANGGRAPH GUARDIAN ORCHESTRATOR                           |
+-----------------------------------------------------------------------------------+
          |                                 |                                 |
          v                                 v                                 v
+-----------------------+       +-----------------------+       +-----------------------+
|    1. PREVENT PILLAR  |       |   2. RESPOND PILLAR   |       |  3. PROSECUTE PILLAR  |
|                       |       |                       |       |                       |
| - Proximity Risk Agent|       | - Trauma Therapy Agent|       | - Culprit Matching    |
| - Safety Heatmap Agent|       | - Legal RAG Agent     |       | - Verification Agent  |
| - Safe-Route Agent    |       | - Evidence Compiler   |       | - Privacy-Guardian    |
| - Mode/Consent Agent  |       |                       |       | - Authority Hub       |
+-----------------------+       +-----------------------+       +-----------------------+
```

### 1. PREVENT (Environmental Risk Identification)
1. **Proximity Risk Agent**: Real-time evaluation of distance to unlit sectors, secluded alleys, and threat polygons.
2. **Safety Heatmap Agent**: Deterministic 0–100 spatial risk scoring based on historical incident density, lighting levels, and patrol frequencies.
3. **Safe-Route Agent**: Risk-weighted Dijkstra routing across the Bhubaneswar road network that actively bypasses danger zones with factual rationale.
4. **Mode-Selection / Consent Agent**: Intelligent recommendation engine prompting mode transitions (Manual $\to$ Live Tracking) with explicit user consent.

### 2. RESPOND (Trauma-Informed Care & Automated Redress)
5. **Trauma Therapy Agent**: De-escalating, trauma-informed text dialogue with automatic distress detection and seamless handoff to the Guardian Orchestrator.
6. **Legal RAG Agent**: Statutory legal assistant retrieving grounded provisions from the **Bharatiya Nyaya Sanhita (BNS, 2023)** and drafting formal Zero FIR complaints.
7. **Evidence-Compiler Agent**: Generates structured, tamper-evident digital dossiers aggregating incident logs, legal drafts, and suspect candidate matches.

### 3. PROSECUTE (Privacy-Preserving Law Enforcement Intelligence)
8. **Culprit-Matching Module**: Hybrid vector + trait similarity matching across ChromaDB offender profiles using scrubbed perpetrator descriptors.
9. **Verification Agent**: Multi-source corroboration engine enforcing **Path A** (Active Police Registry) and **Path B** ($N \ge 3$ Independent Corroboration Threshold) to eliminate false accusations.
10. **Privacy-Guardian Agent**: Cryptographic sanitization barrier guaranteeing complete isolation of victim PII before law enforcement serialization.
11. **Guardian Orchestrator**: Top-level LangGraph state manager routing ingress signals, coordinating handoffs, and recording audit telemetry.

---

## 🚀 Quickstart: Running Kavach Locally

### Prerequisites
- Python 3.11+
- Node.js 18.0+ (`npm`)

### 1. Start Backend Server
```bash
# In Terminal 1:
cd D:\Projects\Kavach\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```
- Backend API: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Start Frontend Server
```bash
# In Terminal 2:
cd D:\Projects\Kavach\frontend
npm.cmd run dev
```
- Frontend Web App: `http://localhost:3000`

---

## 🔑 Demo Accounts & Pre-Seeded Credentials

| Role | Username / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Law Enforcement Officer** | `inspector.patnaik@odishapolice.gov.in` | `KavachShield@2026` | Full Authority Hub (`ROLE_AUTHORITY`) |
| **Citizen User** | `priya.sharma@example.com` | `PriyaKavach@2026` | Citizen Safety & Personal Cases (`ROLE_USER`) |

*(Use the "Autofill Demo Credentials" button on the login screen for instant access).*

---

## 🧪 Automated Test Verification

Kavach includes an automated test suite verifying privacy invariants, routing algorithms, distress cue handoffs, and ChromaDB vector matching:

```bash
cd D:\Projects\Kavach
.\backend\venv\Scripts\Activate.ps1
pytest -v
```

### Test Suite Summary:
```
backend/tests/test_agents_and_workflows.py::test_proximity_autonomous_escalation PASSED
backend/tests/test_agents_and_workflows.py::test_therapy_danger_cue_distress_handoff PASSED
backend/tests/test_agents_and_workflows.py::test_culprit_vector_matching_and_verification PASSED
backend/tests/test_agents_and_workflows.py::test_safe_routing_factual_avoidance PASSED
backend/tests/test_privacy_invariant.py::test_authority_privacy_invariant_no_pii_leakage PASSED
backend/tests/test_privacy_invariant.py::test_authority_endpoint_blocks_unauthorized_users PASSED
backend/tests/test_privacy_invariant.py::test_authority_endpoint_blocks_unauthenticated_requests PASSED

============================== 7 passed in 1.45s ==============================
```

---

## 📚 Technical Documentation Index

Detailed architectural and developer guides are available in the [`docs/`](file:///D:/Projects/Kavach/docs) directory:

- [**System Architecture (`docs/ARCHITECTURE.md`)**](file:///D:/Projects/Kavach/docs/ARCHITECTURE.md): Complete architectural diagrams, data flows, and pillar breakdown.
- [**11-Agent Specification (`docs/AGENTS.md`)**](file:///D:/Projects/Kavach/docs/AGENTS.md): Detailed inputs, outputs, system prompts, and failure modes for all agents.
- [**Data Model & Storage (`docs/DATA_MODEL.md`)**](file:///D:/Projects/Kavach/docs/DATA_MODEL.md): Relational schema, ChromaDB collections, and serialization boundaries.
- [**REST & WebSocket API (`docs/API.md`)**](file:///D:/Projects/Kavach/docs/API.md): Comprehensive endpoint contracts, payloads, and auth scopes.
- [**Security & Threat Model (`docs/SECURITY.md`)**](file:///D:/Projects/Kavach/docs/SECURITY.md): Threat mitigation, bcrypt hashing, and JWT RBAC enforcement.
- [**Privacy Guardian Subsystem (`docs/PRIVACY.md`)**](file:///D:/Projects/Kavach/docs/PRIVACY.md): PII scrubbing, HMAC tokenization, and privacy invariant proofs.
- [**Vector DB & Statutory RAG (`docs/RAG.md`)**](file:///D:/Projects/Kavach/docs/RAG.md): ChromaDB chunking, hybrid offender matching, and BNS legal search.
- [**5-Minute Hackathon Demo Script (`docs/DEMO.md`)**](file:///D:/Projects/Kavach/docs/DEMO.md): Judge walkthrough with exact cues for Moments 1–5.
- [**Production Deployment (`docs/DEPLOYMENT.md`)**](file:///D:/Projects/Kavach/docs/DEPLOYMENT.md): Deployment topologies, environment variables, and build guide.
- [**Local Development (`docs/DEVELOPMENT.md`)**](file:///D:/Projects/Kavach/docs/DEVELOPMENT.md): Dev workflow, scripts, and testing instructions.
- [**Architectural Decision Records (`docs/ADR.md`)**](file:///D:/Projects/Kavach/docs/ADR.md): Rationale behind LangGraph, ChromaDB, SQLite, Dijkstra, and Leaflet.
