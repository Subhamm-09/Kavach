# KAVACH — REST API & WebSocket Specification

## 1. Overview & Base URL

The Kavach Backend is served by FastAPI with interactive Swagger UI available at `/docs` and ReDoc at `/redoc`.

- **Base URL**: `http://localhost:8000`
- **Prefix**: `/api`
- **Interactive OpenAPI Spec**: `http://localhost:8000/docs`

---

## 2. Authentication & Authorization

All secure endpoints utilize Bearer JWT authentication. Pass the access token in the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Roles (`role` claim):
- `ROLE_USER`: Standard citizen account. Access to reporting, personal cases, therapy, safe routing.
- `ROLE_AUTHORITY`: Law enforcement / judicial authority account. Required to access `/api/authority/*`.

---

## 3. Endpoints by Domain

### 3.1. Authentication (`/api/auth`)

#### `POST /api/auth/token`
Authenticate and obtain a Bearer JWT.
- **Request Body (Form URL-Encoded)**: `username`, `password`
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "ROLE_AUTHORITY",
  "username": "inspector.patnaik@odishapolice.gov.in"
}
```

#### `POST /api/auth/register`
Register a new citizen user.
- **Request Body (JSON)**: `username`, `email`, `password`
- **Response `201 Created`**: User profile object.

#### `GET /api/auth/me`
Retrieve currently authenticated profile.

---

### 3.2. Environmental Risk & Safe Routing (`/api/gps` & `/api/heatmap`)

#### `POST /api/gps/ping`
Ingest continuous citizen GPS telemetry and evaluate proximity risk.
- **Request Body**:
```json
{
  "session_id": "sess_bbsr_demo_01",
  "latitude": 20.3548,
  "longitude": 85.8192,
  "current_mode": "MANUAL",
  "speed": 1.2
}
```
- **Response `200 OK`**: Evaluates proximity to threat coordinates, unlit sectors, and returns suggested actions or autonomous escalation warnings.

#### `POST /api/gps/simulate`
Simulate multi-step movement across Bhubaneswar corridors.
- **Request Body**: `corridor` (`patia_tech`, `kiit_loop`, `vani_vihar`), `speed_multiplier`

#### `POST /api/gps/safe-route`
Compute factual risk-weighted route across Bhubaneswar road graph using Dijkstra's algorithm.
- **Request Body**:
```json
{
  "origin": "KIIT Campus 3",
  "destination": "Patia Station",
  "mode": "WALKING"
}
```
- **Response `200 OK`**: Returns coordinate polyline, risk score differential vs shortest path, and natural language rationale.

#### `GET /api/heatmap/grid`
Retrieve precomputed 0–100 spatial risk cells across Bhubaneswar.

#### `GET /api/heatmap/zones`
Retrieve active threat zones and polygon boundaries.

---

### 3.3. Trauma-Informed Support (`/api/therapy`)

#### `POST /api/therapy/message`
Send message to trauma-informed Therapy Agent.
- **Request Body**:
```json
{
  "session_id": "sess_chat_9912",
  "message": "I was walking near Patia and someone on a black bike began following me closely."
}
```
- **Response `200 OK`**:
```json
{
  "reply": "I hear you, and I am so glad you reached out. You are safe right now...",
  "distress_detected": true,
  "handoff_triggered": true,
  "guardian_action": "ESCALATE_MONITORING"
}
```

---

### 3.4. Statutory Legal RAG (`/api/legal`)

#### `POST /api/legal/query`
Search ChromaDB legal corpus for Bharatiya Nyaya Sanhita (BNS) statutes.
- **Request Body**: `{"query": "Someone is repeatedly following me and calling my phone"}`
- **Response `200 OK`**: Relevant statutory citations (e.g. BNS Section 78 - Stalking, Section 79 - Insulting modesty) with confidence scores.

#### `POST /api/legal/draft-complaint`
Generate formal legal complaint document with factual timelines and statutory provisions.

---

### 3.5. Culprit Intelligence & Verification (`/api/matching`)

#### `POST /api/matching/search`
Search offender vector database with scrubbed perpetrator traits.
- **Request Body**:
```json
{
  "case_id": "KAVACH-CASE-2026-0812",
  "description": "Tall male, scar above left eyebrow, wearing dark jacket, riding black Pulsar with modified exhaust near Infocity."
}
```
- **Response `200 OK`**: Ranked list of offender candidate profiles with match scores and matching traits.

#### `POST /api/matching/verify/{candidate_id}`
Execute multi-source verification algorithm (Path A: Registry / Path B: Corroboration).

---

### 3.6. Authority Law Enforcement Hub (`/api/authority`)

> [!IMPORTANT]
> All endpoints under `/api/authority` strictly require `ROLE_AUTHORITY` Bearer authentication and **never return raw citizen PII**.

#### `GET /api/authority/dashboard`
Retrieve high-level intelligence metrics, active threat zones, and high-priority case list.

#### `GET /api/authority/cases`
Retrieve list of sanitized cases for law enforcement review.
- **Response `200 OK`**:
```json
[
  {
    "case_id": "KAVACH-CASE-2026-0812",
    "victim_token": "TOK_USR_8f7b2c91a0",
    "title": "Repeated Stalking near Patia Infocity",
    "category": "Stalking & Harassment",
    "status": "ACTIVE",
    "priority": "HIGH",
    "created_at": "2026-09-05T00:15:00Z"
  }
]
```

#### `GET /api/authority/cases/{case_id}`
Retrieve sanitized case details, including BNS legal draft, offender candidates, and verification status.

---

### 3.7. Central Agent Orchestration & Audit (`/api/agents` & `/api/audit`)

#### `POST /api/agents/orchestrate`
Direct invocation endpoint to pass signals into the central LangGraph `StateGraph`.

#### `GET /api/audit/logs`
Retrieve immutable audit trail showing agent reasoning steps and tool execution provenance.

---

### 3.8. Real-Time Telemetry WebSocket (`/ws/telemetry/{session_id}`)

Bi-directional WebSocket streaming live coordinate pings and receiving real-time proximity alerts.
