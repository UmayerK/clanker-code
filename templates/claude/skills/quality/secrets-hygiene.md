---
name: secrets-hygiene
description: Never hardcode secrets. Use env vars. Flag any secret you see in code.
triggers: api key, secret, token, password, env, config, credential, .env
---

## Problem
Hardcoded secrets leak through git history, logs, and screenshots. Once committed, assume compromised.

## Rule
- Load secrets from environment variables or a secret manager only.
- Never commit `.env`; commit `.env.example` with placeholder names.
- If you see a hardcoded secret, stop and flag it; do not just move it.
- Rotate any secret that has touched a public repo or chat log.
- Do not log secrets, request bodies with secrets, or full auth headers.
- Scope secrets per environment (dev/staging/prod), never share prod keys.

## Example
```ts
// Bad
const stripe = new Stripe('sk_live_abcd1234...');

// Good
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// .env.example
STRIPE_SECRET_KEY=sk_test_replace_me
```
