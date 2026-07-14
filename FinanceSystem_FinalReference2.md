# Personal Finance Management System
## Complete Project Reference — Final Version

---

## 1. Who Is This For?

This project was built **by one person, for one person — me.**

I am an ERP / Business Intelligence engineering student based in Tunisia. I had a real personal problem: I needed to understand where my money was going, track my income sources, and take control of my financial habits. No existing app felt right, so I decided to build my own.

The project started from a genuine personal need. That makes it better than anything built for an imaginary user.

---

## 2. Why This Project Exists

### The Personal Reason
I needed a tool to:
- See exactly where I was spending money
- Track every income source I had
- Understand my financial behavior over time
- Make better decisions with limited resources

### The Professional Reason
As an ERP/BI student, I wanted a real project that covers what I actually study — not a tutorial clone, not a fake dataset exercise. A real system, built from scratch, that I use every day, that grows with my skills.

### The Long-Term Vision
The project follows a clear three-stage sequence:

1. **Personal use first** — build it, use it daily, fix real problems with my own finances
2. **Portfolio second** — once solid, it demonstrates full-stack + data engineering + BI + ML skills to employers
3. **Product maybe later** — share with friends, grow organically, potentially sell

These three stages are sequential. Not parallel. One at a time.

---

## 3. What This System Is

A **full-stack personal finance decision-support platform** that:
- Collects financial data through a web application (mobile-responsive)
- Synchronizes data across all devices
- Transforms raw transactions into analytical models
- Visualizes insights through dashboards
- Uses machine learning to predict and optimize financial behavior
- Evolves into a complete data engineering pipeline

This is not a simple expense tracker.
It is a complete, data-driven financial management ecosystem built progressively, one phase at a time.

---

## 4. System Architecture Overview

```
[Web App - React (responsive, works on mobile)]
         deployed on Vercel
              |
              v
    [Backend API - FastAPI]
         deployed on Render
              |
              v
   [PostgreSQL - Operational DB]
         managed by Render
              |
              v
     [ETL - dbt + Airbyte]
              |
     [Airflow - Orchestration]
              |
              v
  [Data Warehouse - PostgreSQL -> Snowflake]
              |
              v
     [BI - Power BI Dashboards]
              |
        [Kafka - Streaming]
              |
              v
  [ML - scikit-learn + MLflow]
              |
              v
  [Optional - Databricks / Delta Lake / Spark]
```

---

## 5. Stack Philosophy

Every tool chosen follows three rules:
1. **Market demand** — engineers get hired for knowing it
2. **Reliability at scale** — will not break when the system grows
3. **Right tool for the right job** — not the trendiest, the most appropriate

Tools studied in school are kept where they genuinely belong.
Where a better, more in-demand tool exists, it replaces the older one.

---

## 6. Final Technology Stack

### Core Tools - Phase 1

| Layer | Tool | Why |
|---|---|---|
| Frontend Web | React | Most demanded frontend skill worldwide, huge ecosystem |
| Backend API | FastAPI (Python) | Async, lightweight, perfect for data-heavy applications |
| Operational DB | PostgreSQL | Most reliable open-source RDBMS, scales well, widely used |
| DB Client | DBeaver | Universal DB client, works with PostgreSQL, Snowflake, everything |
| Frontend Hosting | Vercel | Free, auto-deploys from GitHub, perfect for React/Vite |
| Backend Hosting | Render | Free tier, auto-deploys from GitHub, perfect for FastAPI |
| DB Hosting | Supabase PostgreSQL | Free tier, 500MB, never expires — migrated from Render |

> **Database migration (July 2026):** The original Render managed PostgreSQL expired after 90 days (free tier limit). All data was exported via DBeaver and imported into Supabase. The backend DATABASE_URL was updated to use Supabase's Session Pooler (IPv4) since Render's free tier does not support IPv6 outbound connections. All data preserved, no downtime. **Lesson:** always use Supabase from the start for permanent free PostgreSQL hosting.

### Data Engineering Tools - Phase 3+

| Layer | Tool | Why |
|---|---|---|
| ETL Transformations | dbt | Modular SQL transformations, version-controlled, industry standard |
| Data Integration | Airbyte | Modern open-source data integration, replaces Talend/SSIS |
| Orchestration | Apache Airflow | Industry standard for pipeline scheduling and monitoring |
| Data Warehouse (start) | PostgreSQL (star schema) | Free, sufficient for personal scale |
| Data Warehouse (scale) | Snowflake | Cloud-native, elastic, widely used in enterprises |

### Business Intelligence - Phase 4

| Layer | Tool | Why |
|---|---|---|
| BI Platform | Power BI | Most widely used enterprise BI tool, connects to everything |

### Real-Time and Streaming - Phase 5

