# Nirapod — Role-Based User Flow Diagrams

This document outlines the end-to-end user journeys in **Nirapod** across four official authentication roles: Guest, Citizen, Authority Admin, and Super Admin.

---

## 1. Guest Journey: Read-Only Public Map & Safe Route Exploration

```mermaid
graph TD
    A[Guest Opens Nirapod App] --> B[View Interactive Map, Pins & Proximity Alerts]
    B --> C{Action Choice}
    C -->|Search / Filter Reports| D[View Public Report Evidence & Comments]
    C -->|Check Safe Route| E[Open AI Route Safety Advisor]
    C -->|Click '+ Report Hazard' or 'SOS'| F[Prompted with Login / Register Modal]
```

---

## 2. Citizen Journey: Registration, Hazard Reporting & Emergency SOS

```mermaid
graph TD
    A[Citizen Logs In / Registers] --> B[JWT Token Issued & Stored in Session]
    B --> C{Citizen Actions}
    C -->|Submit Report| D[Form captures Lat/Lng, Photo & logged-in user_id]
    C -->|Community Consensus| E[Click 'I saw this too' or post comment]
    C -->|Emergency Danger| F[Activate SOS -> Alert DMP 999 & City Corp]
    C -->|Profile Management| G[Update Full Name & Phone Number]
```

---

## 3. Authority Admin Journey: Organization Queue & SOS Citizen Checkup

```mermaid
graph TD
    A[Authority Official Logs In e.g. DMB / DNCC / DSCC / DMP] --> B[Open Authority Command Center]
    B --> C[Queue Automatically Filters to Assigned Agency Code]
    C --> D{Authority Actions}
    D -->|Update Lifecycle| E[Move Status: Submitted -> In Progress -> Resolved]
    E --> F[Attach Mandatory After-Repair Photo Proof & Engineering Notes]
    D -->|SOS Oversight| G[Send Real-Time Safety Checkup Prompt to Citizen]
```

---

## 4. Super Admin Journey: Platform Governance & Authority Account Management

```mermaid
graph TD
    A[Super Admin Logs In superadmin@nirapod.bd] --> B[Access Super Admin Control Center]
    B --> C{Governance Actions}
    C -->|Create Authority| D[Register new agency account DMB / DNCC / DSCC / DMP]
    C -->|User Management| E[Activate or Deactivate User / Authority accounts]
    C -->|Audit Logs| F[Monitor real-time system activity & telemetry logs]
    C -->|Manual Assignment| G[Re-assign hazard reports across authority agencies]
```
