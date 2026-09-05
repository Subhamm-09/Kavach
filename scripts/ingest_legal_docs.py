import os
import sys
import json
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.database import SessionLocal
from backend.app.rag.ingest import ingest_legal_directory

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("[INGEST] Scanning /data/legal_documents/ and ingesting into ChromaDB...")
        res = ingest_legal_directory(db=db)
        print(json.dumps(res, indent=2))
    finally:
        db.close()
