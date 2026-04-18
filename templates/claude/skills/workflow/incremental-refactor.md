---
name: incremental-refactor
description: Make small reversible changes, keep tests green at every step.
triggers: refactor, restructure, clean up, reorganize, rename, extract
---

## Problem
Big-bang refactors break everything at once and hide regressions. Small steps are reversible, reviewable, and never leave main broken.

## Rule
- Write or confirm tests for current behavior first.
- Change one thing per commit: rename, or extract, or move, not all.
- Run tests after each step; green before the next change.
- Keep public APIs stable until the internal refactor is done.
- If a step grows large, stop and split it further.
- Never mix behavior changes with refactors in one commit.

## Example
```txt
Refactor: split UserService into AuthService + ProfileService

Commit 1: extract AuthService.login (tests green)
Commit 2: extract AuthService.logout (tests green)
Commit 3: extract ProfileService.update (tests green)
Commit 4: remove old UserService facade (tests green)
```
