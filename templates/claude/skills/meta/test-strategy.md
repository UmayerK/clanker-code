---
name: test-strategy
description: Test pyramid. Integration at seams. E2E for critical user flows only.
triggers: test strategy, coverage, unit vs integration, e2e, pyramid, test plan
---

## Problem
Too many E2E tests are slow and flaky; too few integration tests miss seam bugs. A balanced pyramid keeps feedback fast and coverage meaningful.

## Rule
- Base: many fast unit tests for pure functions and small modules.
- Middle: integration tests at system seams (DB, HTTP, queue).
- Top: a few E2E tests covering critical user flows (signup, checkout).
- Target coverage by risk, not a blanket percent; critical code at >90%.
- No test for trivial getters; do test branching and error paths.
- Reject flaky tests; quarantine or fix, never retry-loop them.

## Example
```txt
Service: payments

Unit (80 tests): fee calc, currency rounding, refund math.
Integration (12 tests): /charge endpoint with real DB + fake Stripe.
E2E (2 tests): user completes checkout; user retries failed card.

Run: unit on every save, integration on PR, E2E on pre-deploy.
```
