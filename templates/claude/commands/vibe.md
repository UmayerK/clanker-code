---
name: vibe
description: Fuzzy idea → complete working app. Brainstorm, spec, plan, build, test, review — end to end.
argument-hint: <idea or one-line goal> [--strategy systematic|agile] [--depth normal|deep] [--validate] [--uc]
delegates-to: project-manager
---

## Purpose
Take a vague idea and turn it into a tested, reviewed, working implementation — in one conversation. `/vibe` is the "build me something that does X" entry point. It runs the full clanker-code pipeline: discovery → spec → plan → parallel build → test → reflection. Uses wave orchestration under the hood.

## Inputs
- `<idea>`: plain-language description of what you want. Can be as vague as "a todo app with teams" or as specific as a full PRD paragraph.
- `--strategy agile` (default): smallest working slice first, iterate. `--strategy systematic`: full breadth from the start.
- `--depth normal` (default): cover the obvious surface. `--depth deep`: also handle edge cases, empty states, error states in first pass.
- `--validate` (default: on): run `/reflect --validate` before declaring done; fix gaps automatically and loop until green.
- `--uc`: terse responses throughout.

## Behavior

**Phase 1 — Discovery (Socratic, one question at a time):**
1. Restate the idea back in one sentence to confirm.
2. Ask the single most important clarifying question. Prefer multiple-choice when useful (see `/brainstorm` Behavior section).
3. Push back on unnecessary complexity. Separate MVP / V1 / later.
4. Continue until the core product is unambiguous (typically 3–6 questions, not more).

**Phase 2 — Spec:**
5. Write `specs/10-feature-<kebab-name>.md` using the Feature spec template (Problem / Scope / UX Notes / Acceptance Criteria / Edge Cases / Technical Notes).
6. Show the user the spec and get a one-word confirmation before building.

**Phase 3 — Plan (wave 1, single agent):**
7. Delegate to `planner`: produce an ordered step list mapping each acceptance criterion to files/modules to create or change.

**Phase 4 — Build (wave 2, parallel, no file overlap):**
8. Delegate in parallel:
   - `backend-builder` → data model, APIs, business logic, backend tests.
   - `frontend-builder` → UI routes, components, client behavior, Playwright verification.
   - `doc-writer` → README section or feature doc.
9. Agents never touch the same file. If they must, serialize them.

**Phase 5 — Test (wave 3a):**
10. Delegate to `tester`: run the full suite, add missing tests for each acceptance criterion, verify UI with Playwright (navigate → snapshot → interact → snapshot → check console + network).

**Phase 6 — Review (wave 3b):**
11. Delegate to `reviewer`: diff review against project standards (OWASP, input validation, no-hardcoded-secrets, a11y basics, framework skills).

**Phase 7 — Reflect (wave 4, validation gate):**
12. If `--validate` is on (default), run `/reflect --depth deep --validate`.
13. If any criterion is unmet, generate a fix list and loop back to the right wave (build for missing features, test for missing coverage, review for quality issues). Max 3 loops.

**Phase 8 — Finalize:**
14. Print: spec file path, files changed, tests added, test results, open questions.
15. Suggest a conventional-commit message; stop (do not auto-commit, do not auto-push).

## Outputs
- One filled `specs/10-feature-<name>.md`.
- Implementation diff covering every acceptance criterion.
- Test suite run result (pass/fail, coverage delta).
- Review report (any findings with file:line refs).
- Reflection verdict (every criterion met / fix list).
- Suggested commit message.

## Safety rails
- Never commits or pushes without the user's explicit go-ahead.
- Never overwrites existing files in `specs/` without confirmation.
- If the idea requires infrastructure decisions (DB choice, hosting, auth provider), `/vibe` stops at Phase 2 and asks — doesn't guess.
- If tests fail and the fix loop hits 3 iterations, stops and hands control back with a clear report.

## MCP routing
- **sequential-thinking** — structure the discovery phase and wave consolidation.
- **memory** — persist the feature brief for cross-session resumption.
- **context7** — any time Phase 4 touches an unfamiliar library API.
- **serena** *(if available)* — used by `planner` for repo overview and by `reviewer` for semantic diff checks.
- **playwright** — required in Phase 5 for any UI work.

## Example
```
/vibe an app where my team logs daily standups and a bot summarizes the week

# Phase 1 (excerpted)
> Question 1: Are teams fixed or multi-tenant? [A] one team per deploy  [B] multi-tenant with team IDs
You: A
> Question 2: Auth? [A] email+password  [B] SSO only  [C] magic links  [D] no auth, trusted network
You: C
> Question 3: Summarizer — real LLM API or templated text for MVP?
You: templated for MVP

# Phase 2
Wrote specs/10-feature-standups.md — review ok?
You: yes

# Phase 3-7 run automatically
✓ specs/10-feature-standups.md
✓ Implementation: 11 files changed, 4 new routes, 2 pages, 1 cron
✓ Tests: 14/14 passing, +3 e2e for the standup flow
✓ Review: clean, 2 minor a11y fixes applied
✓ Reflect: 7/7 acceptance criteria met

Suggested commit: feat(standups): daily standup logging + weekly digest
```
