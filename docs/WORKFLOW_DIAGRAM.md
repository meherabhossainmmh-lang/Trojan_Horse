# Nirapod — Workflow Diagrams & Operational Pipelines

This document details the operational workflows of the **Nirapod** platform, illustrating how data flows from citizen submission to authority resolution, community verification, and emergency SOS handling.

---

## 1. Automated Hazard & Crime Hotspot Reporting Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen / Commuter
    participant UI as Next.js 14 Frontend
    participant API as FastAPI Backend
    participant AI as AI Engine (Grok / Voyage)
    participant DB as PostgreSQL Database
    participant Auth as Authority Agency (DMB / DNCC / DMP)

    Citizen->>UI: Selects Location on Map, Uploads Photo & Description
    UI->>API: POST /api/reports (Multipart/JSON payload)
    API->>DB: Query nearby reports within 100m radius
    DB-->>API: Return nearby report list
    
    API->>AI: Analyze Hazard (Description + Photo + Nearby Reports)
    AI-->>API: Return Severity Score (1-100), Category, AI Summary, Duplicate Status
    
    alt Is Duplicate Report
        API->>DB: Increment upvote/confirmation on existing report
        API-->>UI: 200 OK (Merged with existing verified report)
    else Is New Unique Hazard
        API->>API: Execute Automated Agency Routing Rule
        API->>DB: INSERT Report (Status: Received, Assigned Agency ID)
        API-->>UI: 201 Created (Report published on Interactive Map)
        API->>Auth: Notify assigned authority dashboard in real-time
    end
```

---

## 2. Direct Disaster Management Board (DMB) Dispatch Workflow

The Problem Statement specifically requires users to be able to send a picture of a hazard along with a short written description straight to the **Disaster Management Board (DMB)** so damaged infrastructure gets flagged with clear visual and contextual evidence.

```
[ Citizen Toggles "Direct DMB Dispatch" ]
                  |
                  v
[ Captures Photo + Coordinates + Short Description ]
                  |
                  v
[ Backend AI Evaluates Structural/Emergency Severity ]
                  |
                  +-----------------------------------+
                  |                                   |
                  v                                   v
    [ Flagged as High Priority ]            [ Attached Visual & Context Proof ]
                  |                                   |
                  +-----------------+-----------------+
                                    |
                                    v
     [ DIRECT DISPATCH: Bypasses Standard Municipal Queue ]
                                    |
                                    v
     [ Assigned Directly to Disaster Management Board (DMB 1090) ]
                                    |
                                    v
     [ Authority Dashboard Displays Alert with Red Urgent Badge ]
```

---

## 3. One-Tap Emergency SOS Command Workflow

```mermaid
stateDiagram-v2
    [*] --> SOS_Triggered: User taps Emergency SOS button
    SOS_Triggered --> Location_Acquired: Fetch live GPS coordinates (Lat/Lng)
    Location_Acquired --> Alert_Broadcasted: POST /api/sos (Emergency Payload)
    
    state Alert_Broadcasted {
        [*] --> Notify_Dispatch: Send alert to Police (999) & DMB (1090)
        [*] --> Activate_Siren: Trigger audio/visual alert on user device
        [*] --> Log_Database: Record timestamped SOS in PostgreSQL
    }
    
    Alert_Broadcasted --> Live_Tracking: User shares live coordinates
    Live_Tracking --> SOS_Resolved: User or Authority marks SOS as Resolved
    SOS_Resolved --> [*]
```

---

## 4. Community Verification & Trust Score Lifecycle

To maintain trustworthy and current information, Nirapod incorporates a community consensus mechanism that dynamically updates a report's `ai_trust_score`.

```
                        +-------------------------------+
                        |    NEW REPORT SUBMITTED       |
                        |      Initial Score: 50        |
                        +---------------+---------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
       [ COMMUNITY CONFIRMS ]                         [ COMMUNITY FLAGS ]
   User clicks "I saw this too"                    User clicks "False Report"
                 |                                             |
                 v                                             v
     +-----------------------+                     +-----------------------+
     | Trust Score Increases |                     | Trust Score Decreases |
     |  Score = Score + 10   |                     |  Score = Score - 15   |
     +-----------+-----------+                     +-----------+-----------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
                                        v
                        +-------------------------------+
                        |   TRUST SCORE EVALUATION      |
                        +---------------+---------------+
                                        |
            +---------------------------+---------------------------+
            |                           |                           |
            v                           v                           v
   [ Score >= 80 ]             [ Score 40 to 79 ]          [ Score <= 25 ]
   VERIFIED COMMUNITY          UNDER VERIFICATION          AUTOMATICALLY FLAGGED
   High-priority badge         Standard map display        Hidden from main view
   displayed on map            and authority queue         pending admin review
```
