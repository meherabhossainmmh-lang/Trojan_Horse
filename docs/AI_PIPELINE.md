# Nirapod — AI Pipeline & Multi-Modal Intelligence Architecture

AI is one of the highest-priority innovations in **Nirapod**. Rather than relying on simple rule-based categorization, Nirapod integrates a multi-tier AI pipeline that analyzes textual descriptions, inspects hazard photographs, calculates severity scores, prevents duplicate spam, and advises commuters on safe travel routes.

---

## 1. AI Architecture & End-to-End Pipeline

```mermaid
graph TD
    subgraph Input ["User Submission"]
        IN_Text["Hazard Title & Description"]
        IN_Image["Uploaded Photo"]
        IN_Coords["GPS Lat/Lng & DMB Toggle"]
    end

    subgraph ServiceLayer ["FastAPI AI Service Orchestrator"]
        ORCH_Gateway["AI Router Gateway"]
        ORCH_Fallback["Intelligent Heuristic Fallback Engine"]
    end

    subgraph ExternalAPIs ["External AI Services (With ENV Placeholders)"]
        API_Grok["Grok API / OpenAI Vision & NLP API"]
        API_Voyage["Voyage AI Embedding / Similarity API"]
    end

    subgraph Output ["AI Synthesized Outputs"]
        OUT_Severity["Severity Score (1-100)"]
        OUT_Agency["Assigned Authority Recommendation"]
        OUT_Summary["Executive Summary for DMB/City Corp"]
        OUT_Duplicate["Duplicate Clustering Check"]
        OUT_Advisor["Route Risk Advisory"]
    </end>

    IN_Text --> ORCH_Gateway
    IN_Image --> ORCH_Gateway
    IN_Coords --> ORCH_Gateway

    ORCH_Gateway -->|REST / JSON| API_Grok
    ORCH_Gateway -->|REST / JSON| API_Voyage
    API_Grok -.-|Fallback if Key Absent| ORCH_Fallback
    API_Voyage -.-|Fallback if Key Absent| ORCH_Fallback

    API_Grok --> OUT_Severity
    API_Grok --> OUT_Agency
    API_Grok --> OUT_Summary
    API_Voyage --> OUT_Duplicate
    ORCH_Gateway --> OUT_Advisor
```

---

## 2. Detailed Breakdown of AI Capabilities

### 2.1 Multi-Modal Hazard Analyzer (Grok API & OpenAI-Compatible Vision)
* **Objective:** Automatically assess the severity of reported infrastructure damage or crime hotspots and generate an actionable 1-sentence summary for government engineers.
* **API Integration:** Connects to Grok API (`https://api.x.ai/v1/chat/completions` / compatible endpoint) using standard OpenAI SDK formats.
* **Model Output JSON Schema:**
  ```json
  {
    "severity_score": 85,
    "recommended_authority_code": "DMB",
    "ai_executive_summary": "Open 4-foot deep drainage manhole on Mirpur Road posing critical injury hazard to pedestrians and vehicles.",
    "is_credible": true
  }
  ```

### 2.2 Semantic Duplicate & Spam Detection (Voyage AI Embeddings)
* **Objective:** Prevent duplicate spam when multiple citizens report the same open drain or robbery hotspot in a crowded neighborhood.
* **Methodology:**
  1. Geographic Bounding Filter: Finds existing reports within a 100-meter Haversine radius.
  2. Semantic Similarity: Compares vector embeddings of the report description using Voyage AI (`https://api.voyageai.com/v1/embeddings`, model: `voyage-2`).
  3. Action: If cosine similarity > `0.85`, the system clusters the submission as a community upvote on the primary report.

### 2.3 AI Safe Route Advisor & Risk Index Calculator
* **Objective:** Calculate a dynamic "Danger Index" for any travel route or neighborhood in Bangladesh (e.g., Mirpur 10 to Motijheel, Gazipur Chowrasta to Uttara).
* **Methodology:** Aggregates real-time report density, average severity scores, and community verification trust metrics to compute a safety score (`Safe`, `Moderate Caution`, `High Danger Zone`) and deliver personalized commuter advice.

---

## 3. Configuration & API Key Setup Instructions

To ensure seamless collaboration, all API keys are managed via environment variables with clear fallbacks. Even without external API keys, Nirapod's **Intelligent Heuristic Fallback Engine** evaluates keyword urgency, categorizes hazards, and calculates severity scores automatically.

### Where to Insert Your API Keys
In the root directory or `backend/` directory, create/edit the `.env` file:
```env
# ==============================================================================
# NIRAPOD AI API KEY PLACEHOLDERS
# Insert your tokens below to activate live cloud LLM & Embedding calls.
# ==============================================================================

# 1. Grok API / xAI Token (or compatible OpenAI-format API key)
GROK_API_KEY="INSERT_YOUR_GROK_API_KEY_HERE"
GROK_API_BASE_URL="https://api.x.ai/v1"
GROK_MODEL="grok-beta"

# 2. Voyage AI Token (for vector embeddings & duplicate clustering)
VOYAGE_API_KEY="INSERT_YOUR_VOYAGE_API_KEY_HERE"
VOYAGE_MODEL="voyage-2"

# 3. Database URL (PostgreSQL or local SQLite for testing)
DATABASE_URL="sqlite:///./nirapod.db"
# For PostgreSQL: "postgresql://user:password@localhost:5432/nirapod"
```
