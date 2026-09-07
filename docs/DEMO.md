# KAVACH — 5-Minute Hackathon Demo Script & Judge Walkthrough

## 1. Demo Preparation & Prerequisites

1. Start the Backend:
   ```bash
   cd D:\Projects\Kavach\backend
   .\venv\Scripts\Activate.ps1
   uvicorn app.main:app --reload --port 8000
   ```
2. Start the Frontend:
   ```bash
   cd D:\Projects\Kavach\frontend
   npm.cmd run dev
   ```
3. Open Browser at `http://localhost:3000`.

---

## 2. Walkthrough: The 5 Demo Moments

### Moment 1: PREVENT — Proactive Geospatial Risk & Safe Routing
- **URL**: `http://localhost:3000/safety`
- **Narration**: *"Kavach does not wait for a crime to happen. In the PREVENT pillar, Kavach uses continuous spatial intelligence across Bhubaneswar."*
- **Actions**:
  1. Click **"Toggle Safety Heatmap"** — show the color-coded 0–100 risk overlay across Patia, KIIT, and Vani Vihar.
  2. Click **"Start GPS Simulation (Patia Corridor)"** — watch the user marker move in real time.
  3. As the pin enters the *Infocity Sector 3* zone, point out the **Proximity Risk Alert** and automatic mode recommendation.
  4. Click **"Optimize Safe Route"** — show how the Dijkstra routing engine avoids high-risk unlit segments, displaying the factual explanation: *"Rerouted via Infocity Main Boulevard (+180m, -42% risk)."*

---

### Moment 2: RESPOND — Trauma-Informed Support & Crisis Escalation
- **URL**: `http://localhost:3000/chat`
- **Narration**: *"When a citizen feels unsafe, communicating with an AI must be calming and trauma-informed—not cold or robotic."*
- **Actions**:
  1. Type or paste: *"A man on a black bike is following me down the dark lane near KIIT and won't leave."*
  2. Hit Send.
  3. Point out the grounding, trauma-informed reply.
  4. Highlight the **Red Autonomous Escalation Banner**: The Therapy Agent detected high distress and executed a handoff to the Guardian Orchestrator without abandoning the conversation.

---

### Moment 3: RESPOND — Statutory Legal RAG & Complaint Drafting
- **URL**: `http://localhost:3000/legal`
- **Narration**: *"Kavach grounds all legal advice in statutory criminal law using ChromaDB RAG on the new Bharatiya Nyaya Sanhita (BNS)."*
- **Actions**:
  1. Click the preset: *"Repeated stalking and menacing behavior on commute."*
  2. Show the retrieved statutory citations: **BNS Section 78 (Stalking)** and **BNS Section 79 (Insult to modesty)** with confidence scores.
  3. Click **"Generate Formal Police Complaint"** — display the structured Zero FIR draft formatted with legal provisions, factual timeline, and jurisdiction details.

---

### Moment 4: PROSECUTE — Privacy-Preserving Incident Reporting
- **URL**: `http://localhost:3000/report`
- **Narration**: *"Victims often fear reporting because of privacy leaks. Kavach introduces the Privacy Guardian."*
- **Actions**:
  1. Fill the form with name (*"Priya Sharma"*), phone (*"9876543210"*), and description: *"Tall male with a noticeable scar above left eyebrow, dark bomber jacket, riding black Pulsar near Infocity."*
  2. Point out the **Live Privacy Guardian Preview** on the right side:
     - Name replaced with `[CITIZEN_REDACTED]`.
     - Phone converted to HMAC token `TOK_USR_8f7b2c91a0`.
  3. Click **"Submit Incident & Compile Dossier"**.

---

### Moment 5: PROSECUTE — Law Enforcement Hub & Verification
- **URL**: `http://localhost:3000/authority/login` -> `http://localhost:3000/authority`
- **Narration**: *"Now let's switch to the Law Enforcement view. Notice how the Privacy Invariant is strictly upheld."*
- **Actions**:
  1. Click **"Autofill Inspector Credentials"** and log in.
  2. On the **Authority Dashboard**:
     - **Area A**: High-level Bhubaneswar threat metrics and incident distribution.
     - **Area B**: High-Priority Case List. Highlight that the case displays `TOK_USR_8f7b2c91a0` and **NO victim name or phone number exists anywhere in the payload**.
     - **Area C (Perpetrator Intelligence)**: Click the case to view the vector-matched suspect: `OFF-BBSR-701 (Shadow Rider)` matched at 88% confidence based on the eyebrow scar and black Pulsar.
     - Click **"Verify Suspect"**: Show the **Verification Agent** enforcing Path A (Police Registry Match) and Path B ($N \ge 3$ Corroboration).
     - **Area D (Privacy Guardian Output)**: Show the live cryptographically verified badge confirming zero PII leakage.
