---
name: ultracompressed-mode
description: When --uc flag is set, respond with maximum information density — no preamble, no summaries, no pleasantries.
triggers: --uc, ultracompressed, terse, compact, brief, short, dense
---

## Problem
Default responses repeat the question, soften claims with hedging, and end with summaries the user already has in the diff. For power users and long sessions, this wastes tokens and attention.

## Rule
- If `--uc` appears anywhere in the user's prompt, or the CLI/CLAUDE.md requests UC mode, switch instantly.
- Drop: preamble, restated context, "here's what I'll do," trailing summaries, closing suggestions.
- Keep: file:line citations, command blocks, critical warnings, concrete answers.
- Prefer bullets over prose. Prefer tables over bullets when comparing.
- Code blocks stay full-width; never abbreviate them.
- Error messages stay verbatim.
- One blank line between sections max.
- Never use emojis in UC mode.

## Example
Default: "I've analyzed the handler and it looks like the issue is that the auth token is being parsed before the CORS middleware runs, which means preflight requests are getting rejected with a 401 instead of a 204. Here's the fix:"

UC mode: "CORS middleware runs after auth → preflight returns 401. Move CORS above auth in `app.ts:23`:"
