# Nirapod — Complete Technical Writeup & Architectural Whitepaper

**Document Version:** 1.0  
**Target Platform:** Web & Mobile Responsive Prototype  
**Core Technologies:** Next.js 14, TypeScript, Python FastAPI, PostgreSQL, Grok API, Voyage AI  

---

## 1. Introduction & Background

Across urban centers in Bangladesh—including Dhaka, Gazipur, and Chattogram—public safety hazards remain a severe threat to daily commuters. These hazards fall into two critical domains:
1. **Crime & Security Hotspots:** Armed robbery, mugging, and snatching (*chintai*) occur recurrently at poorly illuminated intersections and underpasses.
2. **Infrastructure & Civil Hazards:** Open drainage manholes, damaged road surfaces, missing covers, and waterlogging endanger pedestrians, motorcyclists, and vulnerable groups.

Traditional reporting via social media (Facebook, X) creates unverified, ephemeral posts that fail to reach municipal or disaster management authorities. **Nirapod** solves this problem by providing a real-time, community-verified, and AI-assisted public safety intelligence platform that routes verified geo-tagged reports directly to the responsible government agencies.

---

## 2. Overall System Architecture & Data Flow

Nirapod uses a modern three-tier decoupled architecture:

```
[ Next.js 14 Web Frontend ]  <--- REST / JSON (Async HTTP) --->  [ FastAPI Python Backend ]  <--- SQLAlchemy ORM --->  [ PostgreSQL Database ]
                                                                             |
                                                                             +---> [ Grok API (Vision / NLP) ]
                                                                             +---> [ Voyage AI (Vector Embeddings) ]
                                                                             +---> [ Disaster Management Board API ]
```

### 2.1 Data Flow Lifecycle
1. **Ingestion:** A user captures an infrastructure hazard or crime hotspot on their mobile device or desktop browser. The user uploads a photo, provides a title/description, selects GPS coordinates on an interactive Leaflet map, and optionally toggles the **"Direct DMB Dispatch"** switch for critical municipal emergencies.
2. **AI Pre-Processing & Duplicate Screening:**
   * The FastAPI gateway queries the PostgreSQL database for existing reports within a 100-meter Haversine radius.
   * If existing reports are found, **Voyage AI** (or the smart heuristic fallback) calculates semantic similarity. If similarity is high, the report is merged as a community upvote, preventing authority spam.
   * Otherwise, the **Grok API** multi-modal vision and text engine evaluates the submission, calculates a **Severity Score (1-100)**, and synthesizes a 1-sentence **AI Executive Summary**.
3. **Automated Agency Routing Engine:**
   * Based on category, GPS coordinates, and the DMB-direct toggle, the engine assigns the report to the corresponding authority:
     * **Disaster Management Board (DMB):** Floods, major structural failures, missing manhole covers, and Direct DMB Dispatch toggles.
     * **City Corporations (DNCC / DSCC / GCC):** Damaged asphalt, street lighting, municipal maintenance.
     * **Dhaka Metropolitan Police (DMP / Law Enforcement):** Active snatching and robbery hotspots.
4. **Interactive Map Publication & Danger Zone Alerts:**
   * The new report is immediately published on the interactive map. Commuters navigating nearby receive real-time danger warnings.
5. **Community Verification & Trust Score Evolution:**
   * Citizens can upvote or confirm reports ("I saw this too"). Each confirmation increases the report's `ai_trust_score`, ensuring the map remains trustworthy and self-cleansing.
6. **Authority Resolution Tracking:**
   * Agency officials log into the Authority Command Center, review the AI summary, and update the lifecycle status: `Received` -> `Under Verification` -> `Assigned to Authority` -> `In Progress` -> `Resolved` (with mandatory after-repair photo evidence).

---

## 3. Database Architecture & PostgreSQL Optimization

Nirapod's relational schema is optimized for **PostgreSQL** with high-throughput spatial indexing:
* **Table Structures:**
  * `users` and `authority_agencies`: Maintain role-based access control and contact information for DMB, DNCC, DSCC, and DMP.
  * `reports`: Stores geo-coordinates (`latitude`, `longitude`), category, severity scores, trust scores, and lifecycle timestamps.
  * `report_verifications` and `report_comments`: Track community consensus and real-time updates.
  * `sos_alerts`: Stores emergency triggers and live tracking data.
* **Indexing Strategy:**
  * Composite B-Tree index on `(latitude, longitude)` for sub-millisecond bounding-box map queries.
  * Compound index on `(status, assigned_authority_id)` to power real-time agency command dashboards.
  * Partial index on `is_dmb_direct = TRUE` for instant polling by the Disaster Management Board.

---

## 4. How Reports Reach Authorities

Nirapod eliminates bureaucratic friction by providing four direct notification channels:
1. **Authority Dashboard Command Center:** Officials have dedicated views filtering reports assigned to their agency code (`DMB`, `DNCC`, `DSCC`, `DMP`), sorted by AI Severity Score.
2. **Direct DMB Dispatch Pipeline:** When a citizen toggles "Direct DMB Dispatch", the submission bypasses standard municipal queues and is flagged with a high-priority red badge in the Disaster Management Board's operational queue.
3. **Emergency SOS Integration:** Triggering an SOS instantly broadcasts GPS coordinates and alert metadata to National Emergency Service 999 and the DMB Helpline 1090.
4. **Lifecycle Transparency:** Citizens track their report's progress from submission to resolution, viewing official repair notes and after-repair evidence.

---

## 5. Security & Performance Considerations

* **Rate Limiting & Duplicate Prevention:** Multi-tier rate limiting and AI embedding deduplication prevent denial-of-service or spam floods.
* **Data Validation:** Rigorous Pydantic v2 schemas on all backend REST endpoints prevent malformed payloads or SQL injection.
* **Environment Portability:** Fully configurable via environment variables (`DATABASE_URL`, `GROK_API_KEY`, `VOYAGE_API_KEY`), supporting both production PostgreSQL and zero-config local SQLite testing.
