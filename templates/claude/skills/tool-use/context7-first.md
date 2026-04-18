---
name: context7-first
description: Call Context7 MCP before using an unfamiliar or recently-changed library API.
triggers: library, framework, sdk, api, import, install, docs, version, migration
---

## Problem
Training data goes stale. Library APIs change, deprecations happen, and guessing from memory produces broken code.

## Rule
- Call Context7 before using any library you have not touched recently in this project.
- Always check Context7 on version migrations (e.g., Next 14 to 15).
- Use it for CLI flags, config files, and SDK method signatures.
- Workflow: resolve-library-id, then query-docs with a specific question.
- Do not use Context7 for general programming concepts or business logic.
- Cite the version you consulted in code comments when non-obvious.

## Example
```txt
Task: add Prisma transaction

1. resolve-library-id("prisma") -> /prisma/prisma
2. query-docs(id, "interactive transactions in Prisma 5")
3. Implement using documented prisma.$transaction(async (tx) => ...) pattern
```
