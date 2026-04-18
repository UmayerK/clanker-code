---
name: document
description: Generate or update documentation for code, APIs, or features.
argument-hint: <path-or-scope> [--kind api|readme|guide|jsdoc]
delegates-to: doc-writer
---

## Purpose
Produce accurate, audience-appropriate documentation for the given scope.

## Inputs
- `<path-or-scope>`: file, module, endpoint, or feature to document.
- `--kind`: documentation type; inferred from scope if omitted.

## Behavior
1. Read the target code and existing docs to detect gaps and drift.
2. Delegate to `doc-writer` with the scope and doc kind.
3. Doc-writer drafts sections: purpose, usage, parameters, examples, edge cases.
4. Include runnable examples verified against the source.
5. Update or create the appropriate file (`README.md`, `docs/*`, inline comments).

## Outputs
- New or updated documentation files.
- Working code examples aligned with current APIs.
- List of undocumented items still needing coverage.
