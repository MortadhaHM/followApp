# Personal Finance Management System

A full-stack personal finance platform, built to solve a real problem and grown, phase by phase, into a data engineering and business intelligence portfolio project.

**Live app:** https://follow-app-rho.vercel.app
**Repository:** https://github.com/MortadhaHM/followApp

---

## About

This project didn't start as a portfolio piece. It started because I needed to know where my money was going and couldn't find an app that fit how I actually think about my finances, so I built one.

I'm an ERP/BI engineering student in Tunisia. The plan for this project has always been sequential: use it myself first, get it solid, then let it double as proof of full-stack and data engineering skills for job applications, particularly for data engineering roles in France, where tools like Databricks are in demand.

It is not a tutorial project and not built on a synthetic dataset. Every transaction in it is real.

**Status:** actively being built. Phases 1, 1v2, and the core data warehouse (Phase 3) are complete and in use.

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
                                             |
                                             v
                              PostgreSQL / analytics schema (Supabase)
                              constellation schema — fact_transactions,
                              fact_daily_balance, dim_date, dim_category
                                             |
                              Power BI Desktop  (Phase 4 — portfolio demo)
                              Recharts in-app   (Phase 4 — real users)

Planned next:
  -> Apache Airflow             (nightly dbt run orchestration)
  -> Power BI dashboards        (connected to analytics schema)
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
| Orchestration | Apache Airflow | Pending — Phase 3 remaining |
| BI | Power BI Desktop + Recharts | Phase 4 |
| Streaming | Apache Kafka | Phase 5 |
| ML | scikit-learn, MLflow | Phase 6 |
| Large-scale platform (optional) | Databricks, Delta Lake, Spark | Under consideration |

The database was originally on Render's free managed PostgreSQL, which expires after 90 days. It has since been migrated to Supabase for permanent free hosting — noted here because it's a real lesson, not a hypothetical one.

---

## Project Structure

```
followApp/
├── finance-app/        # application code (React frontend + FastAPI backend)
└── finance_dbt/        # dbt project — data warehouse transformations
    ├── seeds/
    │   └── dim_date.csv              # pre-seeded date dimension 2026–2030
    ├── models/
    │   ├── staging/
    │   │   ├── sources.yml           # registers operational source tables
    │   │   ├── stg_transactions.sql  # staging view — raw transactions
    │   │   └── stg_users.sql         # staging view — registered users
    │   ├── dimensions/
    │   │   └── dim_category.sql      # category dimension with normalization
    │   └── facts/
    │       ├── fact_transactions.sql  # atomic grain — one row per transaction
    │       └── fact_daily_balance.sql # daily grain — aggregated per user per day
    └── dbt_project.yml
```

---

## Data Warehouse — Constellation Schema

The warehouse lives in the `analytics` schema of the same Supabase PostgreSQL instance, separate from the operational `public` schema. dbt reads from `public`, transforms, and writes to `analytics`.

**Two fact tables at different grains:**

`fact_transactions` — one row per transaction. Answers category-level questions: what did I spend most on, which income source contributed most, how does this month compare to last.

`fact_daily_balance` — one row per active day per user. Pre-aggregated by dbt. Answers summary questions: how much did I save this month, how many days did I spend nothing, what is my running balance. Includes a `had_any_spending` boolean and a `running_balance` window function computed at build time.

**Two dimension tables:**

`dim_date` — pre-seeded with every date from May 15 2026 to December 31 2030. Includes `day_name`, `week_of_month`, `month_name`, `semester`, `trimester`, `is_weekend`. Pre-seeding is required — deriving from transactions would make zero-activity days invisible.

`dim_category` — one row per unique category, built from the raw category strings stored in the app. Includes `category_type` (income or expense) and `normalized_name`. Normalization happens in dbt, not in the app.

**Per-user data isolation:**

`user_id` is carried as a plain filter column in both fact tables. The warehouse holds all users' data; each user's dashboard filters to their own `user_id`. Per-user Row Level Security via Power BI RLS is the production path — implementable when Power BI Premium is available.

<img width="1068" height="721" alt="Constellation schema diagram" src="https://github.com/user-attachments/assets/2f35e92d-2e09-4922-9a33-ae91f0b452f9" />

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 — Core application | Done ✅ | Auth, transactions, deployed |
| 1v2 — Adaptive onboarding | Done ✅ | Life-situation-based categories, settings page |
| 2 — Cross-platform sync | Done ✅ | Achieved through shared cloud deployment |
| 3 — Data warehouse | In progress 🔄 | Constellation schema and dbt pipeline complete — Airflow pending |
| 4 — BI dashboards | Planned | Power BI Desktop (demo) + Recharts in-app (real users) |
| 5 — Real-time pipeline | Planned | Kafka streaming into the warehouse |
| 6 — Machine learning | Planned | Forecasting, anomaly detection, spending clusters |
| Optional — Databricks | Planned | Enterprise-scale data lake and processing |

---

## Screenshots

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
