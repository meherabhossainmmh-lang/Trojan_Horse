from typing import Optional, List
from pydantic import BaseModel, Field

class AIAnalysisResult(BaseModel):
    severity_score: int = Field(..., ge=1, le=100)
    recommended_authority_code: str = Field(
        ...,
        description="DMB, DNCC, DSCC, or DMP",
    )
    ai_executive_summary: str
    is_duplicate: bool = False
    duplicate_report_id: Optional[int] = None
    confidence_score: float = 0.88
    analysis_source: str = Field(
        "grok-vision-beta",
        description="Indicates whether Grok API, Voyage AI, or Heuristic Fallback Engine was used",
    )

class RouteRiskRequest(BaseModel):
    origin: str = Field(..., min_length=2, max_length=150)
    destination: str = Field(..., min_length=2, max_length=150)
    travel_mode: str = Field("walking", description="walking, rickshaw, bus, motorcycle")

class HotspotWarning(BaseModel):
    title: str
    category: str
    address: str
    severity_score: int
    advice: str

class RouteRiskResponse(BaseModel):
    origin: str
    destination: str
    travel_mode: str
    overall_risk_level: str = Field(..., description="Safe, Moderate Caution, High Danger Zone")
    risk_score: int = Field(..., ge=0, le=100)
    summary_advisory: str
    recommended_safer_route: str
    hotspot_warnings: List[HotspotWarning] = []
