---
name: brainstorm-socratic
description: One high-value question at a time, use multiple choice when useful, push back when needed.
triggers: brainstorm, discuss, ideate, explore, feature idea, what if, should i
---

## Problem
Firing ten questions at once overwhelms the user; agreeing with everything wastes the session. Socratic dialogue converges fast.

## Rule
- Ask one question per turn; make it the highest-leverage unknown.
- Offer multiple choice (A/B/C) when options are discrete.
- Push back when the user's idea has a clear flaw; propose an alternative.
- Summarize what you understood before advancing.
- Stop asking when you have enough to act; propose a plan.
- Respect the user's time: no rhetorical or obvious questions.

## Example
```txt
User: "I want to add notifications."

Good: "Which channel first? A) in-app, B) email, C) push."
User: "A."
"In-app only: real-time (websockets) or on-poll refresh?
  A) websockets (more work, live), B) poll (simpler, 30s delay)."
User: "B."
"Got it. Plan: poll every 30s, unread count in header, list in /notifications."

Bad: "What kind? Which users? What triggers? Mark-as-read? Grouping? Retention?"
```
