# Nirapod — System Architecture & Technical Design

## 1. High-Level Architectural Overview

Nirapod is structured as a modern, decoupled cloud application composed of three primary layers:
1. **Presentation & Interactive Geospatial Layer:** Built with Next.js 14 (App Router, TypeScript, Tailwind CSS, and React-Leaflet / OpenStreetMap).
2. **Application & AI Microservices Layer:** Built with Python 3.11+ and FastAPI, leveraging Pydantic v2 schemas, asynchronous REST endpoints, and integrated AI services (Grok API, Voyage AI, and local smart heuristics).
3. **Data Persistence & Geospatial Indexing Layer:** Designed around PostgreSQL with SQLAlchemy 2.0 ORM, optimized indexing for geographic coordinates and trust scoring, and SQLite fallback for frictionless local execution.

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
        UI_Advisor["AI Route Safety Advisor"]
    end

    subgraph APILayer ["FastAPI Core Gateway (Python 3.11+)"]
        API_Router["FastAPI REST Router"]
        Auth_Service["Auth & Session Manager"]
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
        DB_Users[(Users & Authorities Table)]
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
    UI_Advisor <-->|REST / JSON| API_Router

    API_Router --> Auth_Service
    API_Router --> Geo_Service
    API_Router --> Route_Service
    API_Router --> SOS_Service

    Route_Service --> AI_Vision
    Route_Service --> AI_Embed
    UI_Advisor --> AI_Risk
    AI_Vision -.- AI_Fallback
    AI_Embed -.- AI_Fallback

    Geo_Service <--> DB_Reports
    Route_Service <--> DB_Reports
    Route_Service <--> DB_AI
    SOS_Service <--> DB_SOS
    Auth_Service <--> DB_Users
    API_Router <--> DB_Verifications
```

### ASCII System Architecture Breakdown

```
+---------------------------------------------------------------------------------------+
|                              CLIENT / BROWSER (Next.js 14)                            |
|  +---------------------+   +----------------------+   +----------------------------+  |
|  | Interactive Map UI  |   |  Direct DMB Dispatch |   |  One-Tap Emergency SOS     |  |
|  +---------------------+   +----------------------+   +----------------------------+  |
|  +---------------------+   +----------------------+   +----------------------------+  |
|  | AI Route Advisor    |   | Community Feed/Verify|   |  Authority Resolution Grid |  |
|  +---------------------+   +----------------------+   +----------------------------+  |
+------------------------------------------+--------------------------------------------+
                                           |  HTTP REST (JSON / Multipart)
                                           v
+---------------------------------------------------------------------------------------+
|                         APPLICATION SERVER (Python FastAPI)                           |
|                                                                                       |
|  +--------------------+  +---------------------+  +--------------------------------+  |
|  |  Reports Endpoint  |  |   AI Service Layer  |  | Automated Agency Routing Engine|  |
|  +--------------------+  +---------------------+  +--------------------------------+  |
|  +--------------------+  +---------------------+  +--------------------------------+  |
|  |   SOS Endpoints    |  |  Verification Engine|  | Authority Dashboard Endpoints  |  |
|  +--------------------+  +---------------------+  +--------------------------------+  |
+------------------+-----------------------+------------------------+-------------------+
                   |                       |                        |
                   v                       v                        v
+-----------------------+     +------------------------+     +--------------------------+
|  AI EXTERNAL SERVICES |     | POSTGRESQL / SQLALCHEMY|     | EXTERNAL NOTIFICATIONS   |
|  - Grok API (Vision)  |     | - Reports (Lat/Lng)    |     | - Disaster Mgmt Board    |
|  - Voyage AI (Embeds) |     | - Users & Authorities  |     | - City Corporations      |
|  - Smart Local Engine |     | - SOS Logs & Comments  |     | - Law Enforcement / 999  |
+-----------------------+     +------------------------+     +--------------------------+
```

---

## 3. Component Details & Design Responsibilities

### 3.1 Frontend Presentation Layer (Next.js 14)
* **Framework:** Next.js 14 with App Router, TypeScript, and Tailwind CSS.
* **Geospatial Visualization:** Leaflet / React-Leaflet with custom interactive SVG/HTML markers for different hazard categories (`Robbery`, `Snatching`, `Damaged Road`, `Open Drain`, `Missing Manhole Cover`, `Waterlogging`, `Poor Lighting`).
* **Client-Side State:** React Hooks and state management for real-time filtering, alert triggers, and seamless modal dialogs.
* **Performance:** Static generation for shell layouts, dynamic client-side hydration for Leaflet maps, and responsive mobile-first design.

### 3.2 Backend Core & API Layer (Python FastAPI)
* **Framework:** FastAPI with Pydantic v2 schemas for high-speed validation and automated OpenAPI (`/docs`) generation.
* **ORM:** SQLAlchemy 2.0 with asynchronous pattern support, abstracting database connectivity and allowing connection pooling.
* **Agency Routing Engine:** Evaluates report metadata (category, GPS location, DMB-direct toggle, AI severity) and automatically assigns the report to the corresponding authority agency.

### 3.3 AI Intelligence Micro-Layer
* **AI Vision & Text Analyzer:** Receives photo URLs/base64 and descriptions; uses Grok API (with simple fallback to keyword and heuristic severity models) to compute severity scores and executive summaries.
* **Duplicate Detection:** Calculates distance vectors (Haversine formula within 100 meters) combined with text similarity to detect duplicate reports and merge community upvotes.
* **Route Risk Prediction:** Evaluates geographic polygon risks across Dhaka and Gazipur neighborhoods, returning a synthesized safety advisory for commuters.

### 3.4 Data Persistence (PostgreSQL)
* **Schema Optimization:** Structured PostgreSQL schema with indexed latitude and longitude columns (`idx_report_coords`), category indexes, and timestamp indices for sub-millisecond query execution.
* **Portability:** Configured via `DATABASE_URL` environment variable, supporting both PostgreSQL in production and SQLite for instant local hackathon demonstration.
