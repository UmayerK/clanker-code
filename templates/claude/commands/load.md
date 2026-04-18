---
name: load
description: Load project context into the session — semantic overview plus specs, docs, and memory.
argument-hint: [--scope full|specs|recent] [--depth shallow|normal|deep]
delegates-to:
---

## Purpose
Hydrate the session with durable project context so subsequent commands act on accurate state. When Serena is available, start with its semantic overview — it's the cheapest way to understand a codebase.

## Inputs
- `--scope full` (default): project docs + specs + semantic overview + memory.
- `--scope specs`: specs/ only.
- `--scope recent`: only files touched in the last 7 days (via git log).
- `--depth`: controls how much detail to surface in the session header.

## Behavior
1. If Serena MCP is configured, request its semantic project overview first (symbols, not file bodies).
2. Read `CLAUDE.md`, `README.md`, `specs/00-product.md`, `specs/01-stack.md`, `specs/02-standards.md`.
3. For `--scope full`, also list all `specs/10-feature-*.md` files and their acceptance-criteria status.
4. Query memory MCP for any persisted project facts under the repo namespace.
5. Surface gaps: missing specs, stale docs, criteria drift.
6. Produce a compact session header ready for downstream commands.

## Outputs
- Session context header with stack, active specs, conventions.
- Serena overview link (if loaded).
- Gaps / staleness warnings list.
- Ready signal.

## MCP routing
- **serena** (preferred): semantic project overview, cheapest context hydration path.
- **memory**: recall prior session facts.
- **context7**: only on demand if a spec references a library.