| Layer | Tool | Why |
|---|---|---|
| Event Streaming | Apache Kafka | Gold standard for real-time pipelines in finance and tech |

### Machine Learning - Phase 6

| Layer | Tool | Why |
|---|---|---|
| Classical ML | scikit-learn | Covers 90% of practical ML tasks cleanly |
| Experiment Tracking | MLflow | Standard for tracking, deploying, and monitoring ML models |

> PyTorch added only if classical ML is genuinely insufficient. Not a priority.

### Advanced Platform - Optional

| Layer | Tool | Why |
|---|---|---|
| Data Lake | Delta Lake (Databricks) | ACID transactions on large-scale storage |
| Processing Engine | Apache Spark | Distributed data transformation at enterprise scale |
| Full Platform | Databricks | Hottest data engineering skill in France and across Europe |

---

## 7. Tools Replaced and Why

| Studied Tool | Replaced By | Reason |
|---|---|---|
| SSIS | dbt + Airbyte | Cloud-native, modern, actively growing market demand |
| Talend | dbt + Airbyte | dbt is the standard for SQL transformations, Airbyte for integration |
| SSAS | Power BI + proper DWH schema | Power BI makes SSAS unnecessary for this scale |
| SSMS | DBeaver | Works with PostgreSQL and every other DB, not tied to SQL Server |
| PgBadger | - | Kept for personal PostgreSQL tuning only, not a headline skill |

> **Important:** The concepts behind these tools are fully transferable. ETL is ETL. Orchestration is orchestration. OLAP is OLAP. Knowing the older tools and moving to better ones is a strength — it means you can work in both legacy and modern environments.

---

## 8. The Flutter Decision

Flutter is not hard. The timing is wrong.

**Why Flutter is skipped for now:**
- It uses Dart — a completely new language on top of everything else being learned
- Phase 1 already introduces React (JavaScript), FastAPI (Python), and PostgreSQL (SQL) simultaneously
- A responsive React web app works perfectly on any phone browser
- Adding Flutter now means learning 4 technologies at once instead of 3
- Momentum matters more than a native mobile feel at this stage

**When Flutter gets added:**
- After Phase 1 is fully working and in daily use
- After React, FastAPI, and PostgreSQL feel comfortable
- When native mobile features (push notifications, offline mode) are genuinely needed

Flutter will still be there in 3 months. Build the web app first.

---

## 9. The Rules for Using AI Coding Tools

AI coding assistants (Cursor, Windsurf, Trae, and others) are allowed and encouraged.
They accelerate development significantly.

But they carry one real risk: reading carefully at first, then vibing too hard, copying without understanding, then hitting a wall that cannot be debugged.

**Three rules. Applied every single time AI generates code:**

1. **Read it line by line** — explain to yourself what each part does, even roughly
2. **Ask the AI to explain** any line or block that is not clear before using it
3. **Never copy a full file blindly** — always know what that file is responsible for

**What AI can write:**
- React form components and table views
- FastAPI CRUD endpoints
- PostgreSQL table creation scripts
- Basic dbt models
- Boilerplate Airflow DAG structure

**What must be written or deeply understood personally:**
- The core data model — what tables exist, what relationships, and why
- Any logic that touches money — calculations, aggregations, totals
- The star schema design — this is the heart of the BI portfolio
- Authentication and session logic

> JavaScript and Python are the most readable languages that exist. AI-generated code in these languages reads almost like English after a few days. No need to memorize syntax — just understand the logic.

---

## 10. Phase-by-Phase Breakdown

---

### Phase 1 - Core Application ✅ DONE

**Goal:** A working app that records real financial behavior. Nothing more.

**Tools:**
- React (web frontend — responsive, works on mobile browser)
- FastAPI (backend API)
- PostgreSQL (operational database)
- DBeaver (database client)

**What was built:**
- User registration and secure login (JWT in localStorage, bcrypt hashing)
- Add income transactions — amount, source, date, description, tags
- Add expense transactions — amount, category, date, description, tags
- View full transaction history
- Delete transactions

**Categories (stored as VARCHAR — no category table):**

Income sources: Gift, Family Support, Refund, Selling Items, Salary, Freelance, Other

Expense categories: Food, Coffee, Groceries, Transport, Going Out, Dates, Friends, Subscriptions, Shopping, Personal Care, Rent, Bills, Phone, Gifts, Travel, Other

**Deployment:**
- Frontend → Vercel (auto-deploys on GitHub push)
- Backend → Render web service (auto-deploys on GitHub push)
- Database → Render managed PostgreSQL (always-on, free tier)
- Any device with a browser can access the app — PC and phone fully synced through shared cloud backend

---

### Phase 1 v2 - Adaptive Onboarding and User Profiling ✅ DONE

**Goal:** Make the app feel personal from minute one by adapting the interface to each user's real life situation.

