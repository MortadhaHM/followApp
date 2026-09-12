<div align="center">

# MorTrack

**A full-stack personal finance platform — built to solve a real problem, grown phase by phase into a data engineering and business intelligence portfolio project.**

[![Live App](https://img.shields.io/badge/Live%20App-follow--app--rho.vercel.app-black?style=for-the-badge&logo=vercel&logoColor=white)](https://follow-app-rho.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-MortadhaHM%2FfollowApp-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MortadhaHM/followApp)

<img width="400" alt="MorTrack Logo" src="https://github.com/user-attachments/assets/b5db61cb-b670-44b8-8a29-99fc41fdd779" />

</div>

---

## About

This project didn't start as a portfolio piece. It started because I needed to know where my money was going and couldn't find an app that fit how I actually think about my finances, so I built one.

I'm an ERP/BI engineering student in Tunisia. The plan for this project has always been sequential: use it myself first, get it solid, then let it double as proof of full-stack and data engineering skills for job applications, particularly for data engineering roles in France, where tools like Databricks are in demand.

It is not a tutorial project and not built on a synthetic dataset. Every transaction in it is real.

**Status:** actively being built. Phases 1, 1v2, 2, 3 (data warehouse with orchestration), and 4 (Power BI dashboards) are complete. Phase 5 (real-time pipeline) is next.

### Name and Logo

The app is named **MorTrack** — a combination of my name, Mortadha, and "track," reflecting what the app actually does. The logo is a bat emblem, a personal touch inspired by Batman, redesigned with a bar chart and an upward trendline built into the wings, tying the visual identity back to the app's purpose: tracking and growing financial awareness.

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

### Frontend & Backend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

### Database & Hosting

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

### Data Engineering

![dbt](https://img.shields.io/badge/dbt-FF694B?style=for-the-badge&logo=dbt&logoColor=white)
![Apache Airflow](https://img.shields.io/badge/Apache%20Airflow-017CEE?style=for-the-badge&logo=apache-airflow&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)

### Business Intelligence & ML

![Power BI](https://img.shields.io/badge/Power%20BI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![MLflow](https://img.shields.io/badge/MLflow-0194E2?style=for-the-badge&logo=mlflow&logoColor=white)
![Databricks](https://img.shields.io/badge/Databricks-FF3621?style=for-the-badge&logo=databricks&logoColor=white)

### Full Stack Summary

| Layer | Tool | Status |
|---|---|---|
| Frontend (Core) | React (Vite) | In use |
| Frontend (Analytics Standalone) | Angular 19 (Standalone) | In use |
| Backend (API) | FastAPI (Python) | In use |
| Backend (App Server) | Node.js (Express) | In use |
| Database | PostgreSQL, hosted on Supabase | In use |
| Frontend hosting | Vercel | In use |
| Backend hosting | Render | In use |
| DB client | DBeaver | In use |
| ETL transformations | dbt | Phase 3 complete |
| Data integration | Airbyte | Pending — enters when external sources are added |
| Orchestration | Apache Airflow (Docker Compose) | Phase 3 complete — nightly DAG running |
| BI (portfolio) | Power BI Desktop | Phase 4 complete — 4-page dashboard |
| BI (in-app embed) | Power BI Embedded (`/analytics`) | Complete — native dark gold framing |
| Streaming | Apache Kafka | Phase 5 |
| ML | scikit-learn, MLflow | Phase 6 |
| Large-scale platform (optional) | Databricks, Delta Lake, Spark | Under consideration |

> The database was originally on Render's free managed PostgreSQL, which expires after 90 days. It has since been migrated to Supabase for permanent free hosting — noted here because it's a real lesson, not a hypothetical one.

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

> **Note:** the repository and live app URL still reference the original project name, `followApp`. They remain unchanged for now to avoid breaking existing links; a rename is a possible future cleanup step.

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

<img width="1432" height="802" alt="image" src="https://github.com/user-attachments/assets/51ceb922-70d6-433e-98f6-660f7541ccb9" />

### Categories — "Where Your Money Goes"

Breaks down spending by category: Top Category, Top Category Share, Top Category Amount, a Top Spending Categories chart, a Most Frequent Purchases chart (by transaction count, not amount), and a This Month vs Last Month comparison anchored to `TODAY()` to handle the fact that `dim_date` contains future dates.

<img width="1435" height="802" alt="image" src="https://github.com/user-attachments/assets/6f19e3b0-b3c3-4fd3-800d-12518cf5a5e7" />

### Time Patterns — "When You Spend"

Spending behavior over time: Top Spending Day, Weekend Spending %, a Spending by Day of Week chart, and a Weekly Spending Trend line chart across the weeks of the month.

<img width="1431" height="802" alt="image" src="https://github.com/user-attachments/assets/1b0fa01f-1b2f-4b27-8603-b8554307c450" />

### Income — "Money In"

Focused exclusively on income: Total Income, Top Income Source, Top Income Source Share, an Income by Source chart, and a Monthly Income chart.

<img width="1431" height="805" alt="image" src="https://github.com/user-attachments/assets/a4681114-7907-4372-aae5-c1590ed21c47" />

---

## Power BI Embedded Analytics (Dedicated `/analytics` Page)

MorTrack integrates a dedicated Analytics page (`/analytics`) displaying the completed 4-page Power BI report directly inside the web interface without any extraneous Power BI chrome (no filters pane, no page navigation tabs, and no white letterboxing).

### Clean Embed Architecture
The Angular standalone component (`app/src/app/pages/analytics/analytics.component.ts`) and React component (`finance-app/frontend/src/pages/Analytics.jsx`) are configured to render the dashboard natively within MorTrack:

1. **Explicit Microsoft URL Parameters for Zero Chrome:**
   ```
   https://app.powerbi.com/reportEmbed?reportId=553d2c00-97f0-4483-9fef-05deb79dce25&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&filterPaneEnabled=false&navContentPaneEnabled=false
   ```
   - `filterPaneEnabled=false`: Completely hides the collapsible Power BI filter pane on the right.
   - `navContentPaneEnabled=false`: Completely hides the bottom Power BI page navigation tabs.
   - `autoAuth=true`: Uses the active browser session at `app.powerbi.com` without exposing credentials.

2. **16:9 Canvas Aspect-Ratio Container:**
   - The report canvas naturally has a 16:9 aspect ratio.
   - By sizing the canvas frame with `aspect-ratio: 16 / 9`, `max-width: calc((100vh - 82px) * 16 / 9)`, and `max-height: calc((100vw - 32px) * 9 / 16)`, the Power BI report fills the frame edge-to-edge.
   - The surrounding container is set to MorTrack's dark background (`var(--bg): #050505`), eliminating the bright white margin bars on the left and right.

3. **Subtle Yellow/Gold Framing:**
   - The embedded report container is framed with a subtle 1px border (`border: 1px solid var(--navbar-border)`) using the exact same yellow/gold token (`rgba(212, 175, 55, 0.15)`) as the horizontal separator below MorTrack's navbar.
   - Slightly rounded corners (`border-radius: 8px`) and soft ambient shadows (`box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5)`) give it a sleek, integrated look without modifying any internal report visuals.

4. **Power BI JavaScript SDK (`powerbi-client`) Integration:**
   - The project incorporates Microsoft's official `powerbi-client` library.
   - `AnalyticsComponent` initializes `@ViewChild('reportContainer')` and configures `service.Service` with `models.BackgroundType.Transparent`, `models.DisplayOption.FitToWidth`, and hidden panes.
   - **Technical Note on SDK Authentication:** In `powerbi-client` (Embed.ts line 7775), Microsoft explicitly throws `EmbedUrlNotSupported` if `autoAuth=true` is used with `powerbi.embed()`. This is because the JavaScript client API is designed exclusively for Azure AD Bearer tokens or backend Embed tokens. MorTrack automatically handles this by utilizing the clean session URL for immediate demo use and providing the complete SDK pipeline when an Azure AD token is supplied.

### Power BI Login Requirement
The user must have access to the report workspace and be signed into [Power BI Service](https://app.powerbi.com) in the same browser session. When navigating to `/analytics`:
- If already logged in, Power BI automatically authorizes and renders the report seamlessly.
- If prompted to sign in within the iframe, the user must authenticate with their authorized Power BI account.

### Browser Recommendation
**Microsoft Edge** is strongly recommended for this demo. Iframe authentication and cross-domain cookie behavior can vary across browsers; Edge provides seamless single-sign-on (SSO) and avoids third-party cookie restrictions that may block the Power BI session from loading.

### Demo Limitation & Production Path
> [!IMPORTANT]
> **This is a demo embedding approach.**
> - The MorTrack application login does **NOT** automatically determine or map to the Power BI identity.
> - Report access and permissions are entirely governed by the user's active Power BI Service session.
> - This demo implementation does **NOT** provide production-grade per-user Power BI data isolation.
> - Full production deployment will implement Power BI Embedded "App owns data" with an Azure App Registration, a Node backend REST API endpoint generating embed tokens, and dynamic Row-Level Security (RLS) bound to MorTrack's `user_id`.

## Running the Angular & Node.js Production Build

### Project Structure
```
MorTrack/
├── app/                  # Angular 19 Standalone application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/navbar/  # MorTrack header & navigation
│   │   │   ├── pages/analytics/    # Power BI iframe component
│   │   │   └── pages/transactions/ # Transactions component
│   │   └── styles.css              # MorTrack dark theme design tokens
│   ├── angular.json
│   └── package.json
├── server/               # Minimal Node.js Express server
│   ├── server.js         # Static file serving & SPA fallback
│   └── package.json
└── README.md
```

### 1. Installation
Install dependencies for both the Angular application and the Express server:

```bash
# Install Angular dependencies
cd app
npm install

# Install Express server dependencies
cd ../server
npm install
```

### 2. Angular Production Build
Build the Angular application for production:

```bash
cd app
npm run build
```

This compiles the standalone Angular app to `app/dist/app/browser`.

### 3. Start Node.js Express Server
Start the production server:

```bash
cd server
node server.js
```
*(Or `npm start` from within the `server/` directory)*

Once running, access the application in your browser (preferably Microsoft Edge):
- **Home / Transactions:** `http://localhost:3000/transactions`
- **Dedicated Power BI Analytics:** `http://localhost:3000/analytics`

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

## Screenshots (Application)

### Core Web Application (Transactions, Onboarding, Settings)
<img width="1917" height="927" alt="image" src="https://github.com/user-attachments/assets/033be41e-1b81-4e4c-8721-c396d2e21d81" />
<img width="1915" height="932" alt="image" src="https://github.com/user-attachments/assets/9103ac89-3122-49a7-96c6-9ee7a3db41b2" />
<img width="1892" height="925" alt="image" src="https://github.com/user-attachments/assets/e5aa04e4-e63a-453c-878e-65fb9eb6ff94" />
<img width="1897" height="931" alt="image" src="https://github.com/user-attachments/assets/b4ab309c-d110-4197-ba1a-3731615a781f" />
<img width="1887" height="920" alt="image" src="https://github.com/user-attachments/assets/124799c6-4280-4e42-954a-4ae4963adeda" />



---

### In-App Power BI Dashboards (`/analytics`)

> The 4-page Power BI analytical report embedded natively into the MorTrack web application, featuring the dark gold theme framing and zero external Power BI chrome.

#### 1. Overview — "How Am I Doing?" (In-App)
<!-- TODO: Add your in-app Overview screenshot below -->
<img width="1896" height="930" alt="image" src="https://github.com/user-attachments/assets/b9b13567-f205-455d-a940-284a9a604c0f" />

#### 2. Categories — "Where Your Money Goes" (In-App)
<!-- TODO: Add your in-app Categories screenshot below -->
<img width="1891" height="923" alt="image" src="https://github.com/user-attachments/assets/1656135e-1526-4f21-abef-8fb8b9ea7979" />

#### 3. Time Patterns — "When You Spend" (In-App)
<!-- TODO: Add your in-app Time Patterns screenshot below -->
<img width="1890" height="922" alt="image" src="https://github.com/user-attachments/assets/ba7a25e4-ce6a-4b4e-b357-18b490ef4515" />

#### 4. Income — "Money In" (In-App)
<!-- TODO: Add your in-app Income screenshot below -->
<img width="1890" height="927" alt="image" src="https://github.com/user-attachments/assets/308df0fe-7da5-4b09-88e4-fe31e0d7fee4" />

---

## License

Not yet decided. If you're viewing this and considering reuse, ask first.

---

## Author

<div align="center">

**Mortadha HOUIMELI**  
ERP/BI Engineering Student — Tunisia

[![GitHub](https://img.shields.io/badge/GitHub-MortadhaHM-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MortadhaHM)

</div>
