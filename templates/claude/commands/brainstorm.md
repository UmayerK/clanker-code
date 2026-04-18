---
name: brainstorm
description: Interactive requirements discovery through Socratic questioning, one question at a time.
argument-hint: <topic-or-idea> [--depth shallow|normal|deep] [--uc]
delegates-to: planner
---

## Purpose
Elicit a complete, unambiguous feature brief by asking focused questions one at a time until scope, users, and acceptance criteria are clear.

## Inputs
- `<topic-or-idea>`: rough feature name, problem statement, or user pain point to explore.

## Behavior
1. Restate the idea in one sentence and confirm with the user.
2. Ask exactly one question per turn, prioritized: users, problem, scope boundaries, success criteria, constraints.
3. Track answers in a running brief (problem, users, in-scope, out-of-scope, acceptance criteria, edge cases).
4. Stop when acceptance criteria are testable and edge cases enumerated.
5. Delegate to `planner` to convert the brief into an ordered implementation plan.

## Outputs
- Structured feature brief ready to paste into `specs/10-feature-*.md`.
- Implementation plan from `planner` with ordered, estimable steps.

## MCP routing
- **sequential-thinking**: structures the question sequence and tracks the evolving brief across turns.
- **memory**: persists the running brief so context survives compaction or resumes.
