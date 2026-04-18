# Project Standards (clanker-code · Node API)

This section is managed by `clanker-code`. Edits outside the `<!-- clanker-code:start -->` / `<!-- clanker-code:end -->` markers are preserved by `clanker update`.

**Detected stack:** `{{STACK}}` · **Frameworks:** {{FRAMEWORKS}}

## Imported context (lazy-loaded on demand)

See @specs/00-product.md for product context.
See @specs/01-stack.md for stack details beyond Node API conventions.
See @specs/02-standards.md for project-specific conventions.

---

## 1. API conventions

- **REST**: nouns for resources, HTTP verbs for actions. Use proper status codes (201 on create, 204 on delete, 400/401/403/404/409/422, 500).
- **Versioning**: `/v1/...` in URL or `Accept-Version` header. Pick one and stay consistent.
- **Errors**: return structured JSON `{ error: { code, message, details } }`. Never leak stack traces to clients.
- **Pagination**: cursor-based for new endpoints. Return `{ items, nextCursor }`.
- **Idempotency**: PUT and DELETE must be idempotent. POST can accept `Idempotency-Key` header for retry safety.

## 2. MCPs to prefer

- **context7** — before using any framework API (Express/Fastify/Hono middlewares change behavior across versions).
- **sequential-thinking** — for request-flow, middleware ordering, error-propagation analysis.
- **serena** *(if configured)* — symbol-level refactors, find-usages, impact analysis. See `serena-semantic-editing` skill.

## 2a. Working smart

- **Auto-activate specialist mindsets** — security questions get OWASP lens, perf questions demand measurements, arch questions get ADR treatment. See `persona-auto-activation` skill.
- **Global flags**: `--strategy systematic|agile|enterprise`, `--depth shallow|normal|deep`, `--parallel`, `--validate`, `--uc`. Flags compose. See `command-flags-spec` skill.
- **Multi-agent work** uses wave orchestration (plan → build → verify). Entry points: `/pm`, `/spawn`. See `wave-orchestration` skill.

## 3. Testing

- Unit tests for pure logic (validators, transformers, business rules).
- Integration tests for handlers: mount a real router in memory, call endpoints, assert status + body.
- Never mock the database in integration tests that verify SQL correctness — use a test DB or sqlite in-memory.

## 4. Security baseline

- **Input validation at every endpoint boundary.** Use zod, valibot, or joi. Don't trust anything from `req.body`, `req.query`, `req.params`, or headers.
- **Parameterized queries only.** Never string-concat user input into SQL.
- **Auth middleware on every protected route.** Centralize auth checks; don't sprinkle them.
- **Rate limit** sensitive endpoints: login, signup, password reset, API keys.
- **CORS**: allowlist origins, don't use `*` in production.
- **Helmet/security headers**: set `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, etc.
- **Secrets**: env vars only. Never commit `.env`.
- **Log safely**: never log passwords, tokens, raw request bodies.

## 5. Error handling

- One error-handling middleware at the end of the chain.
- Wrap async handlers or use a framework that does (Fastify, newer Express).
- Distinguish operational errors (user-facing) from programmer errors (500).

## 6. Git

- Conventional commits. Small focused PRs. No force-push to main. No push without user permission.

## 7. Commands

`/vibe`, `/brainstorm`, `/implement`, `/debug`, `/review`, `/test`, `/improve`, `/document`, `/design`, `/analyze`, `/index`, `/select-tool`, `/pm`, `/recommend`, `/reflect`, `/mcp-help`, `/feat`, `/help`.

## 8. Specs

Feature specs in `specs/`. Start new work with `/feat <name>`.
