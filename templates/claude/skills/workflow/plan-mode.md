---
name: plan-mode
description: Use Claude Code's Plan Mode for Explore → Plan → Implement → Commit — don't leap to code.
triggers: /plan, plan this, before you code, explore then plan, design before, architecture
---

## Problem
Jumping to code skips exploration and produces rework. The canonical loop is Explore → Plan → Implement → Commit. Skipping Explore + Plan burns tokens and produces wrong-looking patches.

## Rule
- On `/plan <task>` (or any clear planning ask), **enter Plan Mode** — don't edit files.
- Explore phase: Read relevant files and specs/ before planning anything.
- Plan phase: produce a phased plan with concrete file-level actions. Write it to `specs/plans/<slug>.md` if the task is non-trivial.
- Each phase has explicit inputs, outputs, and a verification step.
- **Confirm the plan with the user** before exiting Plan Mode.
- Never edit files in Plan Mode; only Read, Glob, Grep, and WebFetch.
- Downstream commands (`/implement`, `/vibe`, `/feat`) should reference and execute the plan — not re-plan.

## Phase template

```md
## Plan: <task>

### Phase 1 — <name>
- Files to read: …
- Files to change: …
- Acceptance: …

### Phase 2 — <name>
…

### Open questions
- Q1
- Q2
```

## Example

```
User: /plan add password reset

Claude (Plan Mode):
I'll explore first.

Read: auth middleware, current session management, email utilities.

Plan (specs/plans/password-reset.md):

Phase 1 — API
- Create POST /api/auth/reset-request (email → token, rate-limited)
- Create POST /api/auth/reset-confirm (token + new password)
- Files: src/routes/auth.ts, src/lib/tokens.ts
- Acceptance: unit tests pass; token TTL 1h; rate-limit 3/hr per IP

Phase 2 — UI
- /reset page + /reset/[token] page
- Files: app/reset/page.tsx, app/reset/[token]/page.tsx
- Acceptance: Playwright: request → email → confirm → login

Phase 3 — Email
- SMTP helper + template
- Files: src/lib/mail.ts, src/emails/reset.tsx

Open questions:
- SMTP provider creds? (env required)

Confirm before I exit Plan Mode.
```
