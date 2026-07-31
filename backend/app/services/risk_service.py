from typing import List
from sqlalchemy.orm import Session
from app.models.report import Report
from app.schemas.ai_schema import RouteRiskResponse, HotspotWarning

class RiskService:
    def evaluate_route_risk(
        self, db: Session, origin: str, destination: str, travel_mode: str
    ) -> RouteRiskResponse:
        # Check active reports matching keywords in origin/destination or citywide
        all_reports = db.query(Report).filter(Report.status != "Resolved").all()

        route_keywords = [
            w.lower()
            for w in (origin + " " + destination).split()
            if len(w) > 3
        ]

        relevant_reports: List[Report] = []
        for rep in all_reports:
            txt = f"{rep.title} {rep.address} {rep.category}".lower()
            if any(kw in txt for kw in route_keywords) or len(relevant_reports) < 4:
                relevant_reports.append(rep)

        if not relevant_reports:
            return RouteRiskResponse(
                origin=origin,
                destination=destination,
                travel_mode=travel_mode,
                overall_risk_level="Safe",
                risk_score=15,
                summary_advisory=f"The route from {origin} to {destination} currently has no active high-severity crime or infrastructure reports.",
                recommended_safer_route=f"Main highway connecting {origin} to {destination} via well-lit arterial roads.",
                hotspot_warnings=[],
            )

        avg_severity = int(
            sum(r.severity_score for r in relevant_reports)
            / max(len(relevant_reports), 1)
        )
        has_crime = any(
            r.category in ["Robbery", "Snatching", "Mugging"]
            for r in relevant_reports
        )
        has_hazard = any(
            r.category
            in ["Open Drain", "Missing Manhole Cover", "Damaged Road", "Waterlogging"]
            for r in relevant_reports
        )

        risk_score = min(avg_severity + len(relevant_reports) * 5, 95)
        level = "Moderate Caution"
        if risk_score >= 75 or has_crime:
            level = "High Danger Zone"
        elif risk_score <= 40:
            level = "Safe"

        advisory_parts = []
        if has_crime:
            advisory_parts.append(
                "Active snatching/robbery hotspots reported along this route. Avoid poorly lit alleyways and travel in groups after dusk."
            )
        if has_hazard:
            advisory_parts.append(
                "Infrastructure hazards (open drains / missing manholes) detected. Exercise caution when walking or riding near road shoulders."
            )
        if not advisory_parts:
            advisory_parts.append(
                "Standard urban commute caution advised along this route."
            )

        warnings = [
            HotspotWarning(
                title=r.title,
                category=r.category,
                address=r.address,
                severity_score=r.severity_score,
                advice=(
                    "Keep valuables concealed and avoid footpaths after dark."
                    if "Robbery" in r.category or "Snatching" in r.category
                    else "Watch for uncovered manholes/drains on the road edge."
                ),
            )
            for r in relevant_reports[:4]
        ]

        safer_route = (
            f"Use primary arterial roads via Begum Rokeya Avenue or Kazi Nazrul Islam Avenue between {origin} and {destination}, avoiding secondary residential shortcuts."
        )

        return RouteRiskResponse(
            origin=origin,
            destination=destination,
            travel_mode=travel_mode,
            overall_risk_level=level,
            risk_score=risk_score,
            summary_advisory=" ".join(advisory_parts),
            recommended_safer_route=safer_route,
            hotspot_warnings=warnings,
        )

risk_service = RiskService()
