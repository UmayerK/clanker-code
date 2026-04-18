---
name: revise-claude-md
description: Audit CLAUDE.md against the current codebase and propose updates. Capture session learnings.
argument-hint: [--auto-from-session] [--uc]
delegates-to:
---

## Purpose
Keep `CLAUDE.md` honest. Audit its rules against current repo state and propose surgical updates. When `--auto-from-session`, also mine the current session for corrections the user made and propose CLAUDE.md additions that would have prevented them.

## Inputs
- `--auto-from-session`: analyze current conversation for corrections/clarifications, propose CLAUDE.md additions.

## Behavior
1. Read `CLAUDE.md` and the `<!-- clanker-code:start -->` / `<!-- clanker-code:end -->` markers.
2. Use `claude-md-improver` skill to classify rules: stale, missing, contradictory, drifted.
3. Check for drift signals:
   - Tool rules vs. actual scripts in `package.json` / `pyproject.toml`.
   - Path rules vs. directory structure.
   - Convention rules vs. linter/formatter config.
   - Command references vs. the shipped command set.
4. If `--auto-from-session`, scan the current conversation for:
   - Moments the user said "no, do X instead of Y" → propose adding a rule.
   - Moments the user gave durable guidance → propose capturing it.
5. Produce a **diff proposal** — never edit CLAUDE.md directly.
6. Wait for user confirmation before applying.
7. On apply, edit only the markers-delimited section; never touch user-owned content above or below.

## Outputs
- Categorized audit (stale / missing / contradictory / drifted).
- Proposed diff to CLAUDE.md.
- Session-derived additions (only with `--auto-from-session`).
- No changes until the user confirms.

## MCP routing
- **serena**: verify rules reference symbols that still exist.
- **sequential-thinking**: structure the audit across categories.
- **memory**: persist noteworthy corrections for future `--auto-from-session` calls.
