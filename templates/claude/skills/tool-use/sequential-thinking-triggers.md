---
name: sequential-thinking-triggers
description: Use sequential-thinking MCP for architecture, tough debugging, and multi-step reasoning.
triggers: architecture, tradeoff, design decision, debug complex, migration, plan, multi-step
---

## Problem
Complex problems tempt shortcut reasoning and missed branches. Sequential-thinking forces explicit steps and revision, reducing blind spots.

## Rule
- Trigger when you catch yourself about to guess between non-trivial options.
- Use for architecture decisions with real tradeoffs.
- Use when debugging bugs with several plausible causes.
- Use for migrations, refactors, or multi-file changes with ordering.
- Do not use for trivial tasks; overhead beats speed.
- Capture the conclusion in an ADR or spec when it is a decision.

## Example
```txt
Task: choose between server actions vs route handlers for checkout

sequentialthinking:
- step 1: list requirements (auth, idempotency, webhooks)
- step 2: map each to server action vs handler
- step 3: evaluate observability and testing
- step 4: decide route handler + idempotency key; record in ADR
```
