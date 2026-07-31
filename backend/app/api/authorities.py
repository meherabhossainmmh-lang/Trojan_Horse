from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import AuthorityAgency
from app.models.report import Report
from app.schemas.user_schema import AuthorityAgencyResponse

router = APIRouter(prefix="/authorities", tags=["Government Authorities"])

@router.get("", response_model=List[AuthorityAgencyResponse])
def get_authorities(db: Session = Depends(get_db)):
    agencies = db.query(AuthorityAgency).order_by(AuthorityAgency.id.asc()).all()
    return [AuthorityAgencyResponse.from_orm(a) for a in agencies]

@router.get("/dashboard-stats", response_model=Dict[str, Any])
def get_dashboard_statistics(db: Session = Depends(get_db)):
    total_reports = db.query(Report).count()
    resolved_reports = db.query(Report).filter(Report.status == "Resolved").count()
    in_progress = db.query(Report).filter(Report.status == "In Progress").count()
    received = db.query(Report).filter(Report.status == "Received").count()
    under_verify = (
        db.query(Report).filter(Report.status == "Under Verification").count()
    )
    dmb_direct_count = (
        db.query(Report).filter(Report.is_dmb_direct == True).count()
    )
    high_severity_count = (
        db.query(Report).filter(Report.severity_score >= 75).count()
    )

    agencies = db.query(AuthorityAgency).all()
    agency_breakdown = {}
    for agency in agencies:
        count = (
            db.query(Report)
            .filter(Report.assigned_authority_id == agency.id)
            .count()
        )
        agency_breakdown[agency.agency_code] = {
            "name": agency.name,
            "report_count": count,
        }

    return {
        "total_reports": total_reports,
        "resolved_reports": resolved_reports,
        "in_progress": in_progress,
        "received": received,
        "under_verify": under_verify,
        "dmb_direct_count": dmb_direct_count,
        "high_severity_count": high_severity_count,
        "agency_breakdown": agency_breakdown,
    }
