# Nirapod (নিরাপদ) — Real-Time Citizen Public Safety & Hazard Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Frontend: Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)](https://www.postgresql.org)
[![AI: Grok & Voyage](https://img.shields.io/badge/AI-Grok%20%7C%20Voyage-6366F1)](https://x.ai)

> **"Empowering citizens to improve Bangladesh's public safety in real time—and helping others avoid danger before it finds them."**

---

## 1. Executive Summary & Project Idea

In urban centers across Bangladesh—such as Dhaka, Gazipur, and Chattogram—commuters face daily safety hazards ranging from street snatching (*chintai*) and robbery at documented hotspots to open drainage manholes, damaged roads, and waterlogged intersections. While citizens often post photos of these dangers on social media, those fragmented updates rarely reach responsible government agencies in an actionable, verified format.

**Nirapod** (**নিরাপদ** / *Safe*) is an end-to-end, community-driven, AI-empowered platform that bridges this gap. It provides:
* **Interactive Crime Hotspot & Hazard Mapping** with real-time **Danger Zone Alerts** and **Proximity Warnings**.
* **AI Smart Authority Routing** (Disaster Management Board, City Corporations, and Metropolitan Police).
* **Direct Disaster Management Board (DMB) Dispatch** for high-priority infrastructure emergencies.
* **One-Tap Emergency SOS Command** with live GPS location sharing.
* **Full Lifecycle Resolution Tracking** across all 5 official states: `Submitted` -> `Received` -> `Under Verification` -> `In Progress` -> `Resolved`.

---

## 2. Comprehensive Planning Documentation & Hackathon Scripts

Review our complete engineering documentation in the `docs/` folder:

* [**Project Idea & Executive Summary**](docs/PROJECT_IDEA.md) — Why Nirapod wins, problem analysis, value proposition, and target audiences.
* [**3–5 Minute Presentation & Live Demo Script**](docs/DEMO_WALKTHROUGH.md) — Step-by-step hackathon judging script and walkthrough.
* [**System Architecture & Design**](docs/SYSTEM_ARCHITECTURE.md) — High-level architecture, Mermaid & ASCII diagrams, Next.js + FastAPI + PostgreSQL stack breakdown.
* [**Workflow Diagrams**](docs/WORKFLOW_DIAGRAM.md) — Automated hazard reporting, Direct DMB Dispatch, SOS command, and community verification workflows.
* [**Database (ER) Diagram & PostgreSQL Schema**](docs/DATABASE_ER_DIAGRAM.md) — Relational ER diagrams, table specifications, geospatial indexes, and performance strategy.
* [**AI Pipeline Architecture**](docs/AI_PIPELINE.md) — Multi-modal Grok API vision/text evaluation, Voyage AI duplicate detection, AI Route Safety Advisor, and fallback heuristic engine.
* [**User Flow Diagrams**](docs/USER_FLOW.md) — Step-by-step journeys for Commuters, Citizens, Vulnerable Groups, and Government Authorities.
* [**Technical Writeup**](docs/TECHNICAL_WRITEUP.md) — Whitepaper explaining data flow, architectural choices, and how reports reach government agencies.

---

## 3. Feature Matrix (Problem Statement Compliance)

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. Interactive Map** | ✅ | Leaflet map with custom color-coded pins for Robbery, Snatching, and Mugging hotspots across Dhaka & Gazipur. |
| **2. Citizen Reporting System** | ✅ | Fast photo upload, GPS latitude/longitude selection, title, description, and real-time AI category assistant. |
| **3. Smart Authority Routing** | ✅ | Rule-based & AI-assisted dispatch to DMB, Dhaka North/South City Corporations (DNCC/DSCC), or Police (DMP). |
| **4. Real-Time Public Alerts** | ✅ | **Simulated Commuter Proximity Alert Modal** warning users approaching high-risk snatching or drainage danger zones. |
| **5. Emergency SOS Module** | ✅ | One-tap SOS command with audio/visual siren, live GPS location sharing, and one-touch dial for 999 & 1090. |
| **6. Community Verification** | ✅ | Citizen upvoting ("I saw this too"), false-report flagging, and dynamic AI-assisted Trust Score (0-100). |
| **7. Resolution Tracking** | ✅ | Complete 5-stage lifecycle tracking: `Submitted` -> `Received` -> `Under Verification` -> `In Progress` -> `Resolved`. |
| **8. Authority Dashboard** | ✅ | Official command center for DMB, DNCC, DSCC, and DMP with status updates and after-repair photo uploads. |
| **9. AI-Assisted Features** | ✅ | Grok API Vision/NLP severity scoring, Voyage AI semantic duplicate clustering, and AI Route Safety Advisor. |

---

## 4. API Keys & Token Configuration Instructions

Nirapod is designed to integrate seamlessly with cloud AI services while providing an **Intelligent Heuristic Fallback Engine** so the app works out-of-the-box even without API keys.

### Where to Insert Your API Keys
Inside the `backend/` directory, copy `.env.example` to `.env` and insert your tokens:

```bash
cd backend
cp .env.example .env
```

Open `.env` and configure your tokens:

```env
# 1. Grok API / xAI Token (or OpenAI-compatible API key for vision/text analysis)
GROK_API_KEY="INSERT_YOUR_GROK_API_KEY_HERE"
GROK_API_BASE_URL="https://api.x.ai/v1"
GROK_MODEL="grok-beta"

# 2. Voyage AI Token (for vector embeddings & duplicate report clustering)
VOYAGE_API_KEY="INSERT_YOUR_VOYAGE_API_KEY_HERE"
VOYAGE_MODEL="voyage-2"

# 3. Database Connection (PostgreSQL or local SQLite for testing)
DATABASE_URL="sqlite:///./nirapod.db"
# For PostgreSQL: DATABASE_URL="postgresql://user:password@localhost:5432/nirapod"
```

---

## 5. Quick Start & Installation Guide

### Prerequisites
* Node.js v18+ & npm
* Python 3.11+ & pip

### Step 1: Start the Backend (FastAPI + AI Engine)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Reset and seed 8 realistic Bangladesh demo reports across all 5 lifecycle states
python3 seed.py

# Launch FastAPI server on port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API Docs available at: `http://localhost:8000/docs`

### Step 2: Start the Frontend (Next.js 14)
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
* Application accessible at: `http://localhost:3000`
* *Note:* If you run the frontend without starting Python, Nirapod's **Standalone Client Demo Mode** automatically activates using browser `localStorage`!

---

## 6. Zero AI Footprint & Quality Standards

* Authored cleanly with atomic, structured Git commit history by **Meherab Hossain**.
* Zero AI attribution, signatures, or metadata in source code, documentation, or commit history.
