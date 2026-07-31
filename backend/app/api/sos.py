from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sos import SOSAlert
from app.schemas.sos_schema import SOSCreate, SOSResponse

router = APIRouter(prefix="/sos", tags=["Emergency SOS"])

@router.get("", response_model=List[SOSResponse])
def get_active_sos(db: Session = Depends(get_db)):
    alerts = (
        db.query(SOSAlert)
        .order_by(SOSAlert.created_at.desc())
        .limit(20)
        .all()
    )
    return [SOSResponse.from_orm(a) for a in alerts]

@router.post("", response_model=SOSResponse, status_code=201)
def trigger_sos(payload: SOSCreate, db: Session = Depends(get_db)):
    alert = SOSAlert(
        user_name=payload.user_name or "Citizen Commuter",
        phone_number=payload.phone_number or "01700-000000",
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address or f"GPS ({payload.latitude:.4f}, {payload.longitude:.4f})",
        status="active",
        notified_agency="National 999 & DMB Helpline 1090",
        created_at=datetime.utcnow(),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return SOSResponse.from_orm(alert)

@router.patch("/{alert_id}/resolve", response_model=SOSResponse)
def resolve_sos(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    alert.status = "resolved"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return SOSResponse.from_orm(alert)
