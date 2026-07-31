from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app.models.user import AuthorityAgency, User
from app.models.report import Report, ReportVerification, ReportComment
from app.models.sos import SOSAlert
from app.models.ai_log import AIAnalysisLog
from datetime import datetime, timedelta

router = APIRouter(prefix="/seed", tags=["Database Seeding"])

def seed_database_data(db: Session):
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)

    # Check if agencies already exist
    if db.query(AuthorityAgency).count() > 0:
        # Clear existing reports for clean demo reset
        db.query(ReportVerification).delete()
        db.query(ReportComment).delete()
        db.query(AIAnalysisLog).delete()
        db.query(Report).delete()
        db.query(SOSAlert).delete()
        db.query(AuthorityAgency).delete()
        db.commit()

    agencies = [
        AuthorityAgency(
            name="Disaster Management Board (DMB)",
            agency_code="DMB",
            contact_phone="1090",
            email="dispatch@dmb.gov.bd",
            jurisdiction_area="National & Dhaka Metro",
        ),
        AuthorityAgency(
            name="Dhaka North City Corporation",
            agency_code="DNCC",
            contact_phone="16106",
            email="ops@dncc.gov.bd",
            jurisdiction_area="Dhaka North & Uttara",
        ),
        AuthorityAgency(
            name="Dhaka South City Corporation",
            agency_code="DSCC",
            contact_phone="16107",
            email="ops@dscc.gov.bd",
            jurisdiction_area="Dhaka South & Motijheel",
        ),
        AuthorityAgency(
            name="Dhaka Metropolitan Police",
            agency_code="DMP",
            contact_phone="999",
            email="control@dmp.gov.bd",
            jurisdiction_area="Dhaka Metropolitan Area",
        ),
    ]
    db.add_all(agencies)
    db.commit()

    dmb = db.query(AuthorityAgency).filter(AuthorityAgency.agency_code == "DMB").first()
    dncc = db.query(AuthorityAgency).filter(AuthorityAgency.agency_code == "DNCC").first()
    dscc = db.query(AuthorityAgency).filter(AuthorityAgency.agency_code == "DSCC").first()
    dmp = db.query(AuthorityAgency).filter(AuthorityAgency.agency_code == "DMP").first()

    sample_reports = [
        Report(
            title="Open 4-Foot Drainage Manhole on Mirpur 10 Roundabout",
            description="Manhole cover is completely missing on the main pedestrian crossing near Mirpur 10 roundabout. Several pedestrians tripped last night. Needs urgent concrete slab replacement.",
            category="Missing Manhole Cover",
            latitude=23.8069,
            longitude=90.3687,
            address="Mirpur 10 Roundabout, Dhaka",
            photo_url="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
            status="Submitted",
            severity_score=88,
            ai_trust_score=85,
            ai_summary="CRITICAL HAZARD: Open drainage manhole at Mirpur 10 intersection poses immediate fatal hazard to pedestrians and rickshaws.",
            is_dmb_direct=True,
            assigned_authority_id=dmb.id if dmb else None,
            created_at=datetime.utcnow() - timedelta(hours=2),
        ),
        Report(
            title="Recurrent Armed Snatching Zone at Dhanmondi Lake Footpath",
            description="Two snatching incidents occurred this week near the pedestrian bridge after 8 PM. Poor lighting enables muggers to escape into the park.",
            category="Snatching",
            latitude=23.7461,
            longitude=90.3742,
            address="Dhanmondi Lake Footpath near Bridge, Dhaka",
            photo_url="https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&auto=format&fit=crop&q=80",
            status="Under Verification",
            severity_score=85,
            ai_trust_score=90,
            ai_summary="CRIME HOTSPOT: Nighttime snatching reported near Dhanmondi Lake footpath; increased police illumination and patrolling advised.",
            is_dmb_direct=False,
            assigned_authority_id=dmp.id if dmp else None,
            created_at=datetime.utcnow() - timedelta(hours=5),
        ),
        Report(
            title="Collapsed Road Surface & Potholes at Gazipur Chowrasta",
            description="Heavy monsoon trucks have fractured a 30-meter stretch of asphalt near Gazipur Chowrasta intersection, causing severe traffic jams and vehicle damage.",
            category="Damaged Road",
            latitude=23.9892,
            longitude=90.3735,
            address="Gazipur Chowrasta Highway Intersection, Gazipur",
            photo_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
            status="In Progress",
            severity_score=82,
            ai_trust_score=80,
            ai_summary="STRUCTURAL ROAD DAMAGE: Heavy truck traffic has fractured 30m of road surface at Gazipur Chowrasta; DMB intervention required.",
            is_dmb_direct=True,
            assigned_authority_id=dmb.id if dmb else None,
            created_at=datetime.utcnow() - timedelta(hours=14),
        ),
        Report(
            title="Armed Robbery Hotspot in Uttara Sector 10 Underpass",
            description="Commuters returning from Uttara railway station reported an armed robbery attempt inside the underpass corridor.",
            category="Robbery",
            latitude=23.8759,
            longitude=90.3795,
            address="Sector 10 Underpass, Uttara, Dhaka",
            photo_url="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
            status="Received",
            severity_score=92,
            ai_trust_score=95,
            ai_summary="CRIME HOTSPOT: Armed robbery zone reported after dusk in Sector 10 underpass; DMP rapid intervention force alerted.",
            is_dmb_direct=False,
            assigned_authority_id=dmp.id if dmp else None,
            created_at=datetime.utcnow() - timedelta(hours=1),
        ),
        Report(
            title="Severely Waterlogged Drainage & Overflowing Sewer at Motijheel",
            description="Monsoon drainage channel is blocked near Shapla Chattar, causing 2 feet of waterlogging that stalls commuter buses and rickshaws.",
            category="Waterlogging",
            latitude=23.7330,
            longitude=90.4172,
            address="Motijheel Commercial Area near Shapla Chattar, Dhaka",
            photo_url="https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
            status="In Progress",
            severity_score=78,
            ai_trust_score=75,
            ai_summary="FLOODING RISK: Blocked storm drainage causing 2ft waterlogging in Motijheel business district.",
            is_dmb_direct=True,
            assigned_authority_id=dmb.id if dmb else None,
            created_at=datetime.utcnow() - timedelta(hours=8),
        ),
        Report(
            title="Broken Pedestrian Foot-Overbridge Staircase at Farmgate",
            description="Steel stair treads were rusted through and collapsed under commuter foot traffic. Fixed by DMB emergency crew.",
            category="Unsafe Bridge",
            latitude=23.7561,
            longitude=90.3872,
            address="Farmgate Overbridge, Kazi Nazrul Islam Ave, Dhaka",
            photo_url="https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
            status="Resolved",
            severity_score=90,
            ai_trust_score=100,
            ai_summary="STRUCTURAL REPAIR COMPLETED: DMB structural engineering team repaired damaged stair treads on Farmgate overbridge.",
            is_dmb_direct=True,
            assigned_authority_id=dmb.id if dmb else None,
            created_at=datetime.utcnow() - timedelta(days=2),
            resolved_at=datetime.utcnow() - timedelta(hours=6),
            resolution_notes="Stair treads reinforced with steel plating by DMB rapid maintenance team. Structural load tested and certified safe.",
            after_repair_photo_url="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
        ),
        Report(
            title="Missing Street Lighting at Gulshan 2 North Avenue",
            description="Four consecutive street lamps are inoperative along Gulshan 2 North Avenue, creating a dark zone after 9 PM.",
            category="Poor Lighting",
            latitude=23.7925,
            longitude=90.4152,
            address="Gulshan 2 North Avenue, Dhaka",
            photo_url="https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&auto=format&fit=crop&q=80",
            status="Submitted",
            severity_score=65,
            ai_trust_score=70,
            ai_summary="MUNICIPAL LIGHTING: 4 consecutive street lamps inoperative along Gulshan 2 North Avenue; DNCC electrical division assigned.",
            is_dmb_direct=False,
            assigned_authority_id=dncc.id if dncc else None,
            created_at=datetime.utcnow() - timedelta(hours=18),
        ),
        Report(
            title="Uncovered Cable Trench on Kuril Flyover Slip Road",
            description="A 1-meter deep cable trench left uncovered by utility workers near the Kuril Flyover descent poses a severe motorcycle rollover risk.",
            category="Open Drain",
            latitude=23.8223,
            longitude=90.4219,
            address="Kuril Flyover Slip Road, Dhaka",
            photo_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
            status="Under Verification",
            severity_score=80,
            ai_trust_score=82,
            ai_summary="HAZARD ALERT: Uncovered cable trench posing rollover hazard to motorcycles on Kuril flyover.",
            is_dmb_direct=True,
            assigned_authority_id=dmb.id if dmb else None,
            created_at=datetime.utcnow() - timedelta(hours=10),
        ),
    ]
    db.add_all(sample_reports)
    db.commit()

    # Add verifications and comments
    for rep in sample_reports:
        ver = ReportVerification(report_id=rep.id, verification_type="confirm")
        db.add(ver)
        if rep.id == sample_reports[0].id:
            db.add(
                ReportComment(
                    report_id=rep.id,
                    user_name="Tanvir Rahman (Mirpur Commuter)",
                    comment_text="I saw this open manhole near the bus stand today! Extremely dangerous at night.",
                    created_at=datetime.utcnow() - timedelta(hours=1),
                )
            )
            db.add(
                ReportComment(
                    report_id=rep.id,
                    user_name="DMB Field Inspector",
                    comment_text="Our emergency repair unit has been notified and scheduled for repair tonight.",
                    created_at=datetime.utcnow() - timedelta(minutes=30),
                )
            )

    # Seed an active SOS alert for demo
    sample_sos = SOSAlert(
        user_name="Nusrat Jahan (Student)",
        phone_number="01711-234567",
        latitude=23.7505,
        longitude=90.3800,
        address="Near Panthapath Signal, Dhaka",
        status="active",
        notified_agency="DMP Police 999 & DMB 1090",
        created_at=datetime.utcnow() - timedelta(minutes=15),
    )
    db.add(sample_sos)

    db.commit()
    return {"message": "Database seeded successfully with 8 realistic Bangladesh reports across all lifecycle states, 4 authorities, and 1 active emergency SOS alert!"}

@router.post("")
def trigger_seed(db: Session = Depends(get_db)):
    return seed_database_data(db)
