import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.database import engine, Base
from backend.app.seed.seeder import init_database_tables

if __name__ == "__main__":
    print("[INIT] Creating Kavach database tables in SQLite...")
    init_database_tables()
    print("[SUCCESS] Database tables successfully created.")