**What was built:**
- 2-screen onboarding wizard shown once after registration
- Screen 1: life situation selection (Student, Freelancer, Has a salary, In a relationship, Has a family)
- Screen 2: merged category list based on selections — removable tags, custom category input
- After onboarding: straight to dashboard, no extra screens
- Settings page: edit situations, categories, income sources at any time
- Dynamic category loading in transaction form based on user profile
- Old transactions preserved — removed categories disappear from dropdown but stay in history

**New table added:**
- `user_profile` — stores situations (array), categories (array), income sources (array)

**Key behavior:**
- New accounts → onboarding → dashboard
- Existing accounts without profile → settings page handles gracefully (creates profile on first save)
- All category data stored as plain strings — no category table (dbt handles normalization in Phase 3)

---

### Phase 2 - Cross-Platform Synchronization ✅ DONE (covered by deployment)

**Goal:** One transaction added on any device appears everywhere.

**How it was achieved:**
Phase 2 was completed automatically through cloud deployment in Phase 1. The backend runs on Render and the database on Render managed PostgreSQL — both always-on in the cloud. Any device that opens the Vercel URL hits the same API and the same database.

**What this means in practice:**
- Add a transaction on phone → refresh on PC → it appears. Done.
- No WebSockets needed for a personal finance app
- No React Query polling needed

**WebSockets decision:** Eliminated. A page refresh achieves the same result for this use case. Real-time push updates are not needed when you are the only user checking your own finances.

**Kafka in Phase 2:** Removed from this phase. Kafka is a Phase 5 tool for real-time streaming pipelines. It belongs there, not here.

---

### Phase 3 - Data Modeling and Data Warehouse

**Goal:** Transform raw transactions into an analytics-ready structure.

**Tools:**
- PostgreSQL (constellation schema data warehouse)
- dbt (SQL transformations)
- Airbyte (data integration)
- Apache Airflow (pipeline orchestration)

**Analytical questions this phase must answer:**
1. What category eats most of my budget?
2. What percentage of my income did I spend this month?
3. How much did I spend per category this month vs last month?
4. How can I reduce spending on something I buy repeatedly?
5. How much did I save this month?
6. Which day of the week do I spend the most?
7. What does my spending look like week by week inside a month?
8. How many days did I spend nothing at all?
9. What is my average daily spending?
10. Which income source contributed the most this month?

**Schema:** Constellation (multiple fact tables at different grains — better than a single star schema for these questions)

**Why it matters:**
This is the core of ERP/BI engineering. A properly designed data warehouse makes every analytical query fast, simple, and powerful. This is what BI professionals build in enterprise systems — applied here at personal scale.

---

### Phase 4 - Business Intelligence and Dashboards

**Goal:** Visual insights from analytical data for real decision-making.

**Tools:**
- Power BI (dashboards and reports)
- PostgreSQL / Snowflake (data source)

**What gets built:**
- Spending vs income trends
- Top expense categories
- Monthly and yearly financial behavior
- Income sources breakdown
- Personal financial KPIs

**Dashboard refresh:** Scheduled (hourly or daily) — not real-time. Power BI refreshes on a schedule. This is completely sufficient for personal finance. Real-time updates come in Phase 5 via Kafka.

**Example insights this phase unlocks:**
- "I spent 40% of my budget on food this month"
- "My income dropped 20% in Q3"
- "Going out expenses spike every Friday"
- "One income source covers 70% of my total income"

**Why it matters:**
Numbers in a database mean nothing until visualized. This phase turns months of data into clear, actionable financial stories.

---

### Phase 5 - Real-Time Data Pipeline

**Goal:** Dashboards reflect new transactions within seconds.

**Tools:**
- Apache Kafka (event streaming)
- Apache Spark via Databricks (stream processing)
- Apache Airflow (orchestration)
- Snowflake (streaming ingestion target)

**What gets built:**
```
New transaction -> Kafka event -> Spark processes -> Snowflake stores -> Power BI reflects
```

**Why Kafka is here and not earlier:**
Kafka requires a data warehouse to stream data INTO. Phase 3 builds that warehouse. Phase 4 builds the dashboards. Phase 5 makes those dashboards real-time. The order cannot be skipped.

**Why it matters:**
A dashboard showing last week's data is useful. A dashboard showing today's data is powerful. Kafka is also a top portfolio skill for data engineering roles in France and Europe.

---

### Phase 6 - Machine Learning and Advanced Analytics

**Goal:** Predict, detect, and recommend based on real historical behavior.

**Tools:**
- scikit-learn (classical ML models)
- MLflow on Databricks (experiment tracking and model deployment)
- FastAPI (serve predictions back to the app)
- dbt + Spark (feature engineering)

