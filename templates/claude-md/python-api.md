# Project Standards (clanker-code · Python API)

This section is managed by `clanker-code`. Edits outside the `<!-- clanker-code:start -->` / `<!-- clanker-code:end -->` markers are preserved by `clanker update`.

**Detected stack:** `{{STACK}}` · **Frameworks:** {{FRAMEWORKS}}

---

## 1. Python conventions

- **Type hints everywhere.** Use `from __future__ import annotations` at the top of modules that use forward references.
- **Pydantic** (or dataclasses) for request/response models. Validate at the boundary, trust internally.
- **Async/await** for I/O-bound work (DB, HTTP, filesystem). Don't mix sync and async DB drivers.
- **Dependency injection** — use FastAPI's `Depends()`, not global state.
- **One module per concern.** Split at ~300 lines.

## 2. MCPs to prefer

- **context7** — before using framework APIs (FastAPI, Django, SQLAlchemy change between versions).
- **sequential-thinking** — for request-flow, middleware, dependency resolution analysis.

## 3. Testing

- `pytest` with fixtures. Use `pytest-asyncio` for async tests.
- For FastAPI: use `TestClient` from `fastapi.testclient`.
- Separate unit tests (pure logic) from integration tests (hit endpoints + DB).
- Don't mock the database in integration tests — use a transactional fixture.

## 4. Security baseline

- **Input validation at every endpoint.** Pydantic models, strict mode.
- **Parameterized queries / ORM.** Never f-string SQL.
- **Authentication**: dependency at the route level or at the router level. Centralize.
- **Rate limit** sensitive endpoints (login, signup, password reset).
- **CORS**: allowlist origins.
- **Secrets**: env vars via `pydantic-settings` or `python-dotenv`. Never commit `.env`.
- **Log safely**: redact passwords and tokens.

## 5. Error handling

- Custom exception hierarchy: `APIError` → `NotFoundError`, `ValidationError`, `AuthError`.
- One exception handler per type at the app level. Return structured JSON errors.
- Let framework handle truly unexpected errors with a 500 and no stack trace to the client.

## 6. Dependencies

- Use `pyproject.toml` + `uv` or `poetry`. Avoid plain `requirements.txt` for new projects.
- Pin direct deps loosely (`>=1.2,<2`); pin transitive via lockfile.

## 7. Git

- Conventional commits. Small focused PRs. No force-push to main. No push without user permission.

## 8. Commands

`/brainstorm`, `/plan`, `/implement`, `/debug`, `/review`, `/test`, `/improve`, `/document`, `/design`, `/analyze`, `/mcp-help`, `/feat`, `/help`.

## 9. Specs

Feature specs in `specs/`. Start new work with `/feat <name>`.
