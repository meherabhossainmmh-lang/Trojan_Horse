from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from app.database import Base

class AIAnalysisLog(Base):
    __tablename__ = "ai_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=True, index=True)
    model_used = Column(String(100), default="grok-beta", nullable=False)
    confidence_score = Column(Float, default=0.88, nullable=False)
    raw_ai_response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
