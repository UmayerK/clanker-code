---
name: estimate-conservatively
description: Break tasks down first, use T-shirt sizes, include review, testing, and deploy.
triggers: estimate, timeline, how long, effort, sizing, planning, sprint
---

## Problem
Estimates from a gut number are usually half the real cost because they skip review, testing, deploy, and unknowns.

## Rule
- Break the task into concrete sub-tasks before estimating.
- Use T-shirt sizes (XS/S/M/L/XL) before committing to days.
- Include review, tests, docs, deploy, and post-deploy verification.
- Add a buffer for unknowns (rule of thumb: 30 percent).
- Flag the assumptions the estimate depends on.
- Re-estimate after the first sub-task ships; recalibrate.

## Example
```md
Task: add password reset flow

Breakdown:
- backend endpoints + token store: M (1.5d)
- email template + SMTP wiring: S (0.5d)
- UI pages + forms: M (1d)
- tests (unit + e2e): S (0.5d)
- review + revisions: S (0.5d)
- deploy + verify in staging: S (0.25d)

Estimate: 4.25d base + 30% buffer = ~5.5d
Assumes: SMTP creds available, design approved.
```
