---
name: typescript-strict-mode
description: Enable strict:true. Avoid any. Prefer unknown. Use branded types for IDs.
triggers: typescript, ts, tsconfig, strict, any, unknown, type safety, branded type
---

## Problem
Without strict mode, TypeScript silently accepts `any` and null, removing most of its value. Strict + disciplined typing catches whole classes of bugs at compile time.

## Rule
- Set `"strict": true` in tsconfig; do not disable sub-flags.
- Ban `any` via ESLint (`@typescript-eslint/no-explicit-any`); use `unknown` at boundaries.
- Narrow `unknown` with type guards or schema parsing before use.
- Use branded/opaque types for IDs to prevent mixing `UserId` with `OrderId`.
- Prefer `type` for unions and aliases, `interface` for object shapes you extend.
- Never ship `@ts-ignore`; use `@ts-expect-error` with a reason, rare.

## Example
```ts
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function getUser(id: UserId) { /* ... */ }
const oid = 'o_123' as OrderId;
getUser(oid); // compile error

async function handle(input: unknown) {
  const body = CreateUserSchema.parse(input); // now typed
  return createUser(body);
}
```
