from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), nullable=False)
    photo_url = Column(String(500), nullable=True)
    status = Column(String(50), default="Submitted", nullable=False, index=True)
    severity_score = Column(Integer, default=50, nullable=False)
    ai_trust_score = Column(Integer, default=60, nullable=False)
    ai_summary = Column(Text, nullable=True)
    is_dmb_direct = Column(Boolean, default=False, nullable=False, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_authority_id = Column(Integer, ForeignKey("authority_agencies.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    after_repair_photo_url = Column(String(500), nullable=True)

    user = relationship("User", back_populates="reports")
    assigned_authority = relationship("AuthorityAgency", back_populates="reports")
    verifications = relationship("ReportVerification", back_populates="report", cascade="all, delete-orphan")
    comments = relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_reports_coords", "latitude", "longitude"),
        Index("idx_reports_status_agency", "status", "assigned_authority_id"),
    )

class ReportVerification(Base):
    __tablename__ = "report_verifications"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    verification_type = Column(String(50), default="confirm", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("Report", back_populates="verifications")
    user = relationship("User", back_populates="verifications")

class ReportComment(Base):
    __tablename__ = "report_comments"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_name = Column(String(100), default="Anonymous Citizen", nullable=False)
    comment_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("Report", back_populates="comments")
    user = relationship("User", back_populates="comments")
