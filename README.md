
# CausIQ
### AI-Powered Autonomous Software Incident Investigation Platform

[![CI Test Suite](https://github.com/harinisuresh21/Causiq/actions/workflows/tests.yml/badge.svg)](https://github.com/harinisuresh21/Causiq/actions/workflows/tests.yml)
[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-30%20Passed-emerald.svg)](TESTING.md)
[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-17%20Passed-blue.svg)](TESTING.md)
[![Backend Coverage](https://img.shields.io/badge/Coverage-84%25-brightgreen.svg)](TESTING.md)
[![A11y Compliant](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-purple.svg)](TESTING.md)

**Find the cause. Understand the impact. Verify the fix.**

Causiq is an AI-powered software incident investigation platform designed to help developers identify, investigate, and resolve application failures by connecting evidence from multiple engineering systems.

Instead of analysing isolated error messages or individual log files, Causiq brings together application logs, GitHub changes, deployment events, infrastructure metrics, container activity, and monitoring signals to build a contextual understanding of software incidents.

Powered by AI-assisted investigation and evidence correlation, Causiq helps engineering teams move from error detection to probable root-cause identification, actionable remediation, and post-fix verification.

---

# Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Automated Testing & QA](#automated-testing--qa)
- [Why Causiq?](#why-causiq)
- [Core Features](#core-features)
- [How Causiq Works](#how-causiq-works)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Investigation Workflow](#investigation-workflow)
- [Example Use Case](#example-use-case)
- [AI Investigation Engine](#ai-investigation-engine)
- [Evidence Correlation Engine](#evidence-correlation-engine)
- [Integrations](#integrations)
- [Security and Privacy](#security-and-privacy)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Demo Scenarios](#demo-scenarios)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [Vision](#vision)

---

# Overview

Modern software applications operate across multiple interconnected services, databases, APIs, containers, and cloud infrastructure components.

When something goes wrong, the symptoms are rarely limited to one system.

A failed deployment might introduce a configuration issue. That issue might cause database connection failures, which eventually result in API errors and application downtime.

Although the relevant information exists, it is often distributed across different tools.

Developers must manually inspect logs, compare deployment timestamps, investigate code changes, monitor infrastructure metrics, and correlate events to identify the underlying issue.

This process can be time-consuming, especially when incidents affect multiple services.

**Causiq addresses this challenge by providing a unified investigation environment that connects engineering evidence and uses AI to assist with root-cause analysis.**

### What Causiq Does

- Collects evidence from multiple authorised engineering sources.
- Analyses application logs and terminal output.
- Connects relevant GitHub commits and deployment events.
- Correlates infrastructure and application signals.
- Builds chronological incident timelines.
- Generates evidence-backed root-cause hypotheses.
- Identifies supporting and contradicting evidence.
- Suggests remediation steps.
- Evaluates fresh evidence after fixes.
- Maintains investigation history.

The objective is not simply to explain an error message. It is to understand the wider sequence of events surrounding a software failure.

---

# Problem Statement

Software debugging becomes increasingly complex as applications grow and depend on multiple services and infrastructure components.

Consider an application that suddenly starts returning HTTP 500 errors after a deployment.

The failure could be caused by:

- A recently introduced code regression.
- An incorrect environment configuration.
- Database connection pool exhaustion.
- Memory or CPU resource exhaustion.
- A failed container deployment.
- An unavailable third-party API.
- An infrastructure configuration change.
- Increased request volume or application latency.

The challenge is that these events are usually recorded in different systems.

### Key Challenges

**1. Fragmented Engineering Data**

Application logs, GitHub commits, CI/CD events, infrastructure metrics, and container logs are maintained separately.

**2. Manual Event Correlation**

Developers need to compare timestamps and connect events across systems to understand what happened before a failure.

**3. Symptom-Based Debugging**

Most tools identify errors and exceptions, but an error message alone may not explain the underlying cause.

**4. Multiple Possible Causes**

A single application failure can have several possible explanations. Identifying the most likely one requires evaluating evidence from different sources.

**5. Delayed Incident Resolution**

Switching between dashboards, log viewers, repositories, and monitoring tools increases investigation time.

**6. Lack of Fix Verification**

After applying a fix, teams still need to verify whether the original failure has disappeared and whether the application has recovered.

### The Core Problem

There is a gap between detecting a software failure and understanding the complete chain of events that may have caused it.

Causiq aims to bridge that gap.

---

# Our Solution

Causiq introduces an AI-assisted, evidence-driven software incident investigation workflow.

It connects multiple engineering evidence sources, reconstructs the incident timeline, identifies relationships between events, and evaluates possible root causes.

Rather than producing an unexplained AI-generated answer, Causiq presents the evidence behind its findings.

### Our Approach

| Stage | What Causiq Does |
|---|---|
| Evidence Collection | Collects or imports authorised logs, commits, deployment events, and metrics. |
| Normalisation | Converts different evidence formats into a common event structure. |
| Correlation | Identifies potentially related events across different sources. |
| Timeline Reconstruction | Builds a chronological sequence of incident-related events. |
| AI Investigation | Evaluates evidence and generates root-cause hypotheses. |
| Remediation | Suggests investigation and resolution steps. |
| Verification | Analyses fresh evidence to assess whether the fix worked. |

### Key Differentiator

Causiq focuses on **cross-source evidence correlation and investigation**, rather than relying only on individual error messages.

It aims to connect:

- What changed?
- When did the problem begin?
- Which services were affected?
- What evidence supports the suspected cause?
- What other explanations are possible?
- What should the developer investigate next?
- Did the fix actually resolve the problem?

---

# Automated Testing & QA

Causiq incorporates an automated, multi-tiered testing suite that guarantees system reliability across API routes, AI reasoning logic, and user interfaces:

| Test Layer | Framework | Scope / Coverage | Test Count | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Unit & Integration** | `pytest`, `pytest-cov`, `httpx` | Health, Log Parser, Redaction, Correlation, Gemini, Verification | **30 Tests (84% Coverage)** | ✅ **Passed** |
| **Frontend Components** | `vitest`, `@testing-library/react` | Navigation, Dashboard, Investigations, Evidence Graph, Verification | **17 Tests (8 Suites)** | ✅ **Passed** |
| **End-to-End (E2E)** | `@playwright/test` | Complete visitor journey, incident creation, automated verification | Automated Scenarios | ✅ **Ready** |
| **CI / CD Pipeline** | GitHub Actions | Automated linting, test execution, coverage gating (`--cov-fail-under=80`) | Pull Request & Push | ✅ **Configured** |

For complete test architecture documentation, execution instructions, and coverage matrices, see [TESTING.md](TESTING.md).

```bash
# Run Backend Pytest Suite
$env:PYTHONPATH="backend"
pytest backend/tests --cov=app --cov-report=term-missing

# Run Frontend Vitest Suite
cd frontend
npm run test:coverage
```

---

# Why Causiq?

Traditional debugging often begins with an error message.

Causiq begins with the incident and the evidence surrounding it.

| Traditional Debugging | Causiq |
|---|---|
| Investigates individual errors | Connects evidence across systems |
| Requires manual timestamp comparison | Builds a chronological event timeline |
| Often relies on developer interpretation | Uses AI-assisted evidence evaluation |
| May overlook related deployment events | Connects authorised deployment and code-change metadata |
| Produces possible fixes | Provides evidence-linked remediation suggestions |
| Fix validation is often manual | Supports structured post-fix verification |

Causiq is designed to complement existing engineering and observability tools, not replace every monitoring or logging platform.

---

# Core Features

## 1. Multi-Source Evidence Collection

Causiq supports an investigation workflow that can bring together different types of engineering evidence.

Supported or planned input methods include:

- Application log uploads.
- Terminal output and error messages.
- JSON and CSV evidence files.
- GitHub repository metadata.
- Commit and pull request information.
- Deployment events.
- Docker container events.
- Cloud infrastructure metrics.
- Monitoring alerts.
- CI/CD pipeline events.

Users can start an investigation using available evidence and add more sources as needed.

## 2. Intelligent Log Analysis

Causiq analyses application logs and terminal output to identify:

- Errors and exceptions.
- Warning messages.
- Repeated failures.
- Database connection problems.
- API request failures.
- Timeout patterns.
- Memory-related errors.
- Container failures.
- Unusual event sequences.

The log parser extracts structured information from raw logs so that the investigation engine can correlate it with other evidence.

## 3. AI-Powered Root-Cause Investigation

The AI investigation engine evaluates collected evidence and generates structured findings.

It can identify:

- Incident summary.
- Probable root cause.
- Severity.
- Confidence estimate.
- Affected services.
- Supporting evidence.
- Contradicting evidence.
- Alternative hypotheses.
- Potential business impact.
- Missing information.
- Recommended remediation steps.
- Verification checklist.

The investigation should distinguish between a suspected cause and a confirmed cause.

## 4. Cross-Source Event Correlation

Causiq attempts to identify relationships between events recorded in different systems.

For example:

A GitHub commit is followed by a deployment. Shortly afterward, database errors increase, followed by application failures.

Causiq can connect these events into a single investigation view.

Correlation considers:

- Event timestamps.
- Service relationships.
- Error patterns.
- Deployment timing.
- Resource utilisation.
- Repeated failures.
- Available dependency information.

Temporal proximity alone does not establish causation. The platform should present relationships as hypotheses supported by evidence.

## 5. Intelligent Incident Timeline

Every investigation can contain a chronological sequence of events.

Example:

| Time | Source | Event |
|---|---|---|
| 10:00 | GitHub | New commit merged |
| 10:02 | CI/CD | Deployment completed |
| 10:03 | Application | Database timeout detected |
| 10:04 | API | HTTP 500 errors increased |
| 10:05 | Infrastructure | Connection pool exhaustion detected |
| 10:06 | Docker | Container connection errors reported |

This timeline helps developers understand how the incident developed.

## 6. Interactive Evidence Graph

Causiq can visualise potential relationships between engineering events using an interactive evidence graph.

Example:

```text
       GitHub Commit
             |
             v
      Deployment Event
             |
             v
    Configuration Change
             |
             v
  Database Connection Errors
             |
             v
    Connection Pool Exhaustion
             |
             v
     Application HTTP 500
```

Each evidence node can display:

- Event name.
- Source system.
- Timestamp.
- Severity.
- Description.
- Related evidence.
- Investigation relevance.

## 7. Alternative Hypothesis Evaluation

A software incident may have multiple possible causes.

Causiq should not depend on a single AI-generated explanation.

It can present:

- Leading hypothesis.
- Alternative hypotheses.
- Supporting evidence.
- Contradicting evidence.
- Missing evidence.
- Recommended next investigation steps.

This helps developers evaluate the findings rather than blindly accepting an AI response.

## 8. Remediation Recommendations

After investigating the incident, Causiq suggests possible actions.

Each recommendation can contain:

- Suggested action.
- Reason for recommendation.
- Related evidence.
- Priority.
- Potential risk.
- Expected outcome.
- Verification criteria.

Causiq does not automatically modify production systems.

Any production remediation should require explicit human approval and suitable permissions.

## 9. Fix and Verify

An incident should not be marked as resolved simply because a developer applied a suggested fix.

Causiq supports post-fix verification using fresh evidence.

It can compare:

- Previous error frequency.
- New error frequency.
- Application health indicators.
- Database connection behaviour.
- Container restart activity.
- API response latency.
- Relevant infrastructure metrics.

The result can indicate:

- Verified recovery.
- Partial recovery.
- Further investigation required.
- Insufficient verification evidence.

## 10. Investigation History

Causiq maintains an investigation history containing:

- Incident details.
- Uploaded evidence.
- Event timelines.
- AI investigation results.
- Root-cause hypotheses.
- Remediation recommendations.
- Verification records.
- Resolution status.

This makes it easier to review previous incidents and understand recurring failure patterns.

---

# How Causiq Works

Causiq follows a structured investigation pipeline.

```text
             INCIDENT REPORTED
                    |
                    v
          EVIDENCE COLLECTION
                    |
       +------------+------------+
       |            |            |
       v            v            v
   App Logs       GitHub      Infrastructure
   Terminal       Commits       Metrics
       |            |            |
       +------------+------------+
                    |
                    v
           DATA NORMALISATION
                    |
                    v
             EVENT CORRELATION
                    |
                    v
           INCIDENT TIMELINE
                    |
                    v
            AI INVESTIGATION
                    |
                    v
          ROOT-CAUSE HYPOTHESES
                    |
                    v
           EVIDENCE EVALUATION
                    |
                    v
          REMEDIATION GUIDANCE
                    |
                    v
             FIX APPLIED
                    |
                    v
            FRESH EVIDENCE
                    |
                    v
             FIX VERIFICATION
                    |
             +------+------+
             |             |
             v             v
          RESOLVED     INVESTIGATE
```

### Step 1: Incident Creation

A developer creates an investigation by providing:

- Incident title.
- Project or application name.
- Description of the problem.
- Affected service.
- Severity.
- Available evidence sources.

### Step 2: Evidence Collection

The evidence collector retrieves or imports authorised data.

Depending on available integrations, this may include logs, repository metadata, deployment events, infrastructure metrics, and container activity.

### Step 3: Evidence Normalisation

The system transforms different data formats into a common structure.

Example:

```json
{
  "event_id": "EVT-001",
  "source": "application",
  "service": "payment-service",
  "timestamp": "2026-11-19T10:03:00",
  "severity": "error",
  "event_type": "database_timeout",
  "description": "Database connection timeout occurred",
  "metadata": {
    "error_code": "DB_TIMEOUT"
  }
}
```

### Step 4: Event Correlation

The correlation engine identifies events that may be related based on available timestamps, services, patterns, and dependencies.

### Step 5: AI Investigation

The AI engine evaluates the evidence and generates structured investigation results.

### Step 6: Remediation

Developers receive evidence-linked recommendations to investigate and resolve the incident.

### Step 7: Verification

Fresh evidence is collected or uploaded to evaluate whether the original failure indicators have improved.

---

# System Architecture

Causiq follows a modular frontend-backend architecture.

```text
+------------------------------------------------------+
|                    FRONTEND                          |
|                                                      |
|                  React + TypeScript                  |
|                                                      |
|  Dashboard | Investigations | Evidence Graph         |
|  Integrations | History | Fix & Verify               |
+----------------------------+-------------------------+
                             |
                             | REST API
                             |
+----------------------------v-------------------------+
|                    BACKEND                           |
|                                                      |
|                    FastAPI                           |
|                                                      |
|  +-------------------+  +--------------------------+ |
|  | Incident Manager |  | Evidence Collector       | |
|  +-------------------+  +--------------------------+ |
|                                                      |
|  +-------------------+  +--------------------------+ |
|  | Log Parser       |  | Normalisation Engine     | |
|  +-------------------+  +--------------------------+ |
|                                                      |
|  +-------------------+  +--------------------------+ |
|  | Correlation      |  | Investigation Engine     | |
|  +-------------------+  +--------------------------+ |
|                                                      |
|  +-------------------+  +--------------------------+ |
|  | AI Engine        |  | Verification Engine      | |
|  +-------------------+  +--------------------------+ |
+----------------------------+-------------------------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
+---------------------------+   +----------------------+
| EXTERNAL INTEGRATIONS     |   | AI SERVICE            |
|                           |   |                      |
| GitHub API                |   | Google Gemini API    |
| AWS CloudWatch            |   |                      |
| Docker                    |   | Structured Analysis  |
| Jenkins                   |   | Hypothesis Generation|
| Prometheus                |   | Remediation Guidance |
+---------------------------+   +----------------------+
              |
              v
+------------------------------------------------------+
|                    DATABASE                          |
|                                                      |
| Incidents | Evidence | Timelines | Findings          |
| Verification Records | Integration Metadata          |
+------------------------------------------------------+
```

---

# Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | User interface |
| Language | TypeScript | Type-safe frontend development |
| Build Tool | Vite | Frontend development and bundling |
| Styling | Tailwind CSS | Responsive UI styling |
| Components | shadcn/ui | Reusable UI components |
| Icons | Lucide React | Interface icons |
| Charts | Recharts | Incident and infrastructure visualisation |
| Evidence Graph | React Flow | Visual evidence relationships |
| Backend | Python | Backend development |
| API Framework | FastAPI | REST API services |
| Validation | Pydantic | Request and response validation |
| ORM | SQLAlchemy | Database interaction |
| Database | SQLite | MVP data persistence |
| AI | Google Gemini API | AI-assisted incident investigation |
| Version Control | GitHub REST API | Repository and commit metadata |
| Cloud Monitoring | AWS CloudWatch | Infrastructure monitoring data |
| Cloud SDK | Boto3 | AWS integration |
| Container Platform | Docker | Container event and status collection |
| CI/CD | Jenkins API | Build and deployment information |
| Monitoring | Prometheus | Metrics collection |
| API Testing | Postman | API testing |
| Version Control | Git | Source-code management |

---

# Project Structure

```text
causiq/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── data/
│   │   └── styles/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   │
│   │   ├── services/
│   │   │   ├── ai_engine.py
│   │   │   ├── investigation_engine.py
│   │   │   ├── evidence_collector.py
│   │   │   ├── correlation_engine.py
│   │   │   ├── log_parser.py
│   │   │   ├── github_service.py
│   │   │   ├── docker_service.py
│   │   │   ├── redaction_service.py
│   │   │   └── verification_service.py
│   │   │
│   │   ├── integrations/
│   │   │   ├── github.py
│   │   │   ├── aws.py
│   │   │   ├── docker.py
│   │   │   ├── jenkins.py
│   │   │   └── prometheus.py
│   │   │
│   │   └── data/
│   │       └── demo_scenarios/
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

This is the proposed modular structure. The actual repository may differ depending on which modules have been implemented.

---

# Investigation Workflow

## Input Methods

Causiq supports multiple ways to start an investigation.

### 1. Application Log Upload

Upload `.log` or `.txt` files containing application events, exceptions, and error messages.

### 2. Terminal Output

Paste terminal output, stack traces, or command execution errors.

### 3. Structured Evidence Upload

Import supported JSON and CSV files containing structured application or infrastructure events.

### 4. GitHub Integration

Connect an authorised GitHub repository to retrieve relevant repository metadata, commits, and change history.

### 5. Infrastructure Evidence

Use supported monitoring integrations to retrieve infrastructure metrics and alerts.

### 6. Incident Description

Describe the problem in natural language and add the available evidence sources.

---

# Example Use Case

## Scenario: Database Connection Failure After Deployment

An e-commerce application starts returning HTTP 500 errors shortly after a new deployment.

The development team receives reports that users cannot complete purchases.

The available evidence includes application logs, deployment information, and infrastructure metrics.

### Collected Evidence

| Time | Source | Event |
|---|---|---|
| 10:00 AM | GitHub | New commit merged |
| 10:02 AM | CI/CD | Application deployment completed |
| 10:03 AM | Application | Database connection timeout |
| 10:04 AM | API | Payment service returns HTTP 500 |
| 10:05 AM | Infrastructure | Database connection pool exhaustion detected |
| 10:06 AM | Docker | Container reports repeated connection errors |

### AI Investigation

Causiq analyses the evidence and generates a structured investigation.

**Leading hypothesis:**

The application may be experiencing database connection pool exhaustion associated with the recent deployment.

**Supporting evidence:**

- Database timeouts appeared shortly after deployment.
- Multiple application services reported connection failures.
- Infrastructure evidence indicates connection pool exhaustion.
- Container logs show repeated connection errors.

**Alternative hypotheses:**

- Database service instability.
- Incorrect database connection configuration.
- Increased application traffic.
- A connection leak introduced by a code change.

**Recommended investigation steps:**

1. Inspect database connection pool configuration.
2. Review the recent code changes affecting database access.
3. Check database availability and connection limits.
4. Inspect application connection handling.
5. Compare infrastructure metrics before and after deployment.

### Fix Verification

After the development team applies a fix, Causiq receives fresh evidence.

It compares the previous and current application behaviour.

Possible verification outcomes:

- Database timeout errors have stopped.
- HTTP 500 error frequency has decreased.
- Database connection utilisation has returned to a healthy range.
- Container restarts have stopped.

The incident can then be marked as resolved if sufficient verification evidence supports recovery.

---

# AI Investigation Engine

Causiq uses Google's Gemini API to assist with evidence evaluation and root-cause investigation.

The AI engine receives structured incident evidence rather than relying exclusively on raw, unfiltered text.

### AI Responsibilities

- Summarise incident context.
- Identify suspicious event sequences.
- Generate possible root causes.
- Evaluate supporting evidence.
- Identify contradicting evidence.
- Suggest alternative explanations.
- Recommend further investigation steps.
- Generate remediation suggestions.
- Produce a structured verification checklist.

### Example Investigation Output

```json
{
  "incident_summary": "The payment service is experiencing database connection failures following a recent deployment.",
  "severity": "critical",
  "likely_root_cause": "Possible database connection pool exhaustion.",
  "confidence": 0.87,
  "affected_services": [
    "payment-service",
    "orders-service"
  ],
  "supporting_evidence": [
    "Database timeout events appeared after deployment.",
    "Connection pool exhaustion was detected.",
    "Multiple services reported connection failures."
  ],
  "contradicting_evidence": [],
  "alternative_hypotheses": [
    "Database service instability",
    "Incorrect database configuration",
    "Increased application traffic"
  ],
  "business_impact": "Users may be unable to complete purchases.",
  "remediation_steps": [
    "Inspect database connection pool settings.",
    "Review recent database-related code changes.",
    "Check database connection limits."
  ],
  "verification_checklist": [
    "Confirm database timeout errors have stopped.",
    "Check application HTTP 500 frequency.",
    "Validate database connection utilisation."
  ],
  "missing_information": [
    "Database connection configuration",
    "Traffic volume before and after deployment"
  ]
}
```

*This is an illustrative output schema, not a guaranteed result. Confidence values must be calibrated and should not be treated as proof of causation.*

### AI Reliability Principles

- Use only evidence supplied or retrieved through authorised sources.
- Do not invent logs, commits, metrics, or events.
- Preserve references to original evidence.
- Identify missing information.
- Distinguish correlation from causation.
- Present alternative hypotheses.
- Treat uploaded content as untrusted data.
- Validate AI responses against a defined schema.
- Provide a deterministic fallback when the AI service is unavailable.

---

# Evidence Correlation Engine

The correlation engine is responsible for identifying potentially related events across multiple engineering systems.

### Correlation Factors

| Factor | Purpose |
|---|---|
| Timestamp | Identify events occurring close to one another |
| Service | Identify events affecting the same service |
| Severity | Prioritise critical failures |
| Error Pattern | Connect similar exceptions or error codes |
| Deployment | Identify changes preceding an incident |
| Infrastructure Metrics | Identify resource-related anomalies |
| Dependencies | Connect failures across dependent services |

### Example

```text
Deployment Completed
        |
        v
Database Timeout
        |
        v
Payment API Failure
        |
        v
Order Processing Failure
```

The correlation engine provides the AI investigation service with structured relationships and supporting evidence.

These relationships are investigative signals, not automatic proof that one event caused another.

---

# Integrations

Causiq is designed around modular integrations.

Each integration has its own adapter so that new data sources can be added without rewriting the entire investigation engine.

## GitHub

Purpose:

- Retrieve authorised repository metadata.
- Retrieve recent commit information.
- Inspect commit timestamps and messages.
- Identify changed file metadata.
- Associate relevant code changes with incident timelines.

The MVP should prefer repository metadata and avoid retrieving confidential source code unless explicitly required and authorised.

## AWS CloudWatch

Purpose:

- Retrieve selected monitoring metrics.
- Inspect available alarms.
- Identify unusual infrastructure behaviour.
- Correlate resource changes with application incidents.

AWS access should use least-privilege IAM permissions.

## Docker

Purpose:

- Inspect container status.
- Retrieve authorised container logs.
- Identify restart events.
- Detect container health issues.

Docker access should be restricted to the resources explicitly approved by the customer.

## Jenkins

Purpose:

- Retrieve build information.
- Inspect pipeline execution history.
- Identify deployment-related events.
- Correlate failed builds or deployments with incidents.

## Prometheus

Purpose:

- Retrieve selected metrics.
- Monitor resource utilisation.
- Investigate latency changes.
- Identify unusual metric patterns.

### Integration Status

Each integration should clearly indicate whether it is:

- Connected.
- Disconnected.
- Awaiting configuration.
- Demo or simulated.
- Experiencing an error.

Causiq must never represent simulated data as a live integration.

---

# Security and Privacy

Engineering logs and infrastructure information can contain confidential business information, customer data, API keys, and credentials.

Causiq follows a security-conscious design approach.

### Security Principles

**1. Authorised Access**

Only access repositories, services, and infrastructure that users have explicitly authorised.

**2. Read-Only by Default**

Integrations should use read-only permissions wherever possible.

**3. Secret Redaction**

Remove sensitive values such as:

- API keys.
- Access tokens.
- Passwords.
- Database credentials.
- Private keys.
- Session identifiers.

**4. Secure Credential Management**

Store API keys and integration credentials in environment variables or an appropriate secret-management system.

**5. Data Minimisation**

Collect only the information necessary for incident investigation.

**6. Controlled Data Retention**

Provide retention controls for collected evidence and investigation records.

**7. Human Approval**

Do not automatically execute production remediation actions.

**8. AI Input Protection**

Uploaded files, logs, repository content, and external data must be treated as untrusted evidence rather than instructions to the AI system.

**9. Secure Communication**

Use HTTPS for deployed environments and protect stored credentials and sensitive data.

---

# Installation and Setup

Follow the instructions below to run Causiq locally.

## Prerequisites

Install the following:

- Python 3.10+
- Node.js (LTS recommended)
- npm
- Git
- Google Gemini API key

Optional integrations require the corresponding service accounts, credentials, or locally running services.

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/causiq.git
cd causiq
```

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```bash
venv\Scripts\activate
```

Activate the environment on macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file using the provided `.env.example`.

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## 3. Frontend Setup

Open a new terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using the provided `.env.example`.

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Environment Configuration

Never commit real API keys, tokens, or passwords to GitHub.

## Backend `.env.example`

```env
# Google Gemini
GEMINI_API_KEY=
GEMINI_MODEL=

# GitHub Integration
GITHUB_TOKEN=

# Database
DATABASE_URL=sqlite:///./causiq.db

# Application
APP_ENV=development
DEBUG=true

# AWS Integration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Jenkins Integration
JENKINS_URL=
JENKINS_USERNAME=
JENKINS_API_TOKEN=

# Prometheus Integration
PROMETHEUS_URL=
```

Use IAM roles or another secure credential provider for production AWS deployments instead of long-lived access keys.

## Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

# API Documentation

The following endpoints represent the planned REST API structure.

Actual availability depends on the current implementation.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/dashboard/stats` | Retrieve dashboard statistics |
| GET | `/api/integrations` | Retrieve integration statuses |
| POST | `/api/integrations/github/connect` | Configure GitHub integration |
| GET | `/api/integrations/github/repositories` | Retrieve authorised repositories |
| GET | `/api/integrations/github/commits` | Retrieve repository commit metadata |
| POST | `/api/incidents` | Create an incident |
| GET | `/api/incidents` | Retrieve all incidents |
| GET | `/api/incidents/{incident_id}` | Retrieve incident details |
| POST | `/api/incidents/{incident_id}/evidence/upload` | Upload evidence |
| POST | `/api/incidents/{incident_id}/investigate` | Start an investigation |
| GET | `/api/incidents/{incident_id}/investigation` | Retrieve AI investigation results |
| GET | `/api/incidents/{incident_id}/timeline` | Retrieve incident timeline |
| GET | `/api/incidents/{incident_id}/evidence-graph` | Retrieve evidence relationships |
| POST | `/api/incidents/{incident_id}/verify` | Verify a proposed fix |
| POST | `/api/incidents/{incident_id}/resolve` | Resolve an incident |
| GET | `/api/incidents/{incident_id}/report` | Retrieve investigation report |

Interactive API documentation is available through FastAPI Swagger UI at:

`http://localhost:8000/docs`

---

# Demo Scenarios

Causiq can demonstrate its investigation capabilities using predefined incident scenarios.

## Scenario 1: Database Connection Failure

**Problem:** Application services begin returning HTTP 500 errors after deployment.

**Evidence:**

- Deployment completed.
- Database timeout errors appeared.
- Multiple services reported failures.
- Connection pool exhaustion was detected.
- Containers reported connection errors.

**Expected Investigation:**

Identify connection pool exhaustion as a leading hypothesis and recommend reviewing database connection configuration and recent code changes.

## Scenario 2: Memory Leak

**Problem:** Application memory usage increases continuously after a new release.

**Evidence:**

| Time | Event |
|---|---|
| 14:00 | Memory usage at 45% |
| 14:10 | New deployment |
| 14:15 | Memory usage at 70% |
| 14:25 | Memory usage at 92% |
| 14:30 | Container restarts detected |

**Expected Investigation:**

Identify release-associated memory growth as a leading hypothesis and recommend memory profiling, resource analysis, and evaluation of the recent release.

## Scenario 3: API Latency Increase

**Problem:** API response times increase significantly after a database-related code change.

**Evidence:**

| Time | Event |
|---|---|
| 09:00 | Average latency at 180 ms |
| 09:10 | Database query change deployed |
| 09:15 | API latency increases to 2.5 seconds |
| 09:18 | Database CPU utilisation increases |
| 09:20 | Request timeouts detected |

**Expected Investigation:**

Identify a possible query performance regression and recommend query profiling, index inspection, and database performance analysis.

---

# Current Development Status

Causiq is being developed as an initial MVP.

Update this checklist based on the features actually implemented.

## Frontend

- [ ] Responsive command centre dashboard.
- [ ] Incident management interface.
- [ ] Integration management page.
- [ ] Investigation details page.
- [ ] Interactive evidence graph.
- [ ] Incident timeline.
- [ ] Fix and verification interface.
- [ ] Investigation history.

## Backend

- [ ] FastAPI application setup.
- [ ] Incident management APIs.
- [ ] Log upload and parsing.
- [ ] Evidence normalisation.
- [ ] Event correlation engine.
- [ ] AI investigation service.
- [ ] Structured AI response validation.
- [ ] Investigation persistence.
- [ ] Timeline generation.
- [ ] Evidence graph generation.
- [ ] Fix verification service.

## Integrations

- [ ] GitHub integration.
- [ ] AWS CloudWatch integration.
- [ ] Docker integration.
- [ ] Jenkins integration.
- [ ] Prometheus integration.

## AI Capabilities

- [ ] Incident summarisation.
- [ ] Root-cause hypothesis generation.
- [ ] Supporting evidence identification.
- [ ] Contradicting evidence identification.
- [ ] Alternative hypothesis generation.
- [ ] Remediation recommendations.
- [ ] Missing evidence identification.
- [ ] Post-fix verification.

## Deployment and Testing

- [x] Frontend deployment configuration.
- [x] Backend deployment configuration.
- [x] Environment configuration and sandboxing.
- [x] API testing (Pytest 30/30 passed, 84% coverage).
- [x] End-to-end testing (Playwright browser automation).
- [x] Automated Continuous Integration (GitHub Actions).
- [ ] Security testing.

---

# Future Roadmap

Causiq aims to evolve into a comprehensive software incident investigation platform.

### Phase 1 — Core Investigation Platform

- Multi-source evidence upload.
- Intelligent log parsing.
- AI-powered investigation.
- Incident timelines.
- Evidence correlation.
- Investigation history.

### Phase 2 — Engineering Integrations

- GitHub integration.
- AWS CloudWatch integration.
- Docker event collection.
- Jenkins integration.
- Prometheus integration.
- Real-time monitoring support.

### Phase 3 — Advanced Intelligence

- Advanced anomaly detection.
- Service dependency mapping.
- Distributed tracing analysis.
- Investigation replay.
- Recurring incident detection.
- Improved hypothesis evaluation.
- Historical incident pattern analysis.

### Phase 4 — Enterprise Capabilities

- On-premises evidence collection agent.
- Customer-controlled data processing.
- Role-based access control.
- Multi-tenant architecture.
- Team collaboration.
- Audit logs.
- Incident notifications.
- Human-approved remediation workflows.

---

# Contributing

Contributions, suggestions, and feedback are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Implement your changes.
4. Test your implementation.
5. Commit your changes.
6. Submit a pull request.

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Commit Changes

```bash
git add .
git commit -m "Add: your feature description"
```

### Push Changes

```bash
git push origin feature/your-feature-name
```

---

# License

This project is currently under development.

A suitable open-source license should be selected and added before distributing the project under specific reuse terms.

---

# Vision

Our vision is to make software incident investigation faster, more transparent, and more intelligent.

Causiq aims to move beyond isolated error detection by connecting engineering evidence across the software stack and helping developers understand:

- What failed?
- When did it happen?
- What changed before the incident?
- Which services were affected?
- What is the most likely underlying cause?
- What evidence supports that conclusion?
- What should be done next?
- Did the fix actually work?

By combining engineering observability, evidence correlation, and AI-assisted reasoning, Causiq aims to help development teams spend less time searching for clues and more time building reliable software.

---

<p align="center">

### Causiq

**From fragmented signals to actionable engineering intelligence.**

*Built for developers. Designed for reliable software.*

</p>
