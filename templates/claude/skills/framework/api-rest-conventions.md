---
name: api-rest-conventions
description: Nouns for resources, proper status codes, structured error responses.
triggers: rest, api, endpoint, http, route, crud, status code, error response
---

## Problem
Inconsistent REST APIs force every client to relearn conventions and guess error shapes. Consistency is most of the value of REST.

## Rule
- Resources are plural nouns: `/users`, `/orders/42/items`.
- Verbs via HTTP methods: GET, POST, PATCH, PUT, DELETE.
- Status codes: 200/201/204 success, 400/401/403/404/409/422 client, 500/503 server.
- PATCH for partial update, PUT for full replacement; pick one and be consistent.
- Error shape: `{ error: { code, message, details? } }`.
- Pagination, filtering, sorting via query params; document the schema.

## Example
```http
POST /users            201 { id, email }
GET  /users?page=2     200 { data, page, total }
GET  /users/404        404 { "error": { "code": "not_found", "message": "User 404" } }
PATCH /users/1         200 { id, email }
DELETE /users/1        204
```
