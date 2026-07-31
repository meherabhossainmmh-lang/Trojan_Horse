from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class AuthorityAgencyResponse(BaseModel):
    id: int
    name: str
    agency_code: str
    contact_phone: str
    email: str
    jurisdiction_area: Optional[str] = None

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: str = "citizen"
    authority_agency_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: Optional[str] = None
    role: str
    authority_agency_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
