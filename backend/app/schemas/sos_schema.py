from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field

class SOSMessage(BaseModel):
    sender: str
    message: str
    timestamp: str

class SOSCreate(BaseModel):
    user_name: Optional[str] = "Citizen Commuter"
    phone_number: Optional[str] = "01700-000000"
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    address: Optional[str] = "Live GPS Coordinate"

class SOSUpdateDmpStatus(BaseModel):
    dmp_status: str = Field(
        ...,
        description="Notified, Dispatched, Arrived, Action Taken, or No Response Yet",
    )

class SOSCityCorpCheckup(BaseModel):
    action_type: str = Field(
        ...,
        description="'request_status', 'escalate', or 'send_message'",
    )
    message_text: Optional[str] = None
    city_corp_notes: Optional[str] = None

class SOSUserFeedback(BaseModel):
    feedback: str = Field(
        ...,
        description="'Police Arrived & Taking Action' or 'Police Not Arrived Yet — Require Immediate Follow-up'",
    )

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
    dmp_status: str
    city_corp_oversight_status: str
    city_corp_notes: Optional[str] = None
    user_action_feedback: str
    assigned_city_corp: str
    messages: List[SOSMessage] = []
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
