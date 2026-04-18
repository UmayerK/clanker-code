---
name: node-error-handling
description: One error middleware, async wrappers, split operational vs programmer errors.
triggers: node, express, error, catch, try, async, middleware, exception
---

## Problem
Scattered try/catch and swallowed rejections produce silent failures and leaked stack traces. Centralize and categorize errors.

## Rule
- One error-handling middleware at the end of the stack.
- Wrap async handlers so rejections reach the middleware (`asyncHandler` or router support).
- Distinguish operational errors (bad input, 404) from programmer errors (bugs); crash on the latter in dev.
- Never send stack traces to clients; log them server-side with request id.
- Throw typed errors (`AppError` with statusCode, code); map to response in middleware.
- Log once, at the boundary; avoid log-and-rethrow chains.

## Example
```ts
class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) { super(message); }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users/:id', asyncHandler(async (req, res) => {
  const u = await db.user.find(req.params.id);
  if (!u) throw new AppError(404, 'not_found', 'User not found');
  res.json(u);
}));

app.use((err, req, res, _next) => {
  const status = err.statusCode ?? 500;
  logger.error({ err, reqId: req.id });
  res.status(status).json({ error: { code: err.code ?? 'internal', message: err.message } });
});
```
