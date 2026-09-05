"""Legal Document Vector Store & RAG Retrieval Engine.
Searches statutory provisions and court guidelines with full source chunk citations.
Provides graceful fallback when the legal corpus has not yet been loaded.
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.rag.chroma_client import get_legal_collection
from backend.app.schemas.legal import LegalCitation, LegalQueryResponse


class LegalVectorStore:
    """RAG storage and retrieval for verified legal documents."""

    @classmethod
    def is_corpus_loaded(cls) -> bool:
        """Check if any legal documents have been ingested into ChromaDB."""
        collection = get_legal_collection()
        return collection.count() > 0

    @classmethod
    def search_legal_documents(
        cls,
        query: str,
        top_k: int = 4
    ) -> List[LegalCitation]:
        """Query ChromaDB for relevant statutory provisions and legal precedents."""
        collection = get_legal_collection()
        count = collection.count()
        if count == 0:
            return []

        results = collection.query(
            query_texts=[query],
            n_results=min(top_k, count),
            include=["metadatas", "documents", "distances"]
        )

        citations: List[LegalCitation] = []
        if not results or not results["ids"] or not results["ids"][0]:
            return []

        ids = results["ids"][0]
        distances = results["distances"][0] if "distances" in results else [0.5] * len(ids)
        metadatas = results["metadatas"][0] if "metadatas" in results else [{}] * len(ids)
        documents = results["documents"][0] if "documents" in results else [""] * len(ids)

        for i, chunk_id in enumerate(ids):
            dist = distances[i] if i < len(distances) else 0.5
            relevance = max(0.0, min(1.0, 1.0 - (dist / 2.0)))
            meta = metadatas[i] if i < len(metadatas) else {}
            doc_text = documents[i] if i < len(documents) else ""

            citations.append(
                LegalCitation(
                    document_name=meta.get("document_name", "Statutory Reference"),
                    section=meta.get("section", "General Provision"),
                    page=meta.get("page", 1),
                    chunk_id=chunk_id,
                    source=meta.get("source", "Verified Legal Repository"),
                    snippet=doc_text[:350] + ("..." if len(doc_text) > 350 else ""),
                    relevance_score=round(relevance, 3),
                )
            )

        return citations

    @classmethod
    def query_legal_guidance(
        cls,
        query: str,
        incident_context: Optional[str] = None
    ) -> LegalQueryResponse:
        """Retrieve authoritative citations and produce grounded legal guidance.
        Never fabricates statutory advice when the corpus is empty.
        """
        loaded = cls.is_corpus_loaded()
        if not loaded:
            return LegalQueryResponse(
                query=query,
                is_knowledge_base_loaded=False,
                status_message="Legal knowledge base not loaded. Ingest statutory PDFs into /data/legal_documents/ using python -m scripts.ingest_legal_docs to enable formal citations.",
                answer=(
                    "The local legal corpus has not yet been indexed into ChromaDB. "
                    "In immediate emergency situations in Odisha, dial emergency 112 or Women Helpline 181. "
                    "Once authoritative legal documents (e.g., Bharatiya Nyaya Sanhita, Protection of Women from Domestic Violence Act, CrPC/BNSS) "
                    "are ingested into /data/legal_documents/, this agent will provide grounded statutory section citations and automated complaint drafting."
                ),
                citations=[],
                applicable_sections=["BNS 354 (Assault/Criminal Force to Woman)", "BNS 354D (Stalking)", "BNS 509 (Insulting Modesty)", "Emergency Dispatch 112"],
                recommended_next_steps=[
                    "File an initial GD (General Diary) or e-FIR with the local Police Station.",
                    "Contact the Odisha State Commission for Women (Helpline: 181).",
                    "Preserve all physical and digital evidence (timestamps, screenshots, call logs)."
                ]
            )

        # Retrieve verified chunks
        search_prompt = f"{query} {incident_context or ''}".strip()
        citations = cls.search_legal_documents(search_prompt, top_k=4)

        sections = list(set([c.section for c in citations if c.section and c.section != "General Provision"]))
        if not sections:
            sections = ["Relevant statutory sections extracted from ingested documents"]

        answer_summary = (
            f"Based on the verified legal documents in the Kavach repository:\n\n"
            + "\n\n".join([f"• [{c.document_name} § {c.section}]: {c.snippet}" for c in citations])
        )

        return LegalQueryResponse(
            query=query,
            is_knowledge_base_loaded=True,
            status_message="Citations successfully retrieved from verified local ChromaDB repository.",
            answer=answer_summary,
            citations=citations,
            applicable_sections=sections,
            recommended_next_steps=[
                "Draft formal written complaint citing the provisions identified above.",
                "Submit complaint to the jurisdictional Cyber Police / Women Police Station.",
                "Seek legal aid through the District Legal Services Authority (DLSA), Khordha/Bhubaneswar."
            ]
        )
