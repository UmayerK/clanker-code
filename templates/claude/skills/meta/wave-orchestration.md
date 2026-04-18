---
name: wave-orchestration
description: Layered multi-agent coordination for complex tasks — plan, build, verify in structured waves.
triggers: multi-step, parallel, orchestrate, coordinate, spawn, full-stack, feature end-to-end, /pm, /spawn
---

## Problem
Large tasks fail when done serially (slow) or flat-parallel (agents clash, no hand-offs). Structured "waves" batch compatible work and explicitly hand off artifacts between layers.

## Rule
- A wave is a set of agents working independently on compatible sub-tasks.
- Between waves, a single agent consolidates before the next wave starts.
- Typical 3-wave pattern: **plan** → **build** → **verify**.
- Inside a wave, agents never modify the same file. If they must, serialize them.
- Each wave has a named output (spec, diff, report). The next wave consumes that output.
- Never run wave N+1 before wave N is consolidated.

## Example
Task: Ship a password-reset flow end-to-end.

Wave 1 — plan (single agent):
- `planner` produces `specs/12-feature-password-reset.md` with acceptance criteria.

Wave 2 — build (parallel, no file overlap):
- `backend-builder` → `/api/auth/reset-request`, `/api/auth/reset-confirm`, tests
- `frontend-builder` → `/reset` page, `/reset/[token]` page
- `doc-writer` → README section

Wave 3 — verify (single):
- `reviewer` runs `/reflect --depth deep --validate` on combined diff.
- `tester` runs full suite, adds e2e test for the flow.

Report only after Wave 3 green.
