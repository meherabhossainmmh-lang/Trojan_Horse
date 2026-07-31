# Nirapod — Workflow Diagrams & Operational Pipelines

This document details the operational workflows of the **Nirapod** platform, illustrating how data flows from citizen submission to authority resolution, community verification, and inter-agency emergency SOS oversight.

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
        API->>DB: INSERT Report (Status: Submitted, Assigned Agency ID)
        API-->>UI: 201 Created (Report published on Interactive Map)
        API->>Auth: Notify assigned authority dashboard in real-time
    end
```

---

## 2. Direct Disaster Management Board (DMB) Dispatch Workflow

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

## 3. Inter-Agency Emergency SOS Oversight & Cross-Verification Workflow

Nirapod solves police delay and bureaucratic inaction by broadcasting Emergency SOS alerts to **both Metropolitan Police (DMP 999)** and **City Corporations (DNCC / DSCC)** simultaneously. City Corporations act as an oversight agency, monitoring police response and checking on citizen safety in real time.

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Vulnerable Citizen / Student
    participant API as FastAPI Gateway
    participant DMP as Metropolitan Police (999)
    participant DNCC as City Corp Control Room (DNCC / DSCC)

    Citizen->>API: POST /api/sos (Live GPS Broadcast)
    API->>DMP: Alert Police Control Room (dmp_status: "Notified")
    API->>DNCC: Alert City Corp Oversight (city_corp_oversight: "Status Requested")
    
    DNCC->>Citizen: Send In-App Safety Checkup Prompt ("Has Police 999 Arrived?")
    
    alt Police Patrol Arrived & Active
        Citizen->>API: PATCH /user-feedback ("Yes, Police Arrived & Taking Action")
        API->>DNCC: Mark Oversight: "Verified DMP Action"
        API->>DMP: Update dmp_status: "Arrived & Action Taken"
    else Police Delayed / No Response
        Citizen->>API: PATCH /user-feedback ("No, Police Not Arrived Yet — Escalate!")
        API->>DNCC: Mark Oversight: "Escalated to DMP Headquarters"
        DNCC->>DMP: Send Urgent Escalation Alert to DMP Command Room
    end
```

---

## 4. Community Verification & Trust Score Lifecycle

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
