# Nirapod (নিরাপদ) — 3–5 Minute Hackathon Presentation & Live Demo Script

**Target Duration:** 4 Minutes  
**Audience:** Hackathon Judges & Engineering Evaluators  
**Goal:** Showcase how Nirapod solves Bangladesh's commuter safety and infrastructure hazard crisis through real-time mapping, AI-powered authority routing, Direct DMB Dispatch, and Emergency SOS.

---

## 1. Introduction & The Problem (0:00 - 0:45)

* **Say:**  
  > "Good morning/afternoon, respected judges. Every single day, commuters across Dhaka, Gazipur, and Chattogram face preventable hazards—from armed snatching (*chintai*) at recurrent dark hotspots to open drainage manholes and waterlogged roads. While citizens often share photos of these dangers on social media, those unverified posts get lost in algorithms and never reach the responsible government authorities in an actionable format.  
  >  
  > Today, I present **Nirapod (নিরাপদ)**—a real-time, AI-empowered citizen safety and infrastructure intelligence platform that connects communities directly with the **Disaster Management Board (DMB)**, **City Corporations**, and **Metropolitan Police**."

* **Action on Screen:**  
  * Have **`http://localhost:3000`** open on the **Interactive Hotspot Map**. Point out the color-coded pins across Dhaka and Gazipur.

---

## 2. Interactive Map & Proximity Danger Zone Alerts (0:45 - 1:30)

* **Say:**  
  > "First, notice our **Interactive Crime & Hazard Map**. Different categories are visually distinguishable: red pins indicate active crime hotspots like robbery and snatching, while amber pins flag municipal infrastructure dangers.  
  >  
  > What makes Nirapod unique for daily commuters is our **Real-Time Proximity Alert system**. Let me show you what happens when a commuter walks near an active danger zone."

* **Action on Screen:**  
  1. Click the button: **`Simulate Proximity Danger Alert`** in the map header.  
  2. Show the real-time popup warning for *Dhanmondi Lake Footpath (Snatching Hotspot)*.  
  3. Highlight the **AI Severity Score (85/100)** and the **AI Recommended Safer Alternate Corridor** (*"Take Satmasjid Road main illuminated sidewalk"*).  
  4. Click **"Re-route to Safer Alternate Corridor"** and close the alert.

---

## 3. Citizen Reporting & Direct DMB Dispatch (1:30 - 2:30)

* **Say:**  
  > "Now let's look at our **Citizen Reporting System** and how our **AI Multi-Modal Engine** eliminates bureaucracy.  
  >  
  > Crucially, for critical municipal and environmental hazards like open manholes or waterlogging, citizens can activate our **Direct Disaster Management Board (DMB) Dispatch**."

* **Action on Screen:**  
  1. Click **`+ Report Hazard`** in the top-right header.  
  2. Click the red checkbox banner: **`☑ Direct Disaster Management Board (DMB) Dispatch`**. Point out the **HIGH PRIORITY** badge.  
  3. Click the location preset: **`Motijheel Commercial Area, Dhaka`**.  
  4. Notice how the **AI Multi-Modal Analyzer Preview** card lights up, assigning a severity score of **88/100** and automatically routing the report to **DMB (1090)** without requiring the user to choose manually.  
  5. Click **`Submit Verified Report`**.  
  6. Show that the report instantly appears on the map with a glowing red **DIRECT DMB** tag.

---

## 4. Community Consensus & Complete Lifecycle Tracking (2:30 - 3:15)

* **Say:**  
  > "To eliminate false reports and spam, Nirapod features a **Community Consensus Engine** and complete **Lifecycle Tracking** across 5 official states: `Submitted` -> `Received` -> `Under Verification` -> `In Progress` -> `Resolved`."

* **Action on Screen:**  
  1. Click on the *Mirpur 10 Roundabout Open Manhole* report card in the right-hand feed.  
  2. In the evidence modal, point to **"Trust Score: 85/100"**.  
  3. Click **`👍 I Saw This Too`** and show the verification counter increment.  
  4. Scroll down to **"Community Consensus & Real-Time Updates"**, type a quick comment (*"Heavy rain is covering the hole, use caution!"*), and post it.

---

## 5. Emergency SOS Module & Authority Command Center (3:15 - 4:00)

* **Say:**  
  > "For citizens facing immediate danger, we built a one-touch **Emergency SOS Module**."

* **Action on Screen (SOS):**  
  1. Click the pulsing red **`EMERGENCY SOS`** button in the top right.  
  2. Show the flashing radio beacon, live GPS telemetry (`23.7505° N, 90.3800° E`), and one-touch dialers for **999 (Police)** & **1090 (Disaster Helpline)**.  
  3. Click **`ACTIVATE SOS`** to broadcast the alert, then click **`Mark Safe`** to resolve it.

* **Say:**  
  > "Finally, government agencies access the **Authority Command Center** to manage their operational queue."

* **Action on Screen (Authorities):**  
  1. Switch to the **`Authority Command Center`** tab.  
  2. Click the **`Disaster Management Board (DMB)`** filter tab.  
  3. Click **`Update Lifecycle`** on any report, change its status to **`Resolved (Repair Complete)`**, and enter an after-repair engineering note.  
  4. Conclude by saying:  
     > "By connecting citizens, community consensus, AI routing, and government authorities in a single transparent ecosystem, **Nirapod (নিরাপদ)** builds a safer, smarter Bangladesh. Thank you."
