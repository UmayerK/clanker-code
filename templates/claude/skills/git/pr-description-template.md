---
name: pr-description-template
description: PR description with summary, test plan, screenshots if UI, and linked issue.
triggers: pr description, pull request body, pr template, open pr
---

## Problem
Empty PR descriptions force reviewers to reverse-engineer intent. A short template communicates purpose and how to verify.

## Rule
- Summary: 1-3 bullets on what changed and why.
- Test plan: checklist the reviewer can run to verify.
- Screenshots or GIFs for any visible UI change.
- Linked issue: `Closes #123` or `Refs #123`.
- Note risk areas: migrations, feature flags, perf-sensitive code.
- Call out anything intentionally out of scope.

## Example
```md
## Summary
- Add `/api/users` pagination (page, pageSize)
- Default pageSize 20, max 100

## Test plan
- [ ] GET /api/users returns page 1 by default
- [ ] pageSize=100 works; pageSize=101 rejected with 400
- [ ] UI user list paginates without flicker

## Screenshots
![before](...) ![after](...)

Closes #412
Out of scope: cursor pagination (tracked in #415)
```
