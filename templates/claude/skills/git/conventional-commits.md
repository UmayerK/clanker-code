---
name: conventional-commits
description: Use feat/fix/refactor/test/docs/chore prefixes in imperative mood.
triggers: commit, git commit, message, changelog, semver, release
---

## Problem
Inconsistent commit messages make history unreadable and break changelog tooling. Conventional commits give structure for humans and automation.

## Rule
- Prefix: feat, fix, refactor, perf, test, docs, chore, build, ci.
- Imperative mood: "add X", not "added X" or "adds X".
- Subject <= 72 chars; no trailing period.
- Optional scope in parens: `feat(auth): add password reset`.
- Breaking change: `!` after type or `BREAKING CHANGE:` footer.
- Body explains why, not what; wrap at 72 chars.

## Example
```txt
feat(auth): add password reset flow

Users repeatedly ask for self-serve reset. Adds token-based reset
with 30m TTL and rate-limited email endpoint.

Closes #142

---

fix(cart): prevent negative quantities on manual input
refactor(api): extract pagination helper
test(checkout): cover expired card path
```
