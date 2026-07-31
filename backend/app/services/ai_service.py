import json
import math
import httpx
from typing import List, Optional
from app.config import settings
from app.schemas.ai_schema import AIAnalysisResult

class AIService:
    def __init__(self):
        self.grok_base_url = settings.GROK_API_BASE_URL
        self.grok_model = settings.GROK_MODEL

    def _haversine_distance_meters(
        self, lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        R = 6371000  # Radius of Earth in meters
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def _text_similarity(self, text1: str, text2: str) -> float:
        words1 = set(text1.lower().replace(".", "").replace(",", "").split())
        words2 = set(text2.lower().replace(".", "").replace(",", "").split())
        if not words1 or not words2:
            return 0.0
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union)

    async def _check_duplicate(
        self,
        title: str,
        description: str,
        lat: float,
        lon: float,
        existing_reports: List[dict],
    ) -> Optional[int]:
        for rep in existing_reports:
            dist = self._haversine_distance_meters(
                lat, lon, rep["latitude"], rep["longitude"]
            )
            if dist <= 100.0:  # Within 100 meters
                sim = self._text_similarity(
                    f"{title} {description}", f"{rep['title']} {rep['description']}"
                )
                if sim >= 0.35 or rep.get("category") == rep.get("current_category"):
                    return rep["id"]
        return None

    async def analyze_hazard(
        self,
        title: str,
        description: str,
        category: str,
        latitude: float,
        longitude: float,
        is_dmb_direct: bool = False,
        existing_reports: Optional[List[dict]] = None,
    ) -> AIAnalysisResult:
        if existing_reports:
            dup_id = await self._check_duplicate(
                title, description, latitude, longitude, existing_reports
            )
            if dup_id:
                return AIAnalysisResult(
                    severity_score=75,
                    recommended_authority_code="DMB" if is_dmb_direct else "DNCC",
                    ai_executive_summary=f"Duplicate report clustered with existing report #{dup_id} via geospatial & semantic similarity.",
                    is_duplicate=True,
                    duplicate_report_id=dup_id,
                    confidence_score=0.92,
                    analysis_source="voyage-duplicate-clustering",
                )

        if settings.is_grok_configured:
            try:
                result = await self._call_grok_api(
                    title, description, category, latitude, longitude, is_dmb_direct
                )
                if result:
                    return result
            except Exception as e:
                print(f"[AIService] Grok API Error (falling back to heuristic engine): {e}")

        # Intelligent Heuristic Fallback Engine
        return self._heuristic_fallback_engine(
            title, description, category, latitude, longitude, is_dmb_direct
        )

    async def _call_grok_api(
        self,
        title: str,
        description: str,
        category: str,
        lat: float,
        lon: float,
        is_dmb_direct: bool,
    ) -> Optional[AIAnalysisResult]:
        prompt = f"""
You are an expert AI public safety engineer for Bangladesh (Nirapod system).
Analyze the following citizen report and respond ONLY with valid JSON.
Title: {title}
Description: {description}
Category: {category}
Latitude: {lat}, Longitude: {lon}
Direct DMB Toggle: {is_dmb_direct}

Respond in JSON matching this schema:
{{
  "severity_score": int between 1 and 100,
  "recommended_authority_code": "DMB", "DNCC", "DSCC", or "DMP",
  "ai_executive_summary": "1-sentence actionable summary for government responders"
}}
"""
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{self.grok_base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.GROK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.grok_model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.2,
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                content_str = data["choices"][0]["message"]["content"]
                # Parse JSON block
                clean_json = content_str.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                parsed = json.loads(clean_json)
                return AIAnalysisResult(
                    severity_score=parsed.get("severity_score", 75),
                    recommended_authority_code=parsed.get(
                        "recommended_authority_code", "DNCC"
                    ),
                    ai_executive_summary=parsed.get(
                        "ai_executive_summary",
                        f"AI Hazard Assessment: {title} requires official intervention.",
                    ),
                    is_duplicate=False,
                    confidence_score=0.94,
                    analysis_source="grok-vision-beta",
                )
        return None

    def _heuristic_fallback_engine(
        self,
        title: str,
        description: str,
        category: str,
        lat: float,
        lon: float,
        is_dmb_direct: bool,
    ) -> AIAnalysisResult:
        text = f"{title} {description}".lower()

        # Severity Assessment
        critical_keywords = [
            "robbery",
            "snatching",
            "chintai",
            "weapon",
            "knife",
            "gun",
            "open manhole",
            "deep drain",
            "accident",
            "death",
            "broken bridge",
            "flooded",
            "waterlogging",
            "danger",
            "urgent",
        ]
        moderate_keywords = [
            "pothole",
            "damaged road",
            "dark",
            "light",
            "street light",
            "drain",
            "traffic",
            "mugging",
            "unsafe",
        ]

        score = 55
        if any(kw in text for kw in critical_keywords):
            score = 88
        elif any(kw in text for kw in moderate_keywords):
            score = 72

        if is_dmb_direct:
            score = max(score, 85)

        # Authority Determination
        auth_code = "DNCC"
        if (
            is_dmb_direct
            or category
            in [
                "Open Drain",
                "Missing Manhole Cover",
                "Waterlogging",
                "Unsafe Bridge",
                "Structural Hazard",
            ]
        ):
            auth_code = "DMB"
        elif category in [
            "Robbery",
            "Snatching",
            "Mugging",
            "Harassment",
            "Crime Hotspot",
        ]:
            auth_code = "DMP"
        else:
            # North vs South Dhaka / Gazipur latitude threshold ~23.78
            if lat >= 23.79:
                auth_code = "DNCC"
            else:
                auth_code = "DSCC"

        summary = f"CRITICAL SAFETY ACTION: [{category.upper()}] at coordinate ({lat:.4f}, {lon:.4f}) — '{title}'. Requires prompt field inspection by {auth_code} personnel."

        return AIAnalysisResult(
            severity_score=score,
            recommended_authority_code=auth_code,
            ai_executive_summary=summary,
            is_duplicate=False,
            confidence_score=0.90,
            analysis_source="heuristic-fallback-engine",
        )

ai_service = AIService()
