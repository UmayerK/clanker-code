---
name: review-own-diff
description: Read your own diff critically as if reviewing someone else before presenting it.
triggers: commit, pr, pull request, review, before submit, diff, changes ready
---

## Problem
Authors see the code they meant to write, not the code they wrote. A deliberate self-review catches typos, dead code, and half-finished edits.

## Rule
- Run `git diff` (staged + unstaged) and read every hunk.
- Ask: would I approve this from a stranger?
- Delete console.logs, commented-out code, and stray debug artifacts.
- Check for unintentional file changes (formatter, lockfile drift).
- Verify new public APIs have types, docs, and tests.
- Look for "TODO" or "FIXME" you just added; resolve or ticket them.

## Example
```bash
git diff --staged | less
# Spotted:
# - console.log('here') in src/api/login.ts -> remove
# - unused import 'lodash' -> remove
# - missing type on return of getUser() -> add
```
