# Backend Agent Guidelines

## 1. Package Manager & Environment: Always Use `uv`
- **MANDATORY**: Always use **`uv`** as the Python package manager and virtual environment runner.
- **Commands**:
  - Install / sync dependencies: `uv sync`
  - Add packages: `uv add <package>` (or `uv add --dev <package>` for dev dependencies)
  - Remove packages: `uv remove <package>`
  - Run development server: `uv run uvicorn main:app --reload`
  - Run database migrations: `uv run alembic upgrade head`
  - Create new migration: `uv run alembic revision --autogenerate -m "<message>"`
  - Run scripts (e.g., database seeder): `uv run python -m src.shared.seed`
- **DO NOT** use raw `pip`, `poetry`, `pipenv`, or `conda`. Always maintain and commit updates to `pyproject.toml` and `uv.lock`.

---

## 2. Project Architecture & Directory Layout
Follow the defined modular architecture. Maintain strict separation of concerns across layers:

```text
backend/
├── alembic/                      # Alembic migrations configuration and revisions
│   └── versions/                 # Individual migration revision scripts
├── src/
│   ├── apps/                     # Modular domain-driven application modules
│   │   ├── dashboard_api/        # Dashboard API app module
│   │   │   ├── api/              # API route controllers (versioned, e.g., v1)
│   │   │   │   └── v1/           # Domain sub-routers (auth, apiKeys, models, etc.)
│   │   │   ├── schemas/          # Pydantic schemas (DTOs, request & response models)
│   │   │   └── services/         # Business logic, domain calculations, DB interactions
│   │   └── sdk_api/              # SDK / proxy gateway app module
│   └── shared/                   # Cross-cutting shared modules & infrastructure
│       ├── config.py             # Settings & environment configuration (pydantic-settings)
│       ├── database.py           # Async SQLAlchemy engine & session factory (get_db)
│       ├── security.py           # Authentication, JWT helpers, password hashing
│       ├── seed.py               # Seed scripts
│       └── models/               # SQLAlchemy ORM models (declarative models)
├── main.py                       # Application entrypoint & middleware configuration ONLY
├── models.json                   # Seed / reference data
├── pyproject.toml                # Project dependencies and packaging configuration
└── alembic.ini                   # Alembic configuration
```

---

## 3. Modularity & Anti-Monolith Rules
- **NEVER mash code into a single file**:
  - Every feature must be decomposed across its respective layers:
    - **`api/` (Routes)**: Handles HTTP routing, path parameters, dependency injection, and returns response schemas. **No direct business logic or SQL queries.**
    - **`schemas/` (Data Contracts)**: Pydantic models defining input validation and serialization contracts.
    - **`services/` (Business Logic)**: Pure business operations, database queries, external API integrations, and orchestration.
    - **`shared/models/` (Database Models)**: SQLAlchemy ORM entity definitions.
- **Entrypoint (`main.py`) Responsibility**:
  - Keep `main.py` minimal and clean.
  - It must ONLY handle FastAPI initialization, CORS/Session middleware setup, lifespan/event handlers, and mounting top-level app routers (e.g. `app.include_router(dashboard_api_router, prefix="/dashboard")`).
  - Do not define endpoint handlers directly inside `main.py`.

---

## 4. FastAPI & Async Best Practices
- **Dependency Injection**:
  - Use FastAPI's `Depends` for database sessions (`get_db`), authenticated user retrieval (`get_current_user`), and service instantiation.
- **Pydantic Schemas & Validation**:
  - Always validate incoming request payloads with Pydantic schemas.
  - Always specify `response_model` or type annotations on route handlers to enforce serialization and prevent leaking internal data.
  - Separate Create, Update, and Read schemas (e.g., `ApiKeyCreate`, `ApiKeyUpdate`, `ApiKeyResponse`).
- **Asynchronous Code Throughout**:
  - Use `async def` for route handlers and service functions performing I/O.
  - Always use asynchronous database access via SQLAlchemy 2.0 `AsyncSession` (`await session.execute(...)`, `await session.commit()`).
  - Use `httpx.AsyncClient` for outbound HTTP calls.
- **Error Handling**:
  - Raise `fastapi.HTTPException` with appropriate HTTP status codes (e.g. `status.HTTP_404_NOT_FOUND`, `status.HTTP_400_BAD_REQUEST`, `status.HTTP_401_UNAUTHORIZED`) and descriptive `detail` messages.
  - Catch domain-specific exceptions in routers or custom exception handlers rather than allowing unhandled 500 errors.

---

## 5. Database & Migrations
- Define new or updated models in `src/shared/models/`.
- Ensure new models are imported in `src/shared/models/__init__.py` and `alembic/env.py` so Alembic detects schema changes.
- Always generate an Alembic migration revision (`uv run alembic revision --autogenerate -m "..."`) and verify the migration script before applying.
