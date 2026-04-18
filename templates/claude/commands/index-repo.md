---
name: index-repo
description: Compress the repository into a minimal knowledge brief for efficient downstream use.
argument-hint: [--depth shallow|normal|deep] [--output <path>]
delegates-to: scribe
---

## Purpose
Produce a token-compressed briefing of the codebase — target a 90%+ reduction versus a raw file dump — that captures entry points, module responsibilities, public surfaces, and data flow.

## Inputs
- `--depth shallow` (default): top-level structure + entry points + public exports only.
- `--depth normal`: adds module responsibilities and key cross-module data flow.
- `--depth deep`: adds per-module invariants, failure modes, and extension points.
- `--output <path>`: write the brief to a file instead of chat (default: `specs/50-repo-index.md`).

## Behavior
1. Use `Glob` to enumerate all source files; use `Read` + `Grep` sparingly to inspect structure only.
2. Prefer Serena MCP for symbol-level overview if available — it is far cheaper than opening files.
3. Group findings by subsystem. For each subsystem, write: entry points, public functions, what owns what, what depends on what.
4. Never include raw source quotes longer than ~5 lines.
5. Produce an output under 3,000 tokens for a typical mid-sized repo, regardless of depth.

## Outputs
- A markdown brief with: tree skeleton, subsystem summaries, public surface list, data-flow narrative, notable constraints.
- Written to `specs/50-repo-index.md` by default. Downstream commands can read it cheaply.

## MCP routing
- **serena** (preferred): semantic overview without opening files.
- **sequential-thinking**: structure the compression plan before enumerating.
- **memory**: persist the brief summary so future sessions inherit it.
