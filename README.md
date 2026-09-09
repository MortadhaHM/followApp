# MorTrack

A full-stack personal finance platform, built to solve a real problem and grown, phase by phase, into a data engineering and business intelligence portfolio project.

**Live app:** https://follow-app-rho.vercel.app
**Repository:** https://github.com/MortadhaHM/followApp

---

## About

This project didn't start as a portfolio piece. It started because I needed to know where my money was going and couldn't find an app that fit how I actually think about my finances, so I built one.

I'm an ERP/BI engineering student in Tunisia. The plan for this project has always been sequential: use it myself first, get it solid, then let it double as proof of full-stack and data engineering skills for job applications, particularly for data engineering roles in France, where tools like Databricks are in demand.

It is not a tutorial project and not built on a synthetic dataset. Every transaction in it is real.

**Status:** actively being built. Phases 1, 1v2, 2, 3 (data warehouse with orchestration), and 4 (Power BI dashboards) are complete. Phase 5 (real-time pipeline) is next.

### Name and Logo

The app is named **MorTrack** — a combination of my name, Mortadha, and "track," reflecting what the app actually does. The logo is a bat emblem, a personal touch inspired by Batman, redesigned with a bar chart and an upward trendline built into the wings, tying the visual identity back to the app's purpose: tracking and growing financial awareness.
<img width="904" height="631" alt="logo_transparent" src="https://github.com/user-attachments/assets/b5db61cb-b670-44b8-8a29-99fc41fdd779" />

---

## Current Features (Phase 1 and Phase 1v2)

- User registration and login, with JWT-based authentication and hashed passwords
- Add, view, and delete income and expense transactions, with categories, tags, dates, and descriptions
- A short onboarding flow that adapts available categories to the user's life situation (student, freelancer, salaried, in a relationship, has a family)
- A settings page to edit categories, income sources, and life situations at any time
- Works on desktop and mobile browsers, fully responsive
- Synced across devices automatically, since everything runs through a shared backend and database

---

## Architecture

```
React (Vite)  --->  FastAPI  --->  PostgreSQL / public schema (Supabase)
  [Vercel]           [Render]                |
                                              |
                                     dbt (finance_dbt/)
                                     orchestrated nightly by
                                     Apache Airflow (Docker Compose)
                                              |
                                              v
                               PostgreSQL / analytics schema (Supabase)
                               constellation schema — fact_transactions,
                               fact_daily_balance, dim_date, dim_category
                                              |
                               Power BI Desktop  (4-page dashboard, complete)
                               Recharts in-app   (Phase 4 — real users)

Planned next:
  -> Apache Kafka               (real-time updates, Phase 5)
  -> scikit-learn + MLflow      (forecasting, anomaly detection, Phase 6)
  -> Databricks (optional)      (enterprise-scale platform)
```

---

## Tech Stack

| Layer | Tool | Status |
|---|---|---|
| Frontend | React (Vite) | In use |
| Backend | FastAPI (Python) | In use |
| Database | PostgreSQL, hosted on Supabase | In use |
| Frontend hosting | Vercel | In use |
| Backend hosting | Render | In use |
| DB client | DBeaver | In use |
| ETL transformations | dbt | Phase 3 complete |
| Data integration | Airbyte | Pending — enters when external sources are added |
| Orchestration | Apache Airflow (Docker Compose) | Phase 3 complete — nightly DAG running |
| BI (portfolio) | Power BI Desktop | Phase 4 complete — 4-page dashboard |
| BI (in-app) | Recharts | Phase 4 |
| Streaming | Apache Kafka | Phase 5 |
| ML | scikit-learn, MLflow | Phase 6 |
| Large-scale platform (optional) | Databricks, Delta Lake, Spark | Under consideration |

The database was originally on Render's free managed PostgreSQL, which expires after 90 days. It has since been migrated to Supabase for permanent free hosting — noted here because it's a real lesson, not a hypothetical one.

---

