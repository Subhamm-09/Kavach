# KAVACH — Architectural Decision Records (ADR)

This document records the foundational architectural decisions, evaluation trade-offs, and technical rationale underlying the Kavach platform design.

---

## ADR-001: LangGraph StateGraph vs CrewAI / AutoGen Multi-Agent Swarms

### Context:
Kavach coordinates 11 distinct agent roles across 3 pillars with strict dependencies (e.g. distress cue detection triggering immediate Guardian handoff).

### Decision:
Adopt **LangGraph** (`langgraph`) with a centralized, strongly typed `StateGraph` and `KavachGraphState`.

### Rationale:
- **Deterministic State Control**: LangGraph provides explicit state channels, conditional branching, and checkpointing. Unconstrained agent swarms (like AutoGen or CrewAI) suffer from non-deterministic looping, conversational drift, and unpredictable token consumption.
- **Observability**: Every state mutation is traceable, enabling live visualization on the frontend `AgentReasoningTimeline` and structured logging to the audit database.

---

## ADR-002: ChromaDB Embedded Vector Store vs Cloud Vector DBs

### Context:
Kavach requires semantic search over perpetrator profiles and Bharatiya Nyaya Sanhita (BNS) legal documents.

### Decision:
Adopt **ChromaDB** with persistent disk storage under `data/chroma/`.

### Rationale:
- **Zero External Latency & Network Independence**: Embedded execution eliminates network round-trips to cloud endpoints (e.g. Pinecone, Weaviate), guaranteeing sub-10ms query execution during live demonstrations.
- **Data Sovereignty**: Offender intelligence and citizen crime reports remain entirely local and encrypted on disk.

---

## ADR-003: Deterministic Geospatial Math & Dijkstra Graph vs LLM Waypoint Generation

### Context:
The Safe-Route Agent must compute pedestrian paths that actively avoid high-risk zones.

### Decision:
Implement deterministic **Haversine distance** and risk-weighted **Dijkstra shortest path** algorithms over a structured Bhubaneswar road graph, using the LLM exclusively to generate natural language explanations of the computed route.

### Rationale:
- **Zero Spatial Hallucination**: LLMs notoriously hallucinate coordinate geometries and non-existent street paths. In emergency safety contexts, path planning must be mathematically verified and factual.

---

## ADR-004: Deterministic AI Fallback Engine vs Pure Cloud LLM Dependency

### Context:
Hackathon live demos often fail due to cloud API rate limits, expired API keys, or poor venue Wi-Fi connectivity.

### Decision:
Engineer a dual-provider abstraction (`GeminiProvider` + `DeterministicFallbackProvider`).

### Rationale:
- **100% Demo Reliability**: If `GEMINI_API_KEY` is missing or the external API returns a 429/500 error, Kavach seamlessly executes rule-based trauma responses, BNS citation lookups, and regex parsing with zero downtime.

---

## ADR-005: Leaflet + OpenStreetMap vs Google Maps Platform

### Context:
The frontend requires interactive Bhubaneswar maps displaying heatmaps, simulated GPS telemetry, and routes.

### Decision:
Adopt **Leaflet** (`react-leaflet`) with OpenStreetMap tiles and custom dark-theme CSS inversion.

### Rationale:
- **No Token Dependency**: Eliminates billing setups, API keys, and rate limits.
- **Custom Tile Styling**: High-contrast dark cybersecurity aesthetics are easily achieved via CSS canvas filters.
