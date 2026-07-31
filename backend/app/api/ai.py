from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.ai_schema import (
    AIAnalysisResult,
    RouteRiskRequest,
    RouteRiskResponse,
)
from app.services.ai_service import ai_service
from app.services.risk_service import risk_service
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

class AnalyzeTestRequest(BaseModel):
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    is_dmb_direct: bool = False

@router.post("/analyze", response_model=AIAnalysisResult)
async def analyze_hazard(payload: AnalyzeTestRequest, db: Session = Depends(get_db)):
    result = await ai_service.analyze_hazard(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        is_dmb_direct=payload.is_dmb_direct,
    )
    return result

@router.post("/route-risk", response_model=RouteRiskResponse)
def get_route_risk(
    payload: RouteRiskRequest, db: Session = Depends(get_db)
):
    result = risk_service.evaluate_route_risk(
        db=db,
        origin=payload.origin,
        destination=payload.destination,
        travel_mode=payload.travel_mode,
    )
    return result
