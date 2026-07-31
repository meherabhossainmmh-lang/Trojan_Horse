from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class SOSCreate(BaseModel):
    user_name: Optional[str] = "Citizen Commuter"
    phone_number: Optional[str] = "01700-000000"
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    address: Optional[str] = "Live GPS Coordinate"

class SOSResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: str
    phone_number: Optional[str] = None
    latitude: float
    longitude: float
    address: str
    status: str
    notified_agency: str
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
