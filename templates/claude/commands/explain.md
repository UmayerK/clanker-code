---
name: explain
description: Explain code, patterns, or concepts at an appropriate skill level.
argument-hint: <code-path-or-concept> [--level beginner|intermediate|advanced] [--depth shallow|normal|deep] [--uc]
delegates-to: mentor
---

## Purpose
Deliver a clear, level-appropriate explanation with examples the user can run.

## Inputs
- `<code-path-or-concept>`: file, symbol, or concept name.
- `--level`: target audience skill; defaults to intermediate.

## Behavior
1. Delegate to `mentor` with the target and level.
2. Mentor reads the code or references authoritative docs for concepts.
3. Build explanation: one-line summary, mental model, walkthrough, example, common pitfalls.
4. Include a runnable snippet where applicable.
5. Offer follow-up questions to deepen understanding.

## Outputs
- Structured explanation with summary, walkthrough, example.
- Runnable snippet when applicable.
- Suggested follow-up topics.

## MCP routing
- **context7**: fetches authoritative docs for libraries, frameworks, and APIs being explained.
- **sequential-thinking**: orders concept layers from mental model to worked example.
