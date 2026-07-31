# Nirapod — User Flow Diagrams

This document outlines the end-to-end user journeys in **Nirapod** across four primary personas: Commuters, Vulnerable Citizens, Community Verifiers, and Government Authorities.

---

## 1. Commuter Journey: Interactive Map & Route Safety Advisor

```mermaid
graph TD
    A[Commuter Opens Nirapod App] --> B[View Live Bangladesh Map & Danger Pins]
    B --> C{Action Choice}
    C -->|Check Safe Route| D[Open AI Route Safety Advisor]
    C -->|Enter High-Risk Zone| E[Receive Automated Danger Zone Alert]
    D --> F[Select Origin e.g. Gazipur & Destination e.g. Uttara]
    F --> G[AI Evaluates Route Risk Score & Hotspot Density]
    G --> H[Display Safer Commute Recommendation]
```

---

## 2. Citizen Reporting Journey: Instant Hazard & Direct DMB Dispatch

```mermaid
graph TD
    A[Citizen Encounters Hazard or Crime Hotspot] --> B[Click 'Report Hazard' Button]
    B --> C[Select Location on Interactive Map / Use GPS]
    C --> D[Upload Photo & Enter Title/Description]
    D --> E{Toggle Direct DMB Dispatch?}
    E -->|YES - High Priority Municipal Hazard| F[Flag as Direct DMB Report]
    E -->|NO - Standard Flow| G[Standard Category Classification]
    F --> H[Submit Report]
    G --> H
    H --> I[Backend AI Multi-Modal Evaluation]
    I --> J{Is Duplicate in 100m?}
    J -->|YES| K[Merge & Add Community Upvote]
    J -->|NO| L[Publish Pin on Map & Assign to Authority]
```

---

## 3. Vulnerable Citizen Journey: One-Tap Emergency SOS

```
[ Citizen in Emergency / Robbery Danger ]
                 |
                 v
   [ Taps Emergency SOS Header Button ]
                 |
                 v
+----------------+----------------+
|  EMERGENCY COMMAND MODAL OPENS  |
+----------------+----------------+
                 |
                 +--------------------------------+--------------------------------+
                 |                                |                                |
                 v                                v                                v
     [ Audio/Visual Siren Active ]      [ Live GPS Location Broadcast ]     [ Quick Call 999 / 1090 ]
                 |                                |                                |
                 +--------------------------------+--------------------------------+
                                                  |
                                                  v
                              [ Authority Dashboard Flashes SOS Banner ]
```

---

## 4. Government Authority Journey: Resolution Tracking & Management

```mermaid
graph TD
    A[Official Logs into Authority Command Center] --> B[Filter Assigned Reports by Agency DMB/DNCC/DMP]
    B --> C[Select Urgent Report from Queue]
    C --> D[Review AI Executive Summary & Photo Evidence]
    D --> E[Update Status: Under Verification -> In Progress]
    E --> F[Deploy Field Repair / Police Team]
    F --> G[Upload After-Repair Evidence Photo & Notes]
    G --> H[Mark Status: Resolved]
    H --> I[Public Map Updates Status to Resolved in Green]
```
