# KAVACH — 3-Minute Hackathon Demo Script (2 Presenters)

> **Format**: High-Tempo 3-Minute Live Demo (180 Seconds)  
> **Audience**: Hackathon Final Round Judges & Technical Evaluators  
> **Roles**:
> - **Presenter 1 (Narrative Lead)**: Problem statement, human impact, trauma & legal story.
> - **Presenter 2 (Tech Navigator)**: Screen navigation, clicks, algorithms, and privacy proofs.

---

## ⏱️ 3-Minute Timing At-A-Glance

| Timestamp | Phase | Screen / UI Action |
| :--- | :--- | :--- |
| **0:00 – 0:30** (30s) | **The Hook & Vision** | Landing Page (`localhost:3000`) $\to$ Autofill Login |
| **0:30 – 1:15** (45s) | **PREVENT** (Heatmap & Dijkstra) | `/safety` Map $\to$ Toggle Heatmap $\to$ Optimize Safe Route |
| **1:15 – 2:00** (45s) | **RESPOND** (LangGraph Handoff & BNS RAG) | `/chat` Distress Handoff $\to$ `/legal` Zero FIR Draft |
| **2:00 – 2:35** (35s) | **PROSECUTE** (Privacy & Offender RAG) | `/report` PII Scrub $\to$ `/authority` ChromaDB Match |
| **2:35 – 3:00** (25s) | **Architecture & Closing** | `/architecture` LangGraph & Test Suite $\to$ Wrap |

---

## 🚀 The 180-Second Live Script

---

### [0:00 – 0:30] The Hook: Beyond Broken Panic Buttons

**Screen**: `http://localhost:3000`

**Presenter 1 (Narrative Lead):**
> *"Judges, traditional safety apps rely on a broken model: the **reactive panic button**. By the time someone hits an SOS, danger has already struck, the victim is in acute trauma, and police get zero context.*  
> *Meet **Kavach** — an 11-agent AI platform that closes the loop across three pillars: **Prevent, Respond, and Prosecute**."*

**Presenter 2 (Tech Navigator):**
> *(Clicks **"Autofill Demo Credentials"** $\rightarrow$ Logs in as `priya.sharma@example.com`)*  
> *"Powered by a central **LangGraph StateGraph**, ChromaDB vector intelligence, and Google Gemini. Let’s see it live in Bhubaneswar."*

---

### [0:30 – 1:15] Pillar 1: PREVENT — Geospatial Risk & Safe Dijkstra Routing

**Screen**: Navigate to `http://localhost:3000/safety`

**Presenter 2 (Tech Navigator):**
> *(Toggles **Safety Heatmap** on the map)*  
> *"Our **Safety Heatmap Agent** calculates deterministic 0–100 risk scores across Bhubaneswar, combining lighting ratings, incident density, and police patrol frequencies.*  
> *Watch what happens when a citizen requests directions home through an unmonitored sector."*  
> *(Clicks **"Optimize Safe Route"**)*

**Presenter 1 (Narrative Lead):**
> *"Google Maps or Apple Maps give you the shortest route — sending you through dark, unlit back alleys.  
> Kavach’s **Safe-Route Agent** uses risk-weighted Dijkstra routing to detour the user along illuminated, police-patrolled boulevards, explicitly explaining:  
> **'Rerouted via Main Avenue (+180m, -42% danger).'**"*

---

### [1:15 – 2:00] Pillar 2: RESPOND — LangGraph State Handoff & Statutory Legal RAG

**Screen**: Navigate to `http://localhost:3000/chat`

**Presenter 1 (Narrative Lead):**
> *"During an incident, victims shouldn't face cold, robotic forms. Our **Trauma Therapy Agent** provides immediate psychological first-aid."*

**Presenter 2 (Tech Navigator):**
> *(Clicks preset: 'A man on a black bike is following me near KIIT')*  
> *"Notice the response: empathetic and de-escalating. Simultaneously, look at the **Red Autonomous Escalation Banner**: the agent's intent detector flagged high distress.*  
> *Behind the scenes, **LangGraph's StateGraph** immediately fires a state transition: routing the distress signal from the `therapy` node $\rightarrow$ `legal` node $\rightarrow$ `evidence_compiler` node across shared state (`KavachGraphState`)."*

**Screen**: Quick switch to `http://localhost:3000/legal`

**Presenter 2 (Tech Navigator):**
> *(Clicks **'Generate Formal Police Complaint'**)*  
> *"Because of LangGraph's shared state, the user doesn't re-type anything. The **Legal RAG Agent** retrieves exact statutory sections from our ChromaDB corpus (**BNS §78 Stalking**, **BNS §79 Modesty**) and instantly compiles a court-ready **Zero FIR draft**."*

---

### [2:00 – 2:35] Pillar 3: PROSECUTE — Zero-PII Invariant & Culprit Intelligence

**Screen**: Quick switch to `http://localhost:3000/report` $\rightarrow$ Submit $\rightarrow$ Switch to `http://localhost:3000/authority` (Police View)

**Presenter 1 (Narrative Lead):**
> *"Victims avoid reporting due to fear of retaliation. Kavach solves this with a **mathematically verified Privacy Invariant**."*

**Presenter 2 (Tech Navigator):**
> *(Points to Police Dossier on `/authority`)*  
> *"Notice what the Police Inspector sees: **Zero Citizen PII**. Name is scrubbed to `[CITIZEN_REDACTED]`, phone is an HMAC-SHA256 token `TOK_USR_8f7b...`.*  
> *Yet police get rich intelligence: our **Culprit Matching Agent** vector-matched the suspect description against our ChromaDB offender registry: `OFF-BBSR-701` at **88% confidence** based on vehicle and facial scar."*

**Presenter 1 (Narrative Lead):**
> *"And our **Verification Agent** enforces strict corroboration rules to completely prevent false accusations."*

---

### [2:35 – 3:00] Architecture, Reliability & Closing

**Screen**: Navigate to `/architecture` or terminal

**Presenter 2 (Tech Navigator):**
> *"Under the hood: **11 agents** coordinated by **LangGraph**. Built on **Google Gemini 2.5 Flash** with an automatic **Deterministic Fallback Engine** ensuring 100% offline uptime even if Wi-Fi dies right now."*

**Presenter 1 (Narrative Lead):**
> *"Kavach transforms urban safety from a broken, reactive panic button into a complete, intelligent shield:  
> **Prevent before**, **Respond during**, and **Prosecute after**.  
> Thank you, and we're ready for your questions!"*

---

## ⚡ 3-Minute Survival Rules
1. **No manual typing**: Click only the pre-seeded buttons (*Autofill Credentials*, *Preset Prompt*, *Optimize Safe Route*).
2. **Tabs Ready**: Keep Tab 1 on Citizen `/safety` and Tab 2 on Authority `/authority` to eliminate login transition delay.
3. **Strict Cutoffs**: If you reach 2:00 and aren't at the Authority Hub, skip straight to the Police screen.
