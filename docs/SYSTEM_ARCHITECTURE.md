# Nirapod — System Architecture & Technical Design

## 1. High-Level Architectural Overview

Nirapod is structured as a modern, decoupled cloud application composed of four primary layers:
1. **Presentation & Interactive Geospatial Layer:** Built with Next.js 14 (App Router, TypeScript, Tailwind CSS, and React-Leaflet / OpenStreetMap).
2. **Role-Based Security & Authentication Layer:** JWT-based stateless authentication with direct bcrypt password hashing and Role-Based Access Control (`Guest`, `Citizen`, `Authority Admin`, `Super Admin`).
3. **Application & AI Microservices Layer:** Built with Python 3.11+ and FastAPI, leveraging Pydantic v2 schemas, asynchronous REST endpoints, and integrated AI services (Grok API, Voyage AI, and local smart heuristics).
4. **Data Persistence & Geospatial Indexing Layer:** Designed around PostgreSQL with SQLAlchemy 2.0 ORM, optimized indexing for geographic coordinates and trust scoring, and SQLite fallback for frictionless local execution.

---

## 2. System Architecture Diagram (Mermaid & ASCII)

```mermaid
graph TD
    subgraph ClientLayer ["Client & Geospatial UI Layer (Next.js 14)"]
        UI_Map["Interactive Map (Leaflet)"]
        UI_Report["Hazard & Crime Reporting Modal"]
        UI_SOS["One-Tap SOS & Emergency Command"]
        UI_Verify["Community Feed & Verification"]
        UI_Admin["Authority Command Center"]
        UI_Super["Super Admin Control Center"]
        UI_Auth["Authentication & Profile Modals"]
    end

    subgraph APILayer ["FastAPI Core Gateway (Python 3.11+)"]
        API_Router["FastAPI REST Router"]
        Auth_Service["JWT Auth & Role Guard"]
        Geo_Service["Geospatial Filtering & Alerting"]
        Route_Service["Automated Agency Dispatcher"]
        SOS_Service["Emergency Alerting Service"]
    end

    subgraph AILayer ["AI Intelligence Pipeline (Multi-Modal & NLP)"]
        AI_Vision["AI Hazard Analyzer (Grok API Vision / NLP)"]
        AI_Embed["Semantic Duplicate Detector (Voyage AI)"]
        AI_Risk["AI Route Risk Assessment Engine"]
        AI_Fallback["Local Heuristic & Rule-Based Engine"]
    end

    subgraph DataLayer ["Data & Persistence Layer (PostgreSQL)"]
        DB_Users[(Users, Authorities & Roles Table)]
        DB_Reports[(Reports & Geospatial Index)]
        DB_Verifications[(Community Verification Table)]
        DB_SOS[(SOS Alerts & Logs)]
        DB_AI[(AI Analysis Audit Log)]
    end

    UI_Map <-->|REST / JSON| API_Router
    UI_Report <-->|REST / Multipart| API_Router
    UI_SOS <-->|REST / Live GPS| API_Router
    UI_Verify <-->|REST / JSON| API_Router
    UI_Admin <-->|REST / JSON| API_Router
    UI_Super <-->|REST / JSON| API_Router
    UI_Auth <-->|REST / JSON| API_Router

    API_Router --> Auth_Service
    API_Router --> Geo_Service
    API_Router --> Route_Service
    API_Router --> SOS_Service

    Route_Service --> AI_Vision
    Route_Service --> AI_Embed
    AI_Vision -.- AI_Fallback
    AI_Embed -.- AI_Fallback

    Geo_Service <--> DB_Reports
    Route_Service <--> DB_Reports
    SOS_Service <--> DB_SOS
    Auth_Service <--> DB_Users
    API_Router <--> DB_Verifications
```

---

## 3. Role-Based Access Control (RBAC) Specification

Nirapod enforces strict permission boundaries across four official roles:

```
+---------------------------------------------------------------------------------------------------+
| 1. GUEST               | Read-only access. Can view interactive map, public reports, and search.  |
|                        | Cannot submit reports, comment, verify, use SOS, or access dashboards.   |
+---------------------------------------------------------------------------------------------------+
| 2. CITIZEN             | Authenticated citizen. Can submit hazard/crime reports, comment, verify  |
|                        | reports, activate Emergency SOS, and update profile. Automatically       |
|                        | links logged-in user ID and name to submitted reports.                   |
+---------------------------------------------------------------------------------------------------+
| 3. AUTHORITY ADMIN     | Organization accounts for DMB, DNCC, DSCC, and DMP. Can view reports     |
|                        | assigned to their agency, update lifecycle status, attach after-repair   |
|                        | photo proof, and check up on citizen SOS alerts.                         |
+---------------------------------------------------------------------------------------------------+
| 4. SUPER ADMIN         | Full platform access. Can create/activate/deactivate authority accounts, |
|                        | manage all users, view audit activity logs, and manually assign reports. |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Component Details & Design Responsibilities

### 4.1 Frontend Presentation Layer (Next.js 14)
* **Framework:** Next.js 14 with App Router, TypeScript, and Tailwind CSS.
* **Authentication UI:** Comprehensive `AuthModal` supporting JWT Sign In, Citizen Registration, Password Recovery, and 1-Click Quick Demo Hackathon Accounts.
* **Geospatial Visualization:** Leaflet / React-Leaflet with custom interactive SVG/HTML markers for different hazard categories.

### 4.2 Backend Core & Security Layer (Python FastAPI)
* **Framework:** FastAPI with Pydantic v2 schemas for validation and OpenAPI (`/docs`) generation.
* **Security:** Stateless JWT bearer tokens (`pyjwt`) with direct bcrypt password hashing (`bcrypt.hashpw`).
* **ORM:** SQLAlchemy 2.0 with PostgreSQL optimization and SQLite local fallback.
