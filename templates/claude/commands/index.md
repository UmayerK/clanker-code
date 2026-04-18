---
name: index
description: Generate a project documentation index, or a token-compressed repo brief with --brief.
argument-hint: [--brief] [--output <path>] [--depth shallow|normal|deep] [--uc]
delegates-to: scribe
---

## Purpose
Produce a navigable structure for the repo. Two modes:
- **Default**: a full index (`docs/INDEX.md`) with links and descriptions.
- **`--brief`** (replaces the dropped `/index-repo`): a <3K-token knowledge brief suitable as cheap context for downstream commands.

## Inputs
- `--brief`: switch to compressed mode. Output goes to `specs/50-repo-index.md` by default.
- `--output <path>`: override destination.
- `--depth shallow|normal|deep`: controls how much detail is surfaced.

## Behavior

**Default mode (full index):**
1. Delegate to `scribe` to walk the repository tree.
2. Categorize files: entry points, modules, configs, tests, docs.
3. Extract purpose from top-of-file comments or exported symbols.
4. Link to existing READMEs, specs, architecture docs.
5. Write or update the index file.

**`--brief` mode (compressed brief):**
1. Prefer Serena for symbol-level overview if available — far cheaper than opening files.
2. Group findings by subsystem: entry points, public surfaces, what owns what, data-flow narrative.
3. Never include raw source quotes longer than ~5 lines.
4. Target output <3,000 tokens regardless of depth.
5. Write to `specs/50-repo-index.md` by default.

## Outputs
- Default: full index with grouped links and descriptions, plus a list of undocumented modules.
- `--brief`: compressed markdown brief readable by other commands as cheap context.

## MCP routing
- **serena**: enumerates exported symbols and module boundaries semantically (essential for `--brief`).
- **memory**: caches the map for reuse by subsequent commands.
- **sequential-thinking**: structures the compression plan in `--brief` mode.
