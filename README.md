# Nirapod Path (Safe Path) — Community Safety & Hazard Reporting Platform

> A web platform empowering citizens of Dhaka to report crime hotspots and infrastructure hazards in real time, route them to the right authority, and track resolution — built for [Hackathon Name] under Problem Statement 2.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Frontend & Backend: Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014-black?logo=next.js)](https://nextjs.org)
[![Database: Neon Postgres + Drizzle](https://img.shields.io/badge/Database-Neon%20%7C%20Drizzle-316192?logo=postgresql)](https://neon.tech)
[![Realtime: Pusher](https://img.shields.io/badge/Realtime-Pusher-6366F1)](https://pusher.com)
[![Storage: EdgeStore](https://img.shields.io/badge/Storage-EdgeStore-009688)](https://edgestore.dev)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Core Features](#core-features)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Report Status Lifecycle](#report-status-lifecycle)
6. [Tech Stack](#tech-stack)
7. [System Architecture](#system-architecture)
8. [Data Flow](#data-flow)
9. [Database Schema](#database-schema)
10. [Realtime Strategy](#realtime-strategy)
11. [Danger Zone Alerts](#danger-zone-alerts)
12. [Project Structure](#project-structure)
13. [Environment Variables](#environment-variables)
14. [Getting Started](#getting-started)
15. [Hidden Hackathon Demo Mode (`/demo`)](#hidden-hackathon-demo-mode-demo)
16. [Deliverables Checklist & Hackathon Docs](#deliverables-checklist--hackathon-docs)

---

## Problem Statement

Citizens across Bangladesh face preventable safety risks daily — robberies, snatching, uncovered manholes, and damaged roads — with no single platform to report these hazards in real time or warn others before they become victims. Reports posted informally on social media rarely reach the responsible authority, leaving dangerous locations unaddressed for long periods.

**The challenge:** design and build a web application that empowers citizens to report crime and infrastructure hazards in real time, helps others avoid danger before it finds them, and gives authorities a structured channel to act on verified reports.

## Solution Overview

Nirapod Path is a three-panel web platform connecting citizens, city management teams, and city corporations in a single accountability chain:

- **Citizens** report crime hotspots and infrastructure hazards on an interactive map, with photo evidence and GPS location. (Citizen sign-in is **100% optional** so anyone can report danger immediately).
- **Management panels** (one per City Corporation) review and resolve reports.
- **City Corporation panels** hold final authority — they can move a report to any status, add remarks, and issue the final **verified** stamp, giving the public a trustworthy, government-backed confirmation.

Every report is scoped to the City Corporation the citizen selects (`DNCC`, `DSCC`, `DMB`), so only the relevant authority sees and acts on it — mirroring how real municipal accountability works.

## Core Features

| #   | Feature                               | Description                                                                                                                        |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Interactive hotspot map**           | Citizens mark robbery/snatching-prone locations on an OpenStreetMap-based map.                                                     |
| 2   | **Danger zone alerts**                | Live geolocation tracking warns users client-side when they approach a reported hotspot (`<ProximityAlert />`).                    |
| 3   | **Instant hazard reporting**          | Photo upload (`EdgeStore` / preset) + auto-captured GPS + description, pinned to the map.                                         |
| 4   | **Authority routing**                 | Reports are scoped to a selected City Corporation and appear directly on that authority's dashboard — no manual forwarding needed. |
| 5   | **Status tracking**                   | Every report moves through a clear lifecycle, visible to the reporter at all times.                                                |
| 6   | **Community verification**            | Other users can upvote/confirm existing reports to keep information current and trustworthy.                                       |
| 7   | **Emergency SOS**                     | One-tap button shares live GPS location and instantly alerts the relevant authority dashboard via **Pusher Realtime**.             |
| 8   | **Three-panel accountability system** | User → Management → City Corporation, each with clearly scoped powers.                                                             |

## User Roles & Permissions

| Action                                     | Guest (Unauthenticated) | Citizen (Logged-in) | Management (DNCC/DSCC) | City Corporation / Police | Super Admin |
| ------------------------------------------ | :--: | :--: | :---------: | :--------------: | :---------: |
| View public Hotspot Map &amp; reports      |  ✅  |  ✅  |     ✅      |        ✅        |     ✅      |
| Register / log in                          |  ✅  |  ✅  |  ✅ (seeded) |    ✅ (seeded)   |  ✅ (seeded) |
| Create a report / trigger Emergency SOS    |  ✅  |  ✅  |     ❌      |        ❌        |     ✅      |
| View personal Citizen Dashboard            |  ❌  |  ✅  |      —      |        —         |     ✅      |
| View reports for their assigned Agency     |  ❌  |  ❌  |     ✅      |        ✅        |     ✅      |
| Set status: `under_review → resolved`      |  ❌  |  ❌  |     ✅      |        ✅        |     ✅      |
| Set status to **any** value, any direction |  ❌  |  ❌  |     ❌      |        ✅        |     ✅      |
| Add / edit official status remark          |  ❌  |  ❌  |     ❌      |        ✅        |     ✅      |
| Create/activate/deactivate User accounts   |  ❌  |  ❌  |     ❌      |        ❌        |     ✅      |

**Key rule:** Users never manually choose their role during login. When an account authenticates on `/login` or `/admin/login`, Nirapod Path automatically determines their role and routes them to their dedicated dashboard (`/user/dashboard`, `/management/[id]/reports`, `/city-corp/[id]/reports`, or `/super-admin`).

## Report Status Lifecycle

```
             ┌──────────────┐
   created → │ under_review │ ←───────────────┐
             └──────┬───────┘                 │
                     │ Management or           │ City Corp
                     │ City Corp                │ can revert
                     ▼                          │ any status
             ┌──────────────┐                  │ back here
             │   resolved   │ ─────────────────┘
             └──────┬───────┘
                     │ City Corp only
                     ▼
             ┌──────────────┐
             │   verified   │
             └──────────────┘
```

- New reports are created with status **`under_review`** by default.
- **Management** may only perform `under_review → resolved`.
- **City Corporation** may set the status to any of the three values, from any current value — including sending a `resolved` or `verified` report back to `under_review` (e.g. "poor work, redo") for Management to act on again.
- An optional **status remark** (e.g. *"Good work"* / *"Poor work, do it again"*) can be attached only by City Corporation, and is overwritten on each update.

## Tech Stack

| Layer              | Choice                                            | Reasoning                                                                                                                                                                  |
| ------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | **Next.js (latest, App Router + Server Actions)** | Single codebase for frontend + backend, fast to build and deploy                                                                                                           |
| Map                | **Leaflet.js + OpenStreetMap**                    | Free, no API key, no billing risk                                                                                                                                          |
| Database           | **Neon (Postgres)**                               | Serverless Postgres, generous free tier (`DATABASE_URL`)                                                                                                                   |
| ORM                | **Drizzle ORM**                                   | Lightweight, type-safe, fast to iterate under time pressure                                                                                                                |
| File storage       | **EdgeStore**                                     | Purpose-built for Next.js, simple SDK, free tier (`EDGE_STORE_ACCESS_KEY` / `SECRET`)                                                                                      |
| Authentication     | **Custom — Server Actions + httpOnly cookies**    | No third-party auth dependency; passwords hashed (`bcryptjs`)                                                                                                              |
| Realtime (SOS)     | **Pusher (free tier)**                            | Vercel serverless can't hold long-lived connections; Pusher offloads persistent connections (`city-corp-{id}-alerts`)                                                      |
| Danger zone alerts | **Browser Geolocation API (client-side only)**    | No server/infra needed — pure client-side Haversine distance calculation                                                                                                   |
| Hosting            | **Vercel**                                        | Native Next.js support, zero-config deploys                                                                                                                                |

**No paid APIs are required anywhere in this stack.** All services used (Neon, EdgeStore, Pusher, Vercel) have free tiers sufficient for a hackathon demo. Even if environment variables are left blank, Nirapod Path automatically falls back to client/memory demo mode!

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App (Vercel)                   │
│                                                                 │
│   ┌───────────┐   ┌───────────────┐   ┌───────────────────┐  │
│   │ User Panel │   │ Management     │   │ City Corporation   │  │
│   │            │   │ Panel          │   │ Panel               │  │
│   └─────┬─────┘   └───────┬───────┘   └──────────┬──────────┘  │
│         │                   │                       │            │
│         └───────────────────┼───────────────────────┘            │
│                              │                                    │
│                    Server Actions Layer                          │
│              (auth, report CRUD, status updates)                 │
│                              │                                    │
│           ┌──────────────────┼──────────────────┐                │
│           ▼                  ▼                  ▼                │
│    ┌────────────┐   ┌───────────────┐   ┌────────────────┐      │
│    │   Neon DB   │   │  EdgeStore     │   │  Pusher (SOS)   │      │
│    │  (Drizzle)  │   │ (photo upload) │   │   trigger/sub   │      │
│    └────────────┘   └───────────────┘   └────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

**Hazard / hotspot report submission:**
```
User fills form (photo + auto-GPS + description + selects City Corp)
   → Server Action uploads photo to EdgeStore
   → Server Action writes report row to Neon (status: under_review)
   → Report appears immediately on the map (all users)
   → Report appears on the relevant City Corp's Management + City Corp dashboards
```

**Status update:**
```
Management/City Corp changes status via dashboard
   → Server Action validates role-based permission
   → Updates report row (status, status_comment if City Corp)
   → User's own report list reflects new status on next fetch
```

**SOS emergency:**
```
User taps SOS → browser captures live GPS
   → Server Action writes SOS event to Neon
   → Server Action triggers Pusher event on `city-corp-{id}-alerts` channel
   → City Corp dashboard (subscribed client-side) shows instant alert + location
```

## Database Schema

```
city_corporations
├── id
├── name                    -- e.g. "Dhaka North City Corporation"
└── created_at

users
├── id
├── role                    -- 'user' | 'management' | 'city_corp' | 'super_admin'
├── city_corporation_id     -- nullable; set for management & city_corp roles
├── email
├── password_hash
└── created_at

reports
├── id
├── user_id                 -- reporter
├── city_corporation_id     -- selected authority scope
├── type                    -- 'hazard' | 'crime_hotspot'
├── status                  -- 'under_review' | 'resolved' | 'verified' (default: under_review)
├── status_comment          -- nullable, City Corp only, overwritten on each edit
├── photo_url
├── lat
├── lng
├── description
├── created_at
└── updated_at

report_votes
├── id
├── report_id
├── user_id                 -- one vote per user per report
└── created_at

sos_alerts
├── id
├── user_id
├── city_corporation_id
├── lat
├── lng
└── created_at
```

## Realtime Strategy

Only **one** feature in this platform genuinely requires server-pushed realtime updates: **SOS alerts to the City Corporation dashboard.** Every other "live" feature is handled without server push:

| Feature                              | Mechanism                                              | Why                                                                                    |
| ------------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| SOS → authority dashboard            | **Pusher** (trigger on submit, subscribe on dashboard) | Needs true server → client push; Vercel serverless rules out self-hosted SSE/WebSocket |
| Danger zone proximity alerts         | Client-side `watchPosition()` + distance check         | Pure math against already-fetched hotspot data — no backend involvement needed         |
| Status updates on user's own reports | Refetch on page load/focus                             | Not time-critical for the reporter; avoids extra infra                                 |

## Danger Zone Alerts

Implemented entirely client-side:

1. On consent, `navigator.geolocation.watchPosition()` tracks the user's live position.
2. Hotspot coordinates are fetched once (or refreshed periodically) from the database.
3. On each position update, a Haversine distance calculation checks proximity against every hotspot.
4. If the user falls within a defined radius (e.g. 100m) of a hotspot, an in-app toast/banner warns them — no server round-trip required.

## Project Structure

```
/app
  /(public)
    /login                -- Dedicated Citizen Authentication Portal (`/login`)
    /register             -- Dedicated Citizen Registration Portal (`/register`)
  /admin
    /login                -- Official Government Authority & Super Admin Portal (`/admin/login`)
  /demo                   -- Hidden Hackathon Quick-Login Sandbox (`/demo`)
  /user
    /dashboard            -- Citizen Dashboard (My Reports, SOS History, Profile)
    /report/new           -- Report submission form
    /reports              -- Submitted reports list & community verification
    /map                  -- Public interactive hotspot map
  /management
    /[cityCorpId]/reports -- Management review queue (`under_review -> resolved`)
  /city-corp
    /[cityCorpId]/reports -- City Corporation control room (`under_review`, `resolved`, `verified`)
    /[cityCorpId]/alerts  -- Realtime Pusher SOS emergency control room
  /super-admin            -- Super Admin platform governance dashboard
  /api
    /pusher-auth          -- Pusher private channel auth
    /edgestore            -- EdgeStore API endpoint
/actions
  auth.ts
  reports.ts
  status.ts
  sos.ts
/db
  schema.ts               -- Drizzle schema
  index.ts
  seed.ts
/lib
  pusher.ts
  edgestore.ts
  edgestore-server.ts
  geolocation.ts
  ai.ts
/components
  Map/
  ReportForm/
  ReportList/
  StatusBadge/
  SOSButton/
  Navigation/
  ProximityAlert/
  RouteAdvisor/
```

## Environment Variables

Copy `.env.example` to `.env` in the project root and insert your tokens:

```env
# --- 1. AI API KEYS (Groq / Grok & Voyage AI) ---
GROK_API_KEY="INSERT_YOUR_GROK_API_KEY_HERE"
GROK_API_BASE_URL="https://api.x.ai/v1"
GROK_MODEL="grok-beta"
VOYAGE_API_KEY="INSERT_YOUR_VOYAGE_API_KEY_HERE"
VOYAGE_MODEL="voyage-2"

# --- 2. NEON / POSTGRES DATABASE URL ---
DATABASE_URL=                      # Neon Postgres connection string (or leave blank for demo mode)

# --- 3. EDGESTORE CONFIGURATION (Photo Uploads) ---
EDGE_STORE_ACCESS_KEY=             # EdgeStore Access Key
EDGE_STORE_SECRET_KEY=             # EdgeStore Secret Key

# --- 4. PUSHER CONFIGURATION (Realtime SOS Alerts to City Corporation) ---
PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

# --- 5. AUTH SESSION COOKIE SECRET ---
SESSION_SECRET=super-secret-key-change-in-prod-deployment
```

## Getting Started

```bash
# install dependencies
npm install

# push Drizzle schema to Neon
npm run db:push

# seed City Corporations + Management/City Corp accounts
npm run db:seed

# run locally
npm run dev
```

---

## Hidden Hackathon Demo Mode (`/demo`)

To keep the production navigation bar 100% authentic as an official municipal portal, **all quick demo role cards have been moved to a hidden hackathon evaluation sandbox:**

👉 **[http://localhost:3000/demo](http://localhost:3000/demo)** (or `/demo-login`)

Here, judges can click **"Login as [Role]"** on any card (`Citizen`, `DMB Admin`, `DNCC Admin`, `DSCC Admin`, `Police DMP`, `Super Admin`) to instantly authenticate and be routed directly to that role's dashboard.

---

## Deliverables Checklist & Hackathon Docs

- [x] Working prototype: hotspot map, hazard reporting flow, SOS feature
- [x] Three functional panels: User (`/user/map`), Management (`/management/1/reports`), City Corporation (`/city-corp/1/reports`)
- [x] Status lifecycle enforced by role (`under_review → resolved → verified`, City Corp full control)
- [x] Community upvote/confirm on reports (`<ReportList />`)
- [x] Danger zone proximity alerts (`<ProximityAlert />` & `geolocation.ts`)
- [x] Technical writeup & whitepapers — available in `/docs` folder:
  - [**Project Idea & Executive Summary**](docs/PROJECT_IDEA.md)
  - [**System Architecture & Design**](docs/SYSTEM_ARCHITECTURE.md)
  - [**Workflow Diagrams**](docs/WORKFLOW_DIAGRAM.md)
  - [**Database (ER) Diagram**](docs/DATABASE_ER_DIAGRAM.md)
  - [**AI Pipeline Architecture**](docs/AI_PIPELINE.md)
  - [**3–5 Minute Live Walkthrough Script**](docs/DEMO_WALKTHROUGH.md)
- [x] 3–5 minute demo video / live walkthrough script

---

*Built for [Hackathon Name] — Problem Statement 2: Community-Driven Public Safety Platform.*
