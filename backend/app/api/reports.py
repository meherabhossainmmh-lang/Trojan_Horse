from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report, ReportVerification, ReportComment
from app.schemas.report_schema import (
    ReportCreate,
    ReportResponse,
    ReportUpdateStatus,
    VerificationCreate,
    CommentCreate,
    CommentResponse,
)
from app.services.ai_service import ai_service
from app.services.routing_service import routing_service

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(
    category: Optional[str] = Query(None, description="Filter by hazard/crime category"),
    status: Optional[str] = Query(None, description="Filter by resolution status"),
    assigned_authority_id: Optional[int] = Query(None, description="Filter by authority ID"),
    is_dmb_direct: Optional[bool] = Query(None, description="Filter by Direct DMB Dispatch"),
    search: Optional[str] = Query(None, description="Search keyword in title/description/address"),
    db: Session = Depends(get_db),
):
    query = db.query(Report)
    if category and category != "All":
        query = query.filter(Report.category == category)
    if status and status != "All":
        query = query.filter(Report.status == status)
    if assigned_authority_id:
        query = query.filter(Report.assigned_authority_id == assigned_authority_id)
    if is_dmb_direct is not None:
        query = query.filter(Report.is_dmb_direct == is_dmb_direct)
    if search:
        search_kw = f"%{search}%"
        query = query.filter(
            (Report.title.ilike(search_kw))
            | (Report.description.ilike(search_kw))
            | (Report.address.ilike(search_kw))
        )

    reports = query.order_by(Report.created_at.desc()).all()

    result = []
    for r in reports:
        resp = ReportResponse.from_orm(r)
        resp.upvote_count = (
            db.query(ReportVerification)
            .filter(
                ReportVerification.report_id == r.id,
                ReportVerification.verification_type == "confirm",
            )
            .count()
        )
        result.append(resp)

    return result

@router.get("/{report_id}", response_model=ReportResponse)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    resp = ReportResponse.from_orm(report)
    resp.upvote_count = (
        db.query(ReportVerification)
        .filter(
            ReportVerification.report_id == report_id,
            ReportVerification.verification_type == "confirm",
        )
        .count()
    )
    return resp

@router.post("", response_model=ReportResponse, status_code=201)
async def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    # Query existing reports for duplicate clustering check
    all_reps = db.query(Report).filter(Report.status != "Resolved").all()
    rep_dicts = [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "category": r.category,
        }
        for r in all_reps
    ]

    ai_result = await ai_service.analyze_hazard(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        is_dmb_direct=payload.is_dmb_direct,
        existing_reports=rep_dicts,
    )

    if ai_result.is_duplicate and ai_result.duplicate_report_id:
        existing = (
            db.query(Report)
            .filter(Report.id == ai_result.duplicate_report_id)
            .first()
        )
        if existing:
            # Auto-upvote and bump trust score
            verification = ReportVerification(
                report_id=existing.id, verification_type="confirm"
            )
            db.add(verification)
            existing.ai_trust_score = min(existing.ai_trust_score + 10, 100)
            db.commit()
            db.refresh(existing)
            resp = ReportResponse.from_orm(existing)
            resp.upvote_count = (
                db.query(ReportVerification)
                .filter(
                    ReportVerification.report_id == existing.id,
                    ReportVerification.verification_type == "confirm",
                )
                .count()
            )
            return resp

    assigned_id = routing_service.assign_authority(
        db, ai_result.recommended_authority_code
    )

    new_report = Report(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address,
        photo_url=payload.photo_url
        or "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
        status="Submitted",
        severity_score=ai_result.severity_score,
        ai_trust_score=70 if payload.is_dmb_direct else 60,
        ai_summary=ai_result.ai_executive_summary,
        is_dmb_direct=payload.is_dmb_direct,
        assigned_authority_id=assigned_id,
        created_at=datetime.utcnow(),
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Add initial creator confirm
    verification = ReportVerification(
        report_id=new_report.id, verification_type="confirm"
    )
    db.add(verification)
    db.commit()

    resp = ReportResponse.from_orm(new_report)
    resp.upvote_count = 1
    return resp

@router.post("/{report_id}/verify", response_model=ReportResponse)
def verify_report(
    report_id: int, payload: VerificationCreate, db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    verification = ReportVerification(
        report_id=report_id, verification_type=payload.verification_type
    )
    db.add(verification)

    if payload.verification_type == "confirm":
        report.ai_trust_score = min(report.ai_trust_score + 10, 100)
    elif payload.verification_type == "false_report":
        report.ai_trust_score = max(report.ai_trust_score - 15, 0)

    db.commit()
    db.refresh(report)

    resp = ReportResponse.from_orm(report)
    resp.upvote_count = (
        db.query(ReportVerification)
        .filter(
            ReportVerification.report_id == report_id,
            ReportVerification.verification_type == "confirm",
        )
        .count()
    )
    return resp

@router.post("/{report_id}/comments", response_model=CommentResponse)
def add_comment(
    report_id: int, payload: CommentCreate, db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    comment = ReportComment(
        report_id=report_id,
        user_name=payload.user_name or "Anonymous Citizen",
        comment_text=payload.comment_text,
        created_at=datetime.utcnow(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return CommentResponse.from_orm(comment)

@router.patch("/{report_id}/status", response_model=ReportResponse)
def update_report_status(
    report_id: int, payload: ReportUpdateStatus, db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = payload.status
    if payload.resolution_notes:
        report.resolution_notes = payload.resolution_notes
    if payload.after_repair_photo_url:
        report.after_repair_photo_url = payload.after_repair_photo_url
    if payload.status == "Resolved":
        report.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(report)

    resp = ReportResponse.from_orm(report)
    resp.upvote_count = (
        db.query(ReportVerification)
        .filter(
            ReportVerification.report_id == report_id,
            ReportVerification.verification_type == "confirm",
        )
        .count()
    )
    return resp
