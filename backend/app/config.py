import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    PROJECT_NAME: str = "Nirapod — Real-Time Public Safety & Hazard Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./nirapod.db")

    # AI Service Tokens & Models
    GROK_API_KEY: str = os.getenv("GROK_API_KEY", "INSERT_YOUR_GROK_API_KEY_HERE")
    GROK_API_BASE_URL: str = os.getenv("GROK_API_BASE_URL", "https://api.x.ai/v1")
    GROK_MODEL: str = os.getenv("GROK_MODEL", "grok-beta")

    VOYAGE_API_KEY: str = os.getenv("VOYAGE_API_KEY", "INSERT_YOUR_VOYAGE_API_KEY_HERE")
    VOYAGE_MODEL: str = os.getenv("VOYAGE_MODEL", "voyage-2")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-deployments")

    @property
    def is_grok_configured(self) -> bool:
        return bool(
            self.GROK_API_KEY
            and "INSERT_" not in self.GROK_API_KEY
            and len(self.GROK_API_KEY) > 8
        )

    @property
    def is_voyage_configured(self) -> bool:
        return bool(
            self.VOYAGE_API_KEY
            and "INSERT_" not in self.VOYAGE_API_KEY
            and len(self.VOYAGE_API_KEY) > 8
        )

settings = Settings()
