---
name: ask-before-assuming
description: When requirements are ambiguous, ask one targeted question instead of guessing.
triggers: ambiguous, unclear, assume, guess, not sure, could mean, requirements
---

## Problem
Guessing on ambiguous requirements wastes time and produces the wrong feature. One clarifying question up front costs seconds and saves hours.

## Rule
- If two reasonable interpretations exist, ask which one.
- Prefer a multiple-choice question over an open one.
- Ask before writing code, not after.
- Batch unknowns into one message; do not drip-feed questions.
- State your assumption explicitly if the user is unavailable.
- Record resolved ambiguity in the spec or task so it is not re-asked.

## Example
```txt
User: "Add a delete button to the user list."

Good: "Should delete be soft (flag as deleted) or hard (remove row)?
  A) soft, B) hard, C) soft + admin hard delete"

Bad: implement hard delete without asking, ship it, user wanted soft.
```
