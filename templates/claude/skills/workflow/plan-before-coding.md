---
name: plan-before-coding
description: Break ambiguous tasks into explicit steps before writing any code.
triggers: new feature, implement, build, refactor, multi-step, ambiguous request, plan
---

## Problem
Jumping into code on unclear tasks produces rework, half-finished branches, and wasted context. A written plan exposes gaps before they become bugs.

## Rule
- List the concrete sub-tasks before touching code.
- Name the files you expect to change and the interfaces involved.
- Identify unknowns and resolve them (docs, questions) before coding.
- Keep the plan short: 3-7 bullets, not prose.
- Share the plan with the user for any task >15 minutes of work.
- Update the plan when reality diverges; do not silently improvise.

## Example
```md
Task: Add password reset flow

Plan:
1. Add POST /auth/reset-request (email -> token, rate-limited)
2. Add POST /auth/reset-confirm (token + new password)
3. Email template + SMTP helper in lib/mail.ts
4. UI: /reset page + /reset/[token] page
5. Tests: token expiry, reuse, invalid token
Unknowns: token TTL (confirm with user), mail provider creds
```
