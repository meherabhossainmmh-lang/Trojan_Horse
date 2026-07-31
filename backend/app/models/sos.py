from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
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
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sos_alerts")
