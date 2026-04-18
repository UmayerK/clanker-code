---
name: small-focused-prs
description: One concern per PR. Aim for under 400 lines of diff when possible.
triggers: pull request, pr, branch, merge, review, ship
---

## Problem
Large PRs get rubber-stamped or ignored. Small PRs get real review, merge faster, and revert cleanly.

## Rule
- One PR = one concern. Refactor, feature, and fix get separate PRs.
- Target under 400 changed lines; split if larger.
- Include only files relevant to the concern; revert accidental drift.
- Rebase or merge main before requesting review.
- Self-review the diff first (see review-own-diff).
- If a PR must be large (migration), include a reviewer guide in the description.

## Example
```txt
Bad: one PR "auth rework + user list redesign + dep bumps" (1800 lines)

Good: three PRs
1. chore: bump deps (80 lines)
2. refactor(auth): extract session helpers (220 lines)
3. feat(users): new user list page (340 lines)
```
