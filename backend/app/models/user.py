from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class AuthorityAgency(Base):
    __tablename__ = "authority_agencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    agency_code = Column(String(50), unique=True, nullable=False, index=True)
    contact_phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    jurisdiction_area = Column(String(150), nullable=True)

    users = relationship("User", back_populates="agency")
    reports = relationship("Report", back_populates="assigned_authority")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(50), nullable=True)
    role = Column(String(50), default="citizen", nullable=False)
    authority_agency_id = Column(Integer, ForeignKey("authority_agencies.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    agency = relationship("AuthorityAgency", back_populates="users")
    reports = relationship("Report", back_populates="user")
    verifications = relationship("ReportVerification", back_populates="user")
    comments = relationship("ReportComment", back_populates="user")
    sos_alerts = relationship("SOSAlert", back_populates="user")
