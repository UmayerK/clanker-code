---
name: owasp-top-10
description: Check OWASP Top 10 risks on any code that handles user input or auth.
triggers: auth, login, form, api, user input, security, endpoint, upload, query
---

## Problem
Most real-world breaches map to the same small list. Running the OWASP checklist on risky code catches them before shipping.

## Rule
- Broken access control: every protected route checks authz, not just authn.
- Crypto failures: TLS everywhere, bcrypt/argon2 for passwords, no MD5/SHA1 for secrets.
- Injection: parameterized queries, no string concat into SQL/shell/HTML.
- Insecure design: threat-model before building auth, payments, uploads.
- Misconfiguration: no debug on prod, minimal CORS, security headers set.
- SSRF, deserialization, logging gaps: validate URLs, avoid pickle/eval, log auth events.

## Example
```ts
// Bad: SQL injection + missing authz
app.get('/user/:id', (req, res) => {
  db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
});

// Good: authz check + parameterized query
app.get('/user/:id', requireAuth, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) return res.sendStatus(403);
  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  res.json(user);
});
```
