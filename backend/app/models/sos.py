from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_name = Column(String(100), default="Citizen Commuter", nullable=False)
    phone_number = Column(String(50), default="01700-000000", nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), default="Unknown Location", nullable=False)
    status = Column(String(50), default="active", nullable=False, index=True)
    notified_agency = Column(String(100), default="DMP (999) & DMB (1090)", nullable=False)
    
    # Inter-Agency Accountability & Oversight Fields
    dmp_status = Column(String(50), default="Notified — Awaiting Police Dispatch", nullable=False)
    city_corp_oversight_status = Column(String(50), default="Status Requested from User", nullable=False)
    city_corp_notes = Column(Text, nullable=True)
    user_action_feedback = Column(String(100), default="Pending", nullable=False)
    assigned_city_corp = Column(String(50), default="DNCC", nullable=False)
    messages_json = Column(Text, default="[]", nullable=False) # JSON encoded messages list

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sos_alerts")
