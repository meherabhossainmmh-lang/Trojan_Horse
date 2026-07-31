from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import reports, sos, ai, authorities, seed
from app.api.seed import seed_database_data

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Nirapod (নিরাপদ) — Real-Time Community Crime Hotspot & Public Hazard Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(sos.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(authorities.router, prefix=settings.API_V1_STR)
app.include_router(seed.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # If database is empty, seed initial Bangladesh demo data
        from app.models.user import AuthorityAgency
        if db.query(AuthorityAgency).count() == 0:
            seed_database_data(db)
            print("[Nirapod Startup] Seeded realistic Bangladesh demo data successfully!")
    except Exception as e:
        print("[Nirapod Startup] Could not seed initial data:", e)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "ai_grok_configured": settings.is_grok_configured,
        "ai_voyage_configured": settings.is_voyage_configured,
    }
