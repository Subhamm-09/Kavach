# KAVACH — Vector DB & Statutory RAG Architecture

## 1. Overview & Vector DB Selection

Kavach utilizes **ChromaDB** as an embedded, persistent vector store located in `data/chroma/`. ChromaDB was selected over hosted vector services (Pinecone, Weaviate) to ensure zero external network latency, complete data sovereignty, and reliable offline execution during hackathon evaluations.

```
+-----------------------------------------------------------------------------------+
|                              CHROMADB PERSISTENT STORE                            |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+ |
|  | kavach_offender_profiles            |   | kavach_legal_documents             | |
|  | - Embeddings of Perpetrator MO      |   | - Embeddings of Bharatiya Nyaya     | |
|  | - Physical traits, vehicle details  |   |   Sanhita (BNS, 2023) Sections     | |
|  | - Offender code & alias metadata    |   | - BNSS, DV Act, IT Act statutes    | |
|  +-------------------------------------+   +------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 2. Collection Specifications

### 2.1. `kavach_offender_profiles`
Stores semantic representations of known recurring perpetrator profiles across the Bhubaneswar jurisdiction.

- **Document Text**:
  ```
  Alias: Shadow Rider | Stature: Tall (approx 6ft), lean athletic build | Distinguishing Marks: Noticeable jagged scar above left eyebrow | Attire & Vehicle: Dark hooded bomber jacket, rides matte black Bajaj Pulsar 220 with modified loud exhaust | Modus Operandi: Targets lone commuters walking on unlit stretch between Infocity Square and KIIT back road after 9:30 PM.
  ```
- **Metadata**:
  - `offender_code`: `OFF-BBSR-701`
  - `alias`: `Shadow Rider`
  - `known_areas`: `Infocity, KIIT, Patia`
  - `active_status`: `"true"`

#### Hybrid Matching Algorithm:
The `OffenderStore` executes a two-stage hybrid retrieval:
1. **Vector Cosine Similarity**: Query vector against offender profile documents.
2. **Deterministic Trait Overlap Bonus**: Adds weighted score bonuses for exact matches on key traits (e.g., `scar`, `pulsar`, `dark jacket`, `infocity`).
3. **Formula**: $\text{Final Score} = \min(1.0, \text{VectorScore} \times 0.70 + \text{TraitOverlapBonus} \times 0.30)$.

---

### 2.2. `kavach_legal_documents`
Stores statutory legal provisions chunked with metadata for authoritative legal grounding.

- **Corpus Coverage**:
  - **Bharatiya Nyaya Sanhita (BNS), 2023**:
    - Section 78: Stalking (Physical & Cyber)
    - Section 79: Word, gesture or act intended to insult modesty of a woman
    - Section 74: Assault or criminal force to woman with intent to outrage her modesty
    - Section 351: Criminal intimidation
    - Section 126: Wrongful restraint
  - **Information Technology Act, 2000**: Section 66E (Privacy violation), Section 67 (Publishing obscene material).
  - **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023**: Section 173 (Zero FIR provisions).
  - **Protection of Women from Domestic Violence Act, 2005**: Section 12 & Protection Orders.

- **Chunking Strategy**:
  - Chunk size: ~400–600 tokens per section.
  - Chunk boundaries aligned with statutory section titles to maintain complete legal context.

---

## 3. Ingestion & Re-Indexing

Legal documents and offender profiles are ingested via CLI scripts and verified idempotently on startup:

```bash
# Ingest statutory corpus
python backend/scripts/ingest_legal_docs.py

# Re-seed demo offender vector embeddings
python backend/scripts/seed_demo_data.py
```

### Prevention of Hallucination:
The Legal RAG agent is strictly instructed to cite only provisions indexed in `kavach_legal_documents`. If a user query falls outside statutory criminal law, the agent provides standard constitutional redress guidance without fabricating section numbers.
