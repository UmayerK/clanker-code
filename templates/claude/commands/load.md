---
name: load
description: Load project context into the current session from specs, READMEs, and memory.
argument-hint: [--scope full|specs|recent]
delegates-to:
---

## Purpose
Hydrate the session with durable project context so subsequent commands act on accurate state.

## Inputs
- `--scope`: `full` (default), `specs` only, or `recent` changes only.

## Behavior
1. Read `CLAUDE.md`, `README.md`, and `specs/*.md` based on scope.
2. Summarize architecture, conventions, and in-flight features.
3. Query the memory MCP for prior session notes if available.
4. Produce a compact session header listing active specs and conventions.
5. Confirm context before proceeding to the user's next request.

## Outputs
- Session context summary with active specs and conventions.
- List of stale or missing docs detected.
- Ready signal for subsequent commands.
