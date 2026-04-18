---
name: brainstorm
description: Interactive requirements discovery through Socratic questioning, one question at a time.
argument-hint: <topic-or-idea> [--depth shallow|normal|deep] [--uc]
delegates-to: planner
---

## Purpose
Elicit a complete, unambiguous feature brief by asking focused questions one at a time until scope, users, and acceptance criteria are clear.

## Inputs
- `<topic-or-idea>`: rough feature name, problem statement, or user pain point.

## Behavior
1. Restate the idea in one sentence and confirm.
2. Ask exactly one question per turn — the highest-leverage unknown. Offer multiple-choice (A/B/C) when options are discrete.
3. Push back when the user's idea has a clear flaw; propose an alternative rather than silently proceeding.
4. Track answers in a running brief: problem, users, in-scope, out-of-scope, acceptance criteria, edge cases.
5. Summarize what you understood before moving to the next question.
6. Stop when acceptance criteria are testable and edge cases enumerated — don't over-ask.
7. Delegate to `planner` to convert the brief into an ordered implementation plan.

## Anti-patterns
- Firing multiple questions at once overwhelms users.
- Agreeing with everything wastes the session.
- Rhetorical or obvious questions waste turns.

## Outputs
- Structured feature brief ready for `specs/10-feature-*.md`.
- Implementation plan from `planner` with ordered, estimable steps.

## MCP routing
- **sequential-thinking**: structures question sequence and tracks the evolving brief.
- **memory**: persists the running brief across turns.
