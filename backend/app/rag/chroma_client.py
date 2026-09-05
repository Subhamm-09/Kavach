"""ChromaDB Client & Collection Management.
Maintains two strictly separate vector collections:
1. 'kavach_offender_profiles' (Perpetrator descriptions & MOs)
2. 'kavach_legal_documents' (Statutory acts, guidelines, and legal corpus)
"""

import os
import chromadb
from chromadb.config import Settings as ChromaSettings
from backend.app.config import settings

# Global Chroma client reference
_chroma_client = None


def get_chroma_client():
    """Retrieve or initialize the persistent local ChromaDB client."""
    global _chroma_client
    if _chroma_client is None:
        os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
    return _chroma_client


def get_offender_collection():
    """Retrieve or create the collection for offender profile vector embeddings."""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="kavach_offender_profiles",
        metadata={"description": "Fictional offender MOs, aliases, physical traits, and registered crime patterns", "hnsw:space": "cosine"}
    )


def get_legal_collection():
    """Retrieve or create the collection for legal document RAG embeddings."""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="kavach_legal_documents",
        metadata={"description": "Legal statutory sections, BNS/IPC provisions, victim protection rights, and court guidelines", "hnsw:space": "cosine"}
    )
