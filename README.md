# SyncRouter

SyncRouter is a full-stack **AI router and proxy management platform** that provides a unified registry of AI models, providers, and per-token pricing — alongside Google OAuth2 authentication and secure user API key lifecycle management.

The platform lets users discover which providers offer a given AI model, compare token costs, provision their own `sync-...` API keys, and route requests through a single management dashboard.

---

## ⚡ Features

- **Model & Provider Catalog** — Searchable registry of AI companies, models, and supported providers seeded from `models.json`
- **Per-Token Pricing** — Input/output token costs per model-provider mapping (up to 6 decimal places)
- **Google OAuth2 Authentication** — Seamless login with automatic user creation, session cookies, and initial credit provisioning
- **JWT & HTTP-only Cookie Sessions** — Secure session management with `Authorization: Bearer` and cookie support
- **API Key Management** — Create, list (masked), rename, enable/disable, and soft-delete user API keys; keys are SHA-256 hashed before storage and shown in plaintext only once
- **Interactive API Docs** — Swagger UI & ReDoc generated automatically from the FastAPI backend
- **Modern Dashboard UI** — Next.js App Router frontend with React Query, Tailwind CSS v4, and shadcn-style components

---

## 🛠 Tech Stack

### Backend

| Layer | Technology |
| :--- | :--- |
| Framework | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+) |
| ORM & Database | [SQLAlchemy 2.0 (Async)](https://www.sqlalchemy.org/) + [asyncpg](https://github.com/MagicStack/asyncpg) + [PostgreSQL](https://www.postgresql.org/) |
| Migrations | [Alembic](https://alembic.sqlalchemy.org/) |
| Validation & Settings | [Pydantic v2](https://docs.pydantic.dev/) & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) |
| Auth & Security | Google OAuth2, [PyJWT](https://pyjwt.readthedocs.io/), HTTP-only session cookies, SHA-256 API key hashing |
| Package Manager | [uv](https://github.com/astral-sh/uv) |

### Frontend

| Layer | Technology |
| :--- | :--- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) + [Base UI](https://base-ui.com/) + [lucide-react](https://lucide.dev/) icons |
| Data Fetching | [TanStack React Query](https://tanstack.com/query) |
| Package Manager | [bun](https://bun.sh/) |

---

## 📁 Project Structure

```text
SyncRouter/
├── backend/                    # FastAPI asynchronous backend
│   ├── alembic/                # Database migration scripts & versions
│   ├── src/
│   │   ├── apps/
│   │   │   └── dashboard_api/  # Dashboard API app (auth, api-keys, models)
│   │   └── shared/             # Shared config, database, security, seed, ORM models
│   ├── main.py                 # FastAPI entrypoint & middleware
│   ├── models.json             # Seed data for companies, models & providers
│   ├── pyproject.toml          # Python dependencies (managed via uv)
│   └── .env.example            # Environment variable template
└── frontend/                   # Next.js dashboard & landing pages
    ├── app/                    # App Router pages
    │   ├── (dashboard)/        # Authenticated dashboard area
    │   └── (auth)/             # Login, OAuth success/error pages
    ├── components/              # React components
    ├── hooks/                  # React Query hooks
    ├── lib/                    # API client & utils
    ├── package.json            # JS dependencies (managed via bun)
    └── .env.example            # Environment variable template
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Python** `>= 3.13`
- **Node.js** `>= 20` (recommended)
- **Bun** `>= 1.3` for the frontend
- **uv** package manager for the backend ([install guide](https://docs.astral.sh/uv/getting-started/installation/))
- **PostgreSQL** `v14+` running locally

### 2. Backend Setup

```bash
cd backend

# Configure environment
cp .env.example .env

# Install dependencies
uv sync

# Run database migrations
uv run alembic upgrade head

# Seed AI companies, models & providers
uv run python -m src.shared.seed

# Start the development server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Configure environment
cp .env.example .env.local

# Install dependencies
bun install

# Start the development server
bun run dev
```

The frontend will be available at **`http://localhost:3000`**.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Database Connection (PostgreSQL with asyncpg driver)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/syncrouter

# Security & Sessions
SECRET_KEY=your-super-secret-session-key-change-in-production
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URL=http://localhost:8000/dashboard/api/v1/auth/google/callback

# Frontend Origin URL (for OAuth redirect & CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/dashboard/api/v1
```

---

## 📡 API Overview

All Dashboard API endpoints are prefixed under `/dashboard/api/v1`.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/api/v1/auth/google/login` | Initiate Google OAuth2 login flow | No |
| `GET` | `/dashboard/api/v1/auth/google/callback` | Google OAuth2 redirect callback | No |
| `GET` | `/dashboard/api/v1/auth/me` | Get current authenticated user & credit balance | **Yes** |
| `POST` | `/dashboard/api/v1/auth/logout` | Clear authentication session | No |
| `GET` | `/dashboard/api/v1/models` | List all AI models with company metadata | No |
| `GET` | `/dashboard/api/v1/models/providers` | List all supported AI providers | No |
| `GET` | `/dashboard/api/v1/models/{model_id}/providers` | Get providers & token pricing for a model | No |
| `POST` | `/dashboard/api/v1/api-keys` | Create an API key (**returns raw key once**) | **Yes** |
| `GET` | `/dashboard/api/v1/api-keys` | List masked API keys | **Yes** |
| `PATCH` | `/dashboard/api/v1/api-keys/{api_key_id}` | Update API key (rename, enable/disable) | **Yes** |
| `DELETE` | `/dashboard/api/v1/api-keys/{api_key_id}` | Soft-delete an API key | **Yes** |

### Interactive Documentation

Once the backend is running:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **OpenAPI JSON:** `http://localhost:8000/openapi.json`

> Detailed examples and response schemas are available in [`backend/README.md`](backend/README.md).

---

## 🔒 Security Notes

1. **API Keys** follow the `sync-...` format and are **SHA-256 hashed** before storage; they can never be retrieved in plaintext after creation.
2. **Session Cookies** are HTTP-only and `SameSite`-restricted to guard against XSS.
3. **CORS** is restricted to trusted client origins in `backend/main.py`.

---

## 🗂 Related Files

- Backend API documentation: [`backend/README.md`](backend/README.md)
- Backend dependency manifest: [`backend/pyproject.toml`](backend/pyproject.toml)
- Frontend dependency manifest: [`frontend/package.json`](frontend/package.json)
- Seed data source: [`backend/models.json`](backend/models.json)