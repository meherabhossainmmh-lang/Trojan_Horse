from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class CommentCreate(BaseModel):
    user_name: Optional[str] = "Anonymous Citizen"
    comment_text: str = Field(..., min_length=2, max_length=1000)

class CommentResponse(BaseModel):
    id: int
    report_id: int
    user_name: str
    comment_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class VerificationCreate(BaseModel):
    verification_type: str = Field(
        "confirm",
        description="Type of verification: 'confirm' (I saw this too) or 'false_report'",
    )

class ReportCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5, max_length=2500)
    category: str = Field(
        ...,
        description="Category such as Robbery, Snatching, Damaged Road, Open Drain, Missing Manhole Cover, Waterlogging, Poor Lighting, Unsafe Bridge",
    )
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    address: str = Field(..., min_length=3, max_length=255)
    photo_url: Optional[str] = None
    is_dmb_direct: bool = Field(
        False,
        description="Set to true if user toggles Direct Disaster Management Board Dispatch",
    )

class ReportUpdateStatus(BaseModel):
    status: str = Field(
        ...,
        description="Submitted, Received, Under Verification, In Progress, Resolved",
    )
    resolution_notes: Optional[str] = None
    after_repair_photo_url: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    address: str
    photo_url: Optional[str] = None
    status: str
    severity_score: int
    ai_trust_score: int
    ai_summary: Optional[str] = None
    is_dmb_direct: bool
    assigned_authority_id: Optional[int] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    after_repair_photo_url: Optional[str] = None
    upvote_count: int = 0
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True
