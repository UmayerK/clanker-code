---
name: explain
description: Explain code, patterns, or concepts at an appropriate skill level — examples before rules.
argument-hint: <code-path-or-concept> [--level beginner|intermediate|advanced] [--depth shallow|normal|deep] [--uc]
delegates-to: mentor
---

## Purpose
Deliver a clear, level-appropriate explanation with runnable examples. Build from what the reader already knows to what they're trying to learn.

## Inputs
- `<code-path-or-concept>`: file, symbol, or concept name.
- `--level`: target audience skill; defaults to intermediate.

## Behavior
1. Delegate to `mentor` with the target and level.
2. **Define each jargon term on first use**; link the definition if reused.
3. **Start with a concrete example, then generalize to the rule** — examples before abstractions.
4. Build on what the reader already knows; relate new concepts to familiar ones.
5. Show the wrong-but-natural answer and why it fails before the right one, when it aids understanding.
6. Use small runnable snippets, not essay-length prose.
7. End with a short "try this" exercise for retention when `--depth normal` or above.

## Outputs
- One-line summary, mental model, walkthrough, example, common pitfalls.
- Runnable snippet where applicable.
- Suggested follow-up topics.

## MCP routing
- **context7**: fetches authoritative docs for libraries, frameworks, and APIs being explained.
- **sequential-thinking**: orders concept layers from mental model to worked example.
