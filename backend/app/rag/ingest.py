"""Pluggable Legal Document Ingestion Pipeline.
Reads PDF, TXT, and Markdown files from /data/legal_documents/, chunks them,
extracts statutory section headers and metadata, and indexes into ChromaDB.
"""

import os
import glob
import uuid
from typing import List, Dict, Any
from pathlib import Path
from pypdf import PdfReader
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.rag.chroma_client import get_legal_collection
from backend.app.models.legal import LegalDocumentMetadata


def split_text_into_chunks(text: str, chunk_size: int = 600, overlap: int = 100) -> List[str]:
    """Split long legal text into overlapping character chunks preserving sentence boundaries."""
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if end < len(text):
            last_period = max(chunk.rfind(". "), chunk.rfind("\n"))
            if last_period > 200:
                end = start + last_period + 1
                chunk = text[start:end]
        chunks.append(chunk.strip())
        start = end - overlap
        if start >= len(text) or chunk_size <= overlap:
            break
    return [c for c in chunks if len(c) > 50]


def extract_text_from_file(file_path: str) -> List[Dict[str, Any]]:
    """Extract text pages from PDF, TXT, or MD files."""
    ext = os.path.splitext(file_path)[1].lower()
    pages = []

    if ext == ".pdf":
        try:
            reader = PdfReader(file_path)
            for page_idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                if text.strip():
                    pages.append({"page_number": page_idx + 1, "text": text})
        except Exception as e:
            print(f"[INGEST ERROR] Failed to read PDF {file_path}: {e}")

    elif ext in [".txt", ".md"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if content.strip():
                    pages.append({"page_number": 1, "text": content})
        except Exception as e:
            print(f"[INGEST ERROR] Failed to read text file {file_path}: {e}")

    return pages


def ingest_legal_directory(docs_dir: str = None, db: Session = None) -> Dict[str, Any]:
    """Scan docs directory and ingest all legal files into ChromaDB collection 'kavach_legal_documents'."""
    if docs_dir is None:
        docs_dir = settings.LEGAL_DOCUMENTS_DIR

    os.makedirs(docs_dir, exist_ok=True)
    collection = get_legal_collection()

    supported_extensions = ["*.pdf", "*.txt", "*.md"]
    found_files = []
    for ext in supported_extensions:
        found_files.extend(glob.glob(os.path.join(docs_dir, ext)))

    if not found_files:
        return {
            "status": "NO_FILES_FOUND",
            "message": f"No supported files (.pdf, .txt, .md) found in '{docs_dir}'. Place statutory documents there to ingest.",
            "documents_indexed": 0,
            "total_chunks_created": 0,
        }

    total_chunks = 0
    docs_indexed = 0

    all_ids = []
    all_documents = []
    all_metadatas = []

    for file_path in found_files:
        file_name = os.path.basename(file_path)
        doc_ext = os.path.splitext(file_name)[1].replace(".", "").lower()
        pages = extract_text_from_file(file_path)
        if not pages:
            continue

        file_chunk_count = 0
        for p in pages:
            page_num = p["page_number"]
            page_text = p["text"]
            chunks = split_text_into_chunks(page_text, chunk_size=700, overlap=100)

            for chunk_idx, chunk in enumerate(chunks):
                chunk_id = f"LEGAL-{file_name}-P{page_num}-C{chunk_idx}-{uuid.uuid4().hex[:6]}"
                
                # Simple section extraction heuristic
                section_name = "General Provision"
                if "section" in chunk.lower() or "bns" in chunk.lower() or "ipc" in chunk.lower():
                    lines = chunk.split("\n")
                    for line in lines[:3]:
                        if any(k in line.lower() for k in ["section", "bns", "ipc", "article", "rule"]):
                            section_name = line.strip()[:80]
                            break

                all_ids.append(chunk_id)
                all_documents.append(chunk)
                all_metadatas.append({
                    "document_name": file_name,
                    "section": section_name,
                    "page": page_num,
                    "file_type": doc_ext,
                    "source": f"Kavach Repository / {file_name}",
                    "chunk_id": chunk_id,
                })
                file_chunk_count += 1

        total_chunks += file_chunk_count
        docs_indexed += 1

        # Track in SQLite database if db session is provided
        if db:
            meta = db.query(LegalDocumentMetadata).filter(LegalDocumentMetadata.document_name == file_name).first()
            if not meta:
                meta = LegalDocumentMetadata(
                    doc_id=f"DOC-{uuid.uuid4().hex[:8].upper()}",
                    document_name=file_name,
                    document_version="1.0",
                    file_type=doc_ext,
                    source=f"Local Ingestion ({file_name})",
                    chunk_count=file_chunk_count,
                )
                db.add(meta)
            else:
                meta.chunk_count = file_chunk_count
            db.commit()

    # Upsert into ChromaDB
    if all_ids:
        collection.upsert(
            ids=all_ids,
            documents=all_documents,
            metadatas=all_metadatas,
        )

    return {
        "status": "SUCCESS",
        "message": f"Successfully ingested {docs_indexed} document(s) with {total_chunks} total vector chunks into ChromaDB.",
        "documents_indexed": docs_indexed,
        "total_chunks_created": total_chunks,
    }
