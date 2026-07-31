import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sos import SOSAlert
from app.schemas.sos_schema import (
    SOSCreate,
    SOSResponse,
    SOSUpdateDmpStatus,
    SOSCityCorpCheckup,
    SOSUserFeedback,
    SOSMessage,
)

router = APIRouter(prefix="/sos", tags=["Emergency SOS"])

def _format_sos(alert: SOSAlert) -> SOSResponse:
    try:
        msgs_raw = json.loads(alert.messages_json or "[]")
    except Exception:
        msgs_raw = []
    msgs = [SOSMessage(**m) for m in msgs_raw]
    return SOSResponse(
        id=alert.id,
        user_id=alert.user_id,
        user_name=alert.user_name,
        phone_number=alert.phone_number,
        latitude=alert.latitude,
        longitude=alert.longitude,
        address=alert.address,
        status=alert.status,
        notified_agency=alert.notified_agency,
        dmp_status=alert.dmp_status,
        city_corp_oversight_status=alert.city_corp_oversight_status,
        city_corp_notes=alert.city_corp_notes,
        user_action_feedback=alert.user_action_feedback,
        assigned_city_corp=alert.assigned_city_corp,
        messages=msgs,
        created_at=alert.created_at,
        resolved_at=alert.resolved_at,
    )

@router.get("", response_model=List[SOSResponse])
def get_active_sos(db: Session = Depends(get_db)):
    alerts = (
        db.query(SOSAlert)
        .order_by(SOSAlert.created_at.desc())
        .limit(20)
        .all()
    )
    return [_format_sos(a) for a in alerts]

@router.post("", response_model=SOSResponse, status_code=201)
def trigger_sos(payload: SOSCreate, db: Session = Depends(get_db)):
    corp = "DNCC" if payload.latitude >= 23.78 else "DSCC"
    initial_msgs = [
        {
            "sender": f"{corp} Control Room",
            "message": f"SOS broadcast received at {corp}. We are monitoring DMP Police dispatch and requesting real-time action status from you.",
            "timestamp": datetime.utcnow().isoformat(),
        }
    ]
    alert = SOSAlert(
        user_name=payload.user_name or "Citizen Commuter",
        phone_number=payload.phone_number or "01700-000000",
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address or f"GPS ({payload.latitude:.4f}, {payload.longitude:.4f})",
        status="active",
        notified_agency="National 999 & DMB Helpline 1090",
        dmp_status="Notified — Awaiting Police Dispatch",
        city_corp_oversight_status="Status Requested from User",
        city_corp_notes=f"{corp} Control Room monitoring DMP police dispatch and requesting safety verification.",
        user_action_feedback="Pending",
        assigned_city_corp=corp,
        messages_json=json.dumps(initial_msgs),
        created_at=datetime.utcnow(),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return _format_sos(alert)

@router.patch("/{alert_id}/dmp-status", response_model=SOSResponse)
def update_dmp_status(
    alert_id: int, payload: SOSUpdateDmpStatus, db: Session = Depends(get_db)
):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    alert.dmp_status = payload.dmp_status
    try:
        msgs = json.loads(alert.messages_json or "[]")
    except Exception:
        msgs = []
    msgs.append({
        "sender": "DMP Police Dispatch 999",
        "message": f"Police status updated to: {payload.dmp_status}",
        "timestamp": datetime.utcnow().isoformat(),
    })
    alert.messages_json = json.dumps(msgs)
    db.commit()
    db.refresh(alert)
    return _format_sos(alert)

@router.patch("/{alert_id}/city-corp-checkup", response_model=SOSResponse)
def update_city_corp_checkup(
    alert_id: int, payload: SOSCityCorpCheckup, db: Session = Depends(get_db)
):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")

    try:
        msgs = json.loads(alert.messages_json or "[]")
    except Exception:
        msgs = []

    if payload.action_type == "request_status":
        alert.city_corp_oversight_status = "Status Requested from User"
        msg_text = payload.message_text or f"Hello {alert.user_name}, {alert.assigned_city_corp} Control Room is checking on your safety. Has DMP Police arrived at your coordinate?"
        msgs.append({
            "sender": f"{alert.assigned_city_corp} Emergency Control Room",
            "message": msg_text,
            "timestamp": datetime.utcnow().isoformat(),
        })
    elif payload.action_type == "escalate":
        alert.city_corp_oversight_status = "Escalated to DMP Headquarters"
        msg_text = payload.message_text or f"{alert.assigned_city_corp} flagged priority escalation to DMP Headquarters: Immediate patrol verification required."
        msgs.append({
            "sender": f"{alert.assigned_city_corp} Control Room",
            "message": msg_text,
            "timestamp": datetime.utcnow().isoformat(),
        })
    elif payload.action_type == "send_message" and payload.message_text:
        msgs.append({
            "sender": f"{alert.assigned_city_corp} Control Room",
            "message": payload.message_text,
            "timestamp": datetime.utcnow().isoformat(),
        })

    if payload.city_corp_notes:
        alert.city_corp_notes = payload.city_corp_notes

    alert.messages_json = json.dumps(msgs)
    db.commit()
    db.refresh(alert)
    return _format_sos(alert)

@router.patch("/{alert_id}/user-feedback", response_model=SOSResponse)
def submit_user_feedback(
    alert_id: int, payload: SOSUserFeedback, db: Session = Depends(get_db)
):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")

    alert.user_action_feedback = payload.feedback
    try:
        msgs = json.loads(alert.messages_json or "[]")
    except Exception:
        msgs = []

    if "Arrived" in payload.feedback and "Not" not in payload.feedback:
        alert.dmp_status = "Arrived & Action Taken"
        alert.city_corp_oversight_status = "Verified DMP Action"
    elif "Not Arrived" in payload.feedback:
        alert.dmp_status = "No Response Yet — Escalated"
        alert.city_corp_oversight_status = "Escalated to DMP Headquarters"

    msgs.append({
        "sender": f"Citizen ({alert.user_name})",
        "message": f"Action Status Feedback: {payload.feedback}",
        "timestamp": datetime.utcnow().isoformat(),
    })
    alert.messages_json = json.dumps(msgs)
    db.commit()
    db.refresh(alert)
    return _format_sos(alert)

@router.patch("/{alert_id}/resolve", response_model=SOSResponse)
def resolve_sos(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    alert.status = "resolved"
    alert.dmp_status = "Resolved"
    alert.city_corp_oversight_status = "Verified Safe"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return _format_sos(alert)
