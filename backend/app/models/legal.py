"""Legal document metadata entity for ChromaDB tracking."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text
from backend.app.database import Base


class LegalDocumentMetadata(Base):
    __tablename__ = "legal_documents_metadata"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    doc_id = Column(String(100), unique=True, index=True, nullable=False)
    document_name = Column(String(255), nullable=False)
    document_version = Column(String(50), default="1.0")
    file_type = Column(String(50), nullable=False)  # pdf, txt, docx
    source = Column(String(255), default="Supplied Legal Corpus")
    section_count = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)
    ingested_at = Column(DateTime, default=datetime.utcnow)
