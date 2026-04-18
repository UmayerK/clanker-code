---
name: recommend
description: Given a fuzzy user ask, recommend the best clanker command and agent to use.
argument-hint: <what the user wants to do>
delegates-to:
---

## Purpose
Help users (or Claude itself) pick the right slash command when the intent is vague. Converts "I need to figure out why this is slow" into a concrete suggestion like `/debug` or `/analyze --depth deep`.

## Inputs
- `<what the user wants to do>`: natural-language description of the goal.

## Behavior
1. Classify the ask by shape: discover / plan / implement / debug / review / test / refactor / document / research / explain / orchestrate.
2. Match to the best command(s):
   - Discover requirements → `/brainstorm`
   - Plan a known feature → `/plan` (or `/feat` for spec-first)
   - Build something → `/implement` or `/feat`
   - Hunt a bug → `/debug`
   - Check quality → `/analyze` or `/review`
   - Add tests → `/test`
   - Improve existing code → `/improve`
   - Clean up cruft → `/cleanup`
   - Write docs → `/document` or `/index`
   - Research an unfamiliar topic → `/research` or `/explain`
   - Coordinate multi-step work → `/pm`
3. Name one primary recommendation with a one-sentence rationale.
4. Offer up to two alternatives when the primary is borderline.

## Outputs
- Primary: `Use /<command> <args>` with a one-sentence reason.
- Optional: two alternatives with when-to-pick-each guidance.

## MCP routing
- **sequential-thinking**: structure the classification for ambiguous asks.
