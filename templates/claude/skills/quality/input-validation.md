---
name: input-validation
description: Validate at every system boundary; trust data once internal.
triggers: form, api, request body, query params, user input, webhook, upload, deserialize
---

## Problem
Unvalidated input at a boundary becomes a crash, an injection, or corrupt data deeper in the system. Validate where data enters, not where it is used.

## Rule
- Validate at every trust boundary: HTTP handlers, queue consumers, file parsers.
- Use a schema library (Zod, Pydantic, Joi) instead of hand rolling checks.
- Reject unknown fields; do not silently strip them in auth-critical paths.
- Validate types, ranges, lengths, formats, and cross-field invariants.
- Client validation is UX; server validation is security. Do both.
- Fail with a structured error shape, not a 500.

## Example
```ts
import { z } from 'zod';

const CreateUser = z.object({
  email: z.string().email(),
  age: z.number().int().min(13).max(120),
}).strict();

app.post('/users', (req, res) => {
  const parsed = CreateUser.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
  createUser(parsed.data);
});
```
