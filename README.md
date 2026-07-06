# Personal Finance Management System

A full-stack personal finance platform, built to solve a real problem and grown, phase by phase, into a data engineering and business intelligence portfolio project.

**Live app:** https://follow-app-rho.vercel.app
**Repository:** https://github.com/MortadhaHM/followApp

---

## About

This project didn't start as a portfolio piece. It started because I needed to know where my money was going and couldn't find an app that fit how I actually think about my finances, so I built one.

I'm an ERP/BI engineering student in Tunisia. The plan for this project has always been sequential: use it myself first, get it solid, then let it double as proof of full-stack and data engineering skills for job applications, particularly for data engineering roles in France, where tools like Databricks are in demand.

It is not a tutorial project and not built on a synthetic dataset. Every transaction in it is real.

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
React (Vite)  --->  FastAPI  --->  PostgreSQL (Supabase)
  [Vercel]           [Render]

Planned next:
  -> dbt + Airbyte              (transform raw transactions into a warehouse)
  -> Constellation schema       (multiple fact tables, different grains)
  -> Apache Airflow             (orchestration)
  -> Power BI                   (dashboards)
  -> Apache Kafka               (real-time updates)
  -> scikit-learn + MLflow      (forecasting, anomaly detection)
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
| ETL | dbt, Airbyte | Planned, Phase 3 |
| Orchestration | Apache Airflow | Planned, Phase 3 |
| BI | Power BI | Planned, Phase 4 |
| Streaming | Apache Kafka | Planned, Phase 5 |
| ML | scikit-learn, MLflow | Planned, Phase 6 |
| Large-scale platform (optional) | Databricks, Delta Lake, Spark | Under consideration |

The database was originally on Render's free managed PostgreSQL, which expires after 90 days. It has since been migrated to Supabase for permanent free hosting, noted here because it's a real lesson, not a hypothetical one.

---

## Project Structure

```
followApp/
└── finance-app/        # main application code (frontend + backend)
```

If you're browsing the repo: application code lives inside `finance-app/`. Update this section with the actual internal layout (for example separate `client/` and `server/` folders) once it's finalized, so anyone cloning the repo doesn't have to guess.

---

## Getting Started

### Prerequisites
- Node.js 18 or later
- Python 3.11 or later
- A PostgreSQL database (Supabase's free tier works well)

### Setup

```bash
git clone https://github.com/MortadhaHM/followApp.git
cd followApp/finance-app
```

From here, set up the backend and frontend according to their respective folders. A `.env.example` is included in the repo, copy it to `.env` and fill in your own values (database connection string, JWT secret, API URL). Never commit the real `.env` file.

Typical variables needed:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?pgbouncer=true
JWT_SECRET=your-secret-key
VITE_API_URL=http://localhost:8000
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 - Core application | Done | Auth, transactions, deployed |
| 1v2 - Adaptive onboarding | Done | Life-situation-based categories, settings page |
| 2 - Cross-platform sync | Done | Achieved through shared cloud deployment, no extra work needed |
| 3 - Data warehouse | Next | Constellation schema, dbt, Airbyte, Airflow |
| 4 - BI dashboards | Planned | Power BI connected to the warehouse |
| 5 - Real-time pipeline | Planned | Kafka streaming into the dashboards |
| 6 - Machine learning | Planned | Forecasting, anomaly detection, spending clusters |
| Optional - Databricks | Planned | Enterprise-scale data lake and processing |

---

## Notes on How This Is Built

AI coding tools (Cursor, mainly) are used to speed up development, but every generated block of code is read and understood before it goes in, not copied blindly. The core data model, anything touching money calculations, and the warehouse schema design are worked out and understood personally, not delegated.

Later phases (Kafka, ML, Databricks) are deliberately held off until the phases they depend on are stable. Nothing here is built out of order for the sake of looking impressive sooner.

---

## License

Not yet decided. If you're viewing this and considering reuse, ask first.

---

## Author

Mortadha, ERP/BI Engineering Student, Tunisia