## Project Structure

```
followApp/
├── finance-app/        # application code (React frontend + FastAPI backend)
├── finance_dbt/        # dbt project — data warehouse transformations
│   ├── seeds/
│   │   └── dim_date.csv              # pre-seeded date dimension 2026–2030
│   ├── models/
│   │   ├── staging/
│   │   │   ├── sources.yml           # registers operational source tables
│   │   │   ├── stg_transactions.sql  # staging view — raw transactions
│   │   │   └── stg_users.sql         # staging view — registered users
│   │   ├── dimensions/
│   │   │   └── dim_category.sql      # category dimension with normalization
│   │   └── facts/
│   │       ├── fact_transactions.sql  # atomic grain — one row per transaction
│   │       └── fact_daily_balance.sql # daily grain — aggregated per user per day
│   └── dbt_project.yml
├── airflow/             # orchestration — Docker Compose
│   ├── dags/
│   │   └── dbt_run.py   # dbt_nightly_run DAG — dbt run -> dbt test, midnight daily
│   └── docker-compose.yaml
└── powerbi/             # Power BI dashboard (.pbix) and exported assets
```

> Note: the repository and live app URL still reference the original project name, `followApp`. They remain unchanged for now to avoid breaking existing links; a rename is a possible future cleanup step.

---

## Data Warehouse — Constellation Schema (Phase 3, complete)

The warehouse lives in the `analytics` schema of the same Supabase PostgreSQL instance, separate from the operational `public` schema. dbt reads from `public`, transforms, and writes to `analytics`.

**Two fact tables at different grains:**

- `fact_transactions` — atomic grain, one row per transaction, foreign keys to `dim_date` and `dim_category`, `user_id` kept as a plain filter column. Answers category-level questions: what did I spend most on, which income source contributed most, how does this month compare to last.
- `fact_daily_balance` — daily grain, one row per active day per user, pre-aggregated by dbt. Includes `running_balance` (a window function) and `had_any_spending` (boolean). Answers summary questions: how much did I save this month, how many days did I spend nothing, what is my running balance.

**Two dimension tables:**

- `dim_date` — pre-seeded with every date from May 15 2026 to December 31 2030 (1,692 rows). Includes `day_name`, `week_of_month`, `month_name`, `semester`, `trimester`, `is_weekend`. Pre-seeding is required, since deriving from transactions would make zero-activity days invisible.
- `dim_category` — flat dimension built from raw transaction category strings, normalized by dbt, with a `category_type` column (income or expense).

**dbt project (`finance_dbt/`):** staging → dimensions → facts layering. Staging models are views (always fresh, no rebuild needed), dimensions and facts are tables. Connected to Supabase via the session pooler, writing to the `analytics` schema.

**Orchestration:** Apache Airflow runs via Docker Compose (six containers — webserver, scheduler, worker, triggerer, postgres, redis) using CeleryExecutor. The `dbt_nightly_run` DAG runs `dbt run` followed by `dbt test` automatically every night at midnight.

A few Windows-specific issues came up and got resolved along the way: PowerShell's `echo` saves `.env` as UTF-16, which Docker can't read, so files are written with explicit UTF-8 encoding instead; paths containing spaces are defined as environment variables rather than hardcoded in `docker-compose.yaml`; and the direct Supabase connection failed DNS resolution on Windows 11, so the session pooler is used instead.

**Per-user data isolation:** `user_id` is carried as a plain filter column in both fact tables. The warehouse holds all users' data; each user's dashboard filters to their own `user_id`. Per-user Row Level Security via Power BI RLS is the production path, implementable when Power BI Premium is available.

---

## Business Intelligence — Phase 4 (complete)

Power BI Desktop is connected directly to the `analytics` schema on Supabase via the PostgreSQL connector. Refresh workflow: run `dbt run` to update the warehouse, then Home → Refresh in Power BI Desktop to pull the latest data. Power BI does not live-connect to dbt changes, so this refresh step is manual after every dbt run.

