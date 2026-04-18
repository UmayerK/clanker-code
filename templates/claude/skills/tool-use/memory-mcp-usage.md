---
name: memory-mcp-usage
description: Store durable facts in memory MCP; keep ephemeral state out.
triggers: memory, remember, note, save, preference, project fact, context
---

## Problem
Memory pollution (random transient state) drowns out the facts that actually matter across sessions. Curate what gets persisted.

## Rule
- Store: user preferences, project conventions, stable decisions, recurring paths.
- Do not store: chat-turn state, code diffs, long outputs, secrets.
- Write entries as short, searchable facts, not dialogue.
- Tag with project or scope so retrieval is focused.
- Update or delete stale entries; do not accumulate contradictions.
- If unsure whether a fact is durable, do not store it.

## Example
```txt
Store:
- "Project 'acme' uses pnpm, Next.js App Router, Postgres via Prisma."
- "User prefers concise commit messages, no emoji."

Do not store:
- "User pasted a 300-line log at 14:02 today."
- "Current PR branch is feat/login-12."
```
