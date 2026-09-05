import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import json
from backend.app.database import SessionLocal
from backend.app.seed.seeder import seed_database

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("[SEED] Seeding Kavach fictional demo data (users, zones, offenders, incidents)...")
        res = seed_database(db, force=True)
        print(json.dumps(res, indent=2))
        print("[SUCCESS] Demo seeding complete.")
    finally:
        db.close()
