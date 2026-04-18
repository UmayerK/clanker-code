---
name: test-before-commit
description: Verify the change actually works before claiming done or committing.
triggers: done, ready, finished, complete, commit, ship, working on
---

## Problem
"It compiles" is not "it works." Unverified changes become silent regressions that cost far more to fix later.

## Rule
- Run the relevant unit/integration tests locally.
- For UI changes, verify with Playwright MCP against the running app.
- Check happy path plus at least one error/empty state.
- Inspect console and network for new errors or warnings.
- Never mark a task done based on "should work" reasoning alone.
- If verification is impossible, say so explicitly; do not claim done.

## Example
```txt
Change: added /api/users pagination
Verified:
- pnpm test users.spec.ts: PASS
- GET /api/users?page=2 returns correct slice
- GET /api/users?page=999 returns empty array, 200
- Console clean, no failed requests
Ready to commit.
```
