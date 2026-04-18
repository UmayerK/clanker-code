---
name: claude-md-improver
description: Audit CLAUDE.md against the current codebase and capture session learnings back into it.
triggers: /revise-claude-md, claude.md, drift, conventions drifted, outdated rules, improve claude.md
---

## Problem
`CLAUDE.md` is the single most-read file in a Claude Code project — and the one most likely to rot. Rules stay after the code moves; learnings stay in the session and never land in the file. Outdated rules cause Claude to ignore current ones.

## Rule
- **Audit on `/revise-claude-md`:** read CLAUDE.md, then diff its rules against current repo state (`package.json`, `pyproject.toml`, detected tooling, `specs/` files).
- Flag items in these categories:
  - **Stale**: rule references a tool, path, or convention no longer in use.
  - **Missing**: the codebase follows a pattern not documented in CLAUDE.md.
  - **Contradictory**: two rules (or a rule vs. the code) conflict.
  - **Drifted**: rule still applies but has changed shape.
- **Capture session learnings:** at end of a session where the user corrected Claude's approach, propose a one-line addition to CLAUDE.md (under the appropriate section).
- Keep the root CLAUDE.md under ~80 lines; move deeper detail to `@specs/02-standards.md` via `@import`.
- Never silently edit CLAUDE.md — always propose a diff and wait for user confirmation.

## Output format
```md
### CLAUDE.md Audit — <date>

**Stale (remove):**
- L34: "Run `yarn test`" — repo uses pnpm (see package.json scripts)

**Missing (add):**
- Testing section is silent on Playwright, but specs mention it. Propose:
  "UI changes must be verified with Playwright before marking done."

**Drifted:**
- L22: "2-space indent" → repo has .editorconfig with 4-space for .py
```

## Example
User: `/revise-claude-md`

Claude (claude-md-improver mindset):
"Audited CLAUDE.md vs current repo. Three stale rules (yarn → pnpm, /src/lib → /src/utils, old eslint config path). Two missing rules (Playwright mandate isn't stated; conventional commits prefix list doesn't include `perf:`). Proposed diff attached — confirm to apply."
