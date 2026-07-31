#!/usr/bin/env python3
import sys
from pathlib import Path

# Ensure app module is in path
sys.path.append(str(Path(__file__).resolve().parent))

from app.database import SessionLocal
from app.api.seed import seed_database_data

def main():
    print("=== Nirapod Database Seeder ===")
    db = SessionLocal()
    try:
        res = seed_database_data(db)
        print("Success:", res["message"])
    except Exception as e:
        print("Error during database seed:", e)
    finally:
        db.close()

if __name__ == "__main__":
    main()