Working rule for the build: every numeric value in every visual comes from an explicit DAX measure in a dedicated `_Measures` table, never a raw column dragged directly into a visual, to avoid silent aggregation errors across unrelated tables.

The dashboard is a 4-page financial story, each page answering one question, styled with the MorTrack black-and-gold visual identity (dark backgrounds, gold accents, the MorTrack logo doubling as a clickable Home button, Next/Previous navigation between pages).

### Overview — "How Am I Doing?"

Overall financial health at a glance: Avg Daily Spending, Total Expenses, Savings, Total Income, % Income Spent, an Income vs Expenses chart by month, and a Balance Over Time trend.

<img width="1432" height="806" alt="image" src="https://github.com/user-attachments/assets/cc3aa2da-5242-4a01-915c-b09ab2599c31" />


### Categories — "Where Your Money Goes"

Breaks down spending by category: Top Category, Top Category Share, Top Category Amount, a Top Spending Categories chart, a Most Frequent Purchases chart (by transaction count, not amount), and a This Month vs Last Month comparison anchored to `TODAY()` to handle the fact that `dim_date` contains future dates.

<img width="1436" height="808" alt="image" src="https://github.com/user-attachments/assets/bbcddd81-0439-4825-ad95-651624699ee0" />

### Time Patterns — "When You Spend"

Spending behavior over time: Top Spending Day, Weekend Spending %, a Spending by Day of Week chart, and a Weekly Spending Trend line chart across the weeks of the month.

<img width="1432" height="807" alt="image" src="https://github.com/user-attachments/assets/2a6610f1-b767-41af-9fd7-91c125949dc2" />


### Income — "Money In"

Focused exclusively on income: Total Income, Top Income Source, Top Income Source Share, an Income by Source chart, and a Monthly Income chart.

<img width="1433" height="805" alt="image" src="https://github.com/user-attachments/assets/fa10afd9-e1cb-44f7-b70a-9e0779192d2d" />


> **Note:** add the four screenshot files to a `screenshots/` folder next to this README in the repo (or update the paths above) for the images to render on GitHub.

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 — Core application | Done | Auth, transactions, deployed |
| 1v2 — Adaptive onboarding | Done | Life-situation-based categories, settings page |
| 2 — Cross-platform sync | Done | Achieved through shared cloud deployment |
| 3 — Data warehouse | Done | Constellation schema, dbt pipeline, and nightly Airflow orchestration |
| 4 — BI dashboards | Done | 4-page Power BI dashboard connected to the warehouse |
| 5 — Real-time pipeline | Planned | Kafka streaming into the warehouse |
| 6 — Machine learning | Planned | Forecasting, anomaly detection, spending clusters |
| Optional — Databricks | Planned | Enterprise-scale data lake and processing |

---

## Screenshots (application)

<img width="1918" height="935" alt="image" src="https://github.com/user-attachments/assets/367a6622-cb36-44bf-8677-8eef2a78de0f" />
<img width="1918" height="935" alt="image" src="https://github.com/user-attachments/assets/fc8e22e8-35e2-42a1-a30b-7425f25c21ce" />
<img width="1901" height="936" alt="image" src="https://github.com/user-attachments/assets/5e155b6d-4262-4609-8e84-74817fe18314" />
<img width="1901" height="935" alt="image" src="https://github.com/user-attachments/assets/546c5f71-039e-4464-acc8-26cbc4fcc4a6" />
<img width="1901" height="936" alt="image" src="https://github.com/user-attachments/assets/7b31e77e-5993-44a9-98ac-854fac442a11" />
<img width="1897" height="935" alt="image" src="https://github.com/user-attachments/assets/857bf82d-7f87-4b54-ad20-be92d1e9316c" />

---

## License

Not yet decided. If you're viewing this and considering reuse, ask first.

---

## Author

Mortadha HOUIMELI, ERP/BI Engineering Student, Tunisia
