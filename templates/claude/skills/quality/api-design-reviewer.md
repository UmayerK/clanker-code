---
name: api-design-reviewer
description: REST API linting with breaking-change detection, status-code sanity, and versioning checks.
triggers: api review, endpoint design, rest api, openapi, swagger, breaking change, api version, rest contract
---

## Problem
API contracts break silently — a renamed field or a switched status code ships fine in the author's head and destroys every client. REST conventions catch most of this, but only if someone's actually looking.

## Rule
- **Resources are nouns, actions are verbs.** `GET /users/123` good; `GET /getUser?id=123` bad.
- **Status codes carry meaning**: 200 (found), 201 (created + `Location`), 204 (deleted), 400 (bad input), 401 (auth missing), 403 (auth insufficient), 404 (not found), 409 (conflict), 422 (unprocessable), 429 (rate limited), 5xx (server fault).
- **Idempotency**: PUT and DELETE must be idempotent. POST can accept `Idempotency-Key` for retry safety.
- **Versioning**: pick URL (`/v1/...`) or header (`Accept-Version`) and stay consistent. Never mix.
- **Pagination**: cursor-based for new endpoints. Response shape: `{ items, nextCursor }`.
- **Error shape**: `{ error: { code, message, details? } }`. Same shape on every error path.
- **Breaking changes** require a version bump: removing a field, renaming a field, narrowing an enum, tightening validation, changing response status on existing inputs.

## Diff-review checklist
- Added a field? ✅ safe.
- Removed a field? 🚨 breaking.
- Renamed a field? 🚨 breaking (prefer adding new + deprecating old).
- Changed status code on the same input? 🚨 breaking.
- Changed response shape? 🚨 breaking unless additive.
- New required request field? 🚨 breaking for existing callers.
- New optional request field? ✅ safe.

## Example
```md
Review of src/api/orders.ts diff:

🚨 Breaking: /api/orders POST previously returned 200, now returns 201.
   → Existing clients checking `=== 200` will break. Fix: keep 200 or bump to v2.

🚨 Breaking: Removed `order.customerId` field from response.
   → Suggest: deprecate instead — keep the field, add `order.customer.id`, remove in v2.

⚠️ Naming: /api/cancel-order action-verb in URL. Prefer POST /api/orders/:id/cancel.

✅ Safe: Added optional `notes` field to POST body.
```
