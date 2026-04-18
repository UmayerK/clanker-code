---
name: document
description: Generate or update docs — audience-first, task-oriented, copy-pasteable examples.
argument-hint: <path-or-scope> [--kind api|readme|guide|jsdoc] [--depth shallow|normal|deep] [--uc]
delegates-to: doc-writer
---

## Purpose
Produce accurate, audience-appropriate documentation. Docs written for the author, not the reader, get skipped.

## Inputs
- `<path-or-scope>`: file, module, endpoint, or feature to document.
- `--kind`: doc type; inferred from scope if omitted.

## Behavior
1. **Start every doc with: who it is for, what they will achieve.**
2. Read the target code and existing docs to detect gaps and drift.
3. Delegate to `doc-writer` with the scope and doc kind.
4. For READMEs, use this order: tagline, quickstart, install, usage, config, contributing, license.
5. For API references: one section per endpoint/method with request, response, errors, example.
6. Use **task-oriented headings** ("Deploy to Vercel"), not noun headings ("Deployment").
7. Every snippet must be copy-pasteable and verified against the source.
8. Keep docs next to code — stale docs are worse than no docs.

## Outputs
- New or updated documentation files with audience-first framing.
- Working code examples aligned with current APIs.
- List of undocumented items still needing coverage.

## MCP routing
- **context7**: pulls authoritative library docs so examples match current API surfaces.
- **serena**: extracts symbol signatures, types, and references to document accurately.
