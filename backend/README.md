# SyncRouter Backend

FastAPI-powered asynchronous backend service for SyncRouter — an AI router and proxy management platform featuring Google OAuth2 authentication, model & provider token routing registry, and user API key lifecycle management.

---

## 🛠 Tech Stack

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+)
- **ORM & Database:** [SQLAlchemy 2.0 (Async)](https://www.sqlalchemy.org/) + [asyncpg](https://github.com/MagicStack/asyncpg) + [PostgreSQL](https://www.postgresql.org/)
- **Database Migrations:** [Alembic](https://alembic.sqlalchemy.org/)
- **Validation & Settings:** [Pydantic v2](https://docs.pydantic.dev/) & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **Authentication & Security:** Google OAuth2, JWT ([PyJWT](https://pyjwt.readthedocs.io/)), HTTP-only session cookies & Bearer tokens, SHA-256 API key hashing
- **Package Manager:** [uv](https://github.com/astral-sh/uv)

---

## 📁 Project Structure

```text
backend/
├── alembic/                      # Database migration scripts & environment
│   └── versions/                 # Alembic migration revisions
├── src/
│   ├── apps/
│   │   └── dashboard_api/        # Dashboard API app module
│   │       ├── api/v1/           # API v1 route controllers
│   │       │   ├── auth/         # Authentication & Google OAuth handlers
│   │       │   ├── apiKeys/      # User API Key CRUD endpoints
│   │       │   └── models/       # AI Models & Providers catalog endpoints
│   │       ├── schemas/          # Pydantic request/response schemas
│   │       └── services/         # Business logic & database operations
│   └── shared/                   # Shared modules across apps
│       ├── config.py             # Pydantic app configuration & env parsing
│       ├── database.py           # Async SQLAlchemy engine & session factory
│       ├── security.py           # JWT creation/decoding & auth dependencies
│       ├── seed.py               # Database seeder from models.json
│       └── models/               # SQLAlchemy ORM models (User, Credit, ApiKey, AIModel, etc.)
├── main.py                       # FastAPI application entrypoint & middleware configuration
├── models.json                   # Seed data for AI companies, models, and provider costs
├── pyproject.toml                # Project metadata and dependencies
└── alembic.ini                   # Alembic configuration
```

---

## ⚙️ Prerequisites

- **Python:** `>= 3.13`
- **Package Manager:** [`uv`](https://docs.astral.sh/uv/getting-started/installation/) (recommended) or `pip`
- **Database:** PostgreSQL (v14+)

---

## 🚀 Application Setup

### 1. Clone & Navigate to Backend

```bash
cd backend
```

### 2. Environment Configuration

Copy the example environment file and configure your environment variables:

```bash
cp .env.example .env
```

Populate the `.env` file with your credentials:

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

### 3. Install Dependencies

Using `uv`:
```bash
uv sync
```

*(Alternatively with standard virtualenv & pip)*:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 4. Run Database Migrations

Apply all database schema migrations to your PostgreSQL database:

```bash
uv run alembic upgrade head
```

### 5. Seed Initial AI Models & Providers

Populate AI companies, providers, models, and token pricing into the database from `models.json`:

```bash
uv run python -m src.shared.seed
```

### 6. Start the Development Server

Launch the FastAPI application with auto-reload:

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: **`http://localhost:8000`**

---

## 📖 Interactive API Documentation

Once the server is running, explore and test the endpoints interactively:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON Schema:** [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 📡 Available API Endpoints

All Dashboard API endpoints are prefixed under `/dashboard/api/v1`.

### 1. General & System Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root health check / status endpoint | No |
| `GET` | `/openapi.json` | Raw OpenAPI 3.1 JSON schema definition | No |
| `GET` | `/docs` | Swagger interactive UI documentation | No |
| `GET` | `/redoc` | ReDoc alternative UI documentation | No |

---

### 2. Authentication (`/dashboard/api/v1/auth`)

Authentication supports both **HTTP-only Cookies** (`access_token`) and **HTTP Authorization headers** (`Authorization: Bearer <token>`).

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/api/v1/auth/google/login` | Initiates Google OAuth2 login flow, creates session state, and redirects to Google | No |
| `GET` | `/dashboard/api/v1/auth/google/callback` | Google OAuth2 redirect callback. Verifies token, creates/logs in user, provisions initial credits, sets session cookie, and redirects to frontend | No |
| `GET` | `/dashboard/api/v1/auth/me` | Returns current authenticated user profile along with active credit balance | **Yes** |
| `POST` | `/dashboard/api/v1/auth/logout` | Clears authentication session cookie | No |

#### `GET /dashboard/api/v1/auth/me` Example Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "Jane Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "is_active": true,
  "credits": 1000,
  "created_at": "2026-09-05T12:00:00Z",
  "updated_at": "2026-09-05T12:00:00Z"
}
```

---

### 3. AI Models & Providers (`/dashboard/api/v1/models`)

Endpoints to fetch AI models catalog, supported providers, and per-token pricing mappings.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/api/v1/models` | Get all available AI models with their parent company metadata | No |
| `GET` | `/dashboard/api/v1/models/providers` | Get list of all supported AI providers (e.g., OpenAI, Anthropic, OpenRouter) | No |
| `GET` | `/dashboard/api/v1/models/{model_id}/providers` | Get all providers offering a specific model along with input/output token pricing | No |

#### `GET /dashboard/api/v1/models` Example Response:
```json
[
  {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "company_id": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    "name": "GPT-4o",
    "slug": "gpt-4o",
    "company": {
      "id": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      "name": "OpenAI",
      "website": "https://openai.com",
      "created_at": "2026-09-05T10:00:00Z",
      "updated_at": "2026-09-05T10:00:00Z"
    },
    "created_at": "2026-09-05T10:00:00Z",
    "updated_at": "2026-09-05T10:00:00Z"
  }
]
```

#### `GET /dashboard/api/v1/models/{model_id}/providers` Example Response:
```json
[
  {
    "id": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    "mapping_id": "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
    "name": "OpenRouter",
    "website": "https://openrouter.ai",
    "input_token_cost": 0.000005,
    "output_token_cost": 0.000015,
    "created_at": "2026-09-05T10:00:00Z",
    "updated_at": "2026-09-05T10:00:00Z"
  }
]
```

---

### 4. API Keys Management (`/dashboard/api/v1/api-keys`)

Secure management of user API keys (`sync-...`). Raw API keys are hashed with SHA-256 before storage and are only returned in plaintext once upon creation.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/dashboard/api/v1/api-keys` | Generate a new API key. **Returns raw key secret once** | **Yes** |
| `GET` | `/dashboard/api/v1/api-keys` | List all active API keys for the authenticated user (masked: `sync-xxxx...xxxx`) | **Yes** |
| `PATCH` | `/dashboard/api/v1/api-keys/{api_key_id}` | Update API key details (rename, enable/disable `is_active`) | **Yes** |
| `DELETE` | `/dashboard/api/v1/api-keys/{api_key_id}` | Soft delete an API key | **Yes** |

#### `POST /dashboard/api/v1/api-keys`
**Request Body:**
```json
{
  "name": "Production Server Key"
}
```

**Response (Status: 201 Created):**
```json
{
  "id": "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
  "name": "Production Server Key",
  "api_key": "sync-live-a1b2c3d4e5f67890abcdef1234567890",
  "is_active": true,
  "created_at": "2026-09-05T12:30:00Z",
  "updated_at": "2026-09-05T12:30:00Z"
}
```

#### `GET /dashboard/api/v1/api-keys`
**Response (Masked Keys):**
```json
[
  {
    "id": "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
    "name": "Production Server Key",
    "api_key": "sync-live-a1b2...7890",
    "is_active": true,
    "created_at": "2026-09-05T12:30:00Z",
    "updated_at": "2026-09-05T12:30:00Z"
  }
]
```

#### `PATCH /dashboard/api/v1/api-keys/{api_key_id}`
**Request Body:**
```json
{
  "name": "Updated Key Name",
  "is_active": false
}
```

#### `DELETE /dashboard/api/v1/api-keys/{api_key_id}`
**Response:**
```json
{
  "message": "API key deleted successfully"
}
```

---

## 🔒 Security Best Practices

1. **API Keys:** API keys follow the `sync-...` format and are hashed using SHA-256 before storage in PostgreSQL. Keys can never be retrieved in plaintext after creation.
2. **Session Cookies:** The access token is stored in an HTTP-only, SameSite cookie to guard against XSS vulnerabilities.
3. **CORS:** Configured in [main.py](file:///Users/ashwanikharwar/workspace/SyncRouter/backend/main.py) to restrict allowed origins to trusted client applications.