**What gets built:**
- Spending anomaly detection — alerts when behavior is unusual
- Monthly expense forecasting — predicts next month's spending
- Behavioral clustering — identifies recurring spending patterns
- Personalized recommendations — suggests where to improve

**Why the data will be real:**
Unlike most ML projects that use borrowed or synthetic datasets, this system generates its own real labeled data from day one. The ML work is genuine, not simulated.

---

### Optional Phase - Databricks Data Engineering Platform

**Goal:** Enterprise-grade data processing for portfolio and career positioning.

**Tools:**
- Databricks (full platform)
- Delta Lake (data lake with ACID transactions)
- Apache Spark (distributed processing)
- MLflow (end-to-end ML lifecycle)
- Airflow + Databricks Jobs (hybrid orchestration)

**Why it matters for career:**
Databricks is among the most requested data engineering skills in France and across Europe. A working Databricks project in a portfolio puts you ahead of most candidates.

---

## 11. What to Ignore Until Later

| Tool | When to actually touch it |
|---|---|
| Kafka | Phase 5 properly |
| Snowflake | Phase 4-5 |
| Databricks | Phase 5-6 |
| PyTorch | Phase 6 only if scikit-learn is not enough |
| Flutter | After Phase 1 is stable and in daily use |

---

## 12. Realistic Timeline

| Period | What Actually Gets Done |
|---|---|
| Month 1-2 | Phase 1 + Phase 1 v2 — core app, onboarding, deployed. Used daily. ✅ |
| Month 3-4 | Collect real data. Use the app every day. Fix small UX friction. |
| Month 5 | Phase 3 — constellation schema, dbt models, Airflow DAGs |
| Month 6 | Phase 4 — Power BI dashboards connected to warehouse |
| Month 7+ | Phase 5 — Kafka real-time pipeline |
| Month 9+ | Phase 6 — ML when data is rich enough |

---

## 13. Full Phase-to-Tool Map

```
Phase 1     -- React · FastAPI · PostgreSQL · DBeaver · Vercel · Render ✅
Phase 1 v2  -- + User Profiling · Adaptive Onboarding · Dynamic Categories ✅
Phase 2     -- Covered by cloud deployment ✅
Phase 3     -- + dbt · Airbyte · Airflow · Constellation Schema
Phase 4     -- + Power BI · Snowflake (optional start)
Phase 5     -- + Kafka (full) · Spark · Snowflake (full)
Phase 6     -- + scikit-learn · MLflow · Databricks
Optional    -- Full Databricks Platform · Delta Lake · MLflow
```

---

## 14. Honest Cost Breakdown

| Tool | Cost | When |
|---|---|---|
| React, FastAPI | Free | Day one |
| PostgreSQL, dbt, Airflow | Free | Day one / Phase 3 |
| Airbyte | Free (self-hosted) | Phase 3 |
| DBeaver | Free | Day one |
| Vercel | Free | Phase 1 (frontend hosting) |
| Render | Free tier | Phase 1 (backend + DB hosting) |
| Power BI Desktop | Free | Phase 4 |
| Apache Kafka | Free (self-hosted) | Phase 5 |
| Snowflake | Free trial then paid | Phase 4-5 |
| Databricks | Community Edition then paid | Phase 5-6 |
| scikit-learn, MLflow | Free | Phase 6 |

Every phase can be completed with free tools.
Paid services enter only when they add real portfolio or career value.

---

## 15. Skills This Project Proves

| Domain | What It Demonstrates |
|---|---|
| Software Engineering | Full-stack web application with shared backend, cloud deployment |
| Data Engineering | ETL pipelines, warehouse design, real-time processing |
| Business Intelligence | Dimensional modeling, constellation schema, Power BI dashboards |
| Machine Learning | Anomaly detection, forecasting, behavioral clustering |
| ERP Concepts | Operational vs analytical systems, enterprise data architecture |
| System Design | Multi-platform sync, modular and scalable architecture |
| Databricks | Enterprise data lake, Spark processing, ML at scale |

---

## 16. On Failure

The project fails only if it gets abandoned entirely and nothing is learned.

- Phase 1 is buggy but works — not a failure
- Stuck on a problem for two weeks, then fixed it — not a failure
- Never started because it had to be perfect first — the only real failure

Every hour spent debugging is an hour spent becoming someone who can debug.
Every line of AI-generated code that breaks is a chance to understand why.
Time spent learning is never wasted time.

---

## 17. Final Statement

This project is not an exercise.

It solves a real problem right now.
It uses real data generated every day.
It uses the tools companies actually hire for in 2026.
It grows with skills and delivers value at every single phase.

It is the kind of project that separates engineers who understand systems
from engineers who only know tools.

---

Document version: 2.0 — Updated July 2026
Project: Personal Finance Management System
Author: Mortadha
