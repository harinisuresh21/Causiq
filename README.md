# RootCause AI — Autonomous Software Incident Investigator

> **Tagline:** Your Autonomous Software Incident Investigator.

RootCause AI is an intelligent engineering investigation platform that connects application logs, GitHub code changes, deployment events, and infrastructure monitoring telemetry to autonomously identify probable root causes of software failures, evaluate competing hypotheses against structured evidence, recommend human-in-the-loop remediations, and verify fixes.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ROOTCAUSE AI PLATFORM                    │
└─────────────────────────────────────────────────────────────┘
                              │
  ┌───────────────────────────┴───────────────────────────┐
  ▼                                                       ▼
[ Frontend: React 18 + Vite ]               [ Backend: FastAPI Engine ]
  • Command Center Dashboard                  • Multi-Stage Investigation Pipeline
  • Evidence Relationship Graph               • Correlation Engine
  • Remediation & Verification Workspace      • Automated Secret Redaction
  • Integrations Marketplace                  • GitHub / CloudWatch / Docker Adapters
                              │
                              ▼
               [ AI Reasoning Engine: Gemini ]
               • Structured Pydantic Output
               • Deterministic Fallback Mode
               • Calibrated Confidence Scoring
```

---

## 2. Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend:** Python 3.12, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn.
- **AI Core:** Google GenAI Python SDK (`google-genai`), Gemini 2.5 Flash / Pro with calibrated confidence.
- **Database:** SQLite (MVP persistence).
- **Security:** In-memory secret scrubbing (passwords, tokens, AWS keys, database URIs).

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### Backend Setup
```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env (or copy from .env.example)
cp .env.example .env
# Set your GEMINI_API_KEY if available (the engine automatically falls back to deterministic analysis if omitted)

# Start backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at: `http://127.0.0.1:8000`  
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Access UI at: `http://localhost:5173`

---

## 4. Key Modules & Differentiators

1. **Command Center:** Real-time service health, P95 latencies, active incident blast radius, and deployment timeline.
2. **Autonomous Multi-Stage Pipeline:** Executes 9 formal investigation stages (Incident Understanding -> Evidence Normalization -> Correlation -> Hypothesis Generation -> Remediation).
3. **Evidence Graph:** Interactive dependency flow tracing commits -> deployments -> metric spikes -> container crashes.
4. **Integration Hub:** GitHub API adapter for commit/repo tracking, AWS CloudWatch adapter, Docker container health adapter, Jenkins CI/CD, and Prometheus alerts.
5. **Fix & Verify:** Prevents dangerous automated production mutations by requiring explicit human confirmation and verifying post-fix telemetry against baseline failure metrics.
6. **Preloaded Demo Scenarios:**
   - **Scenario 1:** Database Connection Pool Exhaustion & Cascading Auth Outage.
   - **Scenario 2:** Container Memory Leak & OOMKilled Restarts.
   - **Scenario 3:** API Latency Regression & Unindexed Join Scans.

---

## 5. Security & Isolation

- **Secret Redaction:** `redaction_service.py` automatically scrubs passwords, API keys, GitHub tokens, and AWS access keys before telemetry ingestion.
- **Read-Only Integrations:** Ingests commit metadata and telemetry without modifying production code.
- **Human-in-the-Loop:** Explicit approval required before any incident resolution.
- **No Hallucinations:** Hypotheses must explicitly cite verified evidence IDs (`EV-101`, `EV-102`).

---

## 6. Deployment Guide

### Backend (Render)
- **Environment:** Python 3
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `GEMINI_API_KEY`: Your Gemini API Key
  - `GEMINI_MODEL`: `gemini-2.5-flash`
  - `DATABASE_URL`: `sqlite:///./rootcause.db`

### Frontend (Vercel)
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: URL of your deployed Render backend
