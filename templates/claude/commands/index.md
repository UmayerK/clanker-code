---
name: index
description: Generate a navigable project documentation index.
argument-hint: [--output docs/INDEX.md]
delegates-to: scribe
---

## Purpose
Produce a single index that maps the repository's structure, entry points, and key docs.

## Inputs
- `--output`: destination path; defaults to `docs/INDEX.md`.

## Behavior
1. Delegate to `scribe` to walk the repository tree.
2. Scribe categorizes files by type: entry points, modules, configs, tests, docs.
3. Extract purpose from top-of-file comments or exported symbols.
4. Link to existing READMEs, specs, and architecture docs.
5. Write or update the index file.

## Outputs
- Index file with grouped links and one-line descriptions.
- List of undocumented modules needing READMEs.
