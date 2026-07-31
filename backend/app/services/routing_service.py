from sqlalchemy.orm import Session
from app.models.user import AuthorityAgency

class RoutingService:
    def assign_authority(self, db: Session, agency_code: str) -> int:
        agency = (
            db.query(AuthorityAgency)
            .filter(AuthorityAgency.agency_code == agency_code)
            .first()
        )
        if not agency:
            # Fallback to default DNCC or first available agency
            agency = db.query(AuthorityAgency).first()
            if not agency:
                return 1
        return agency.id

routing_service = RoutingService()
