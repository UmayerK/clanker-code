---
name: systematic-investigation
description: Reproduce → isolate → hypothesize → verify. One skeleton for debugging, performance, and security investigations.
triggers: bug, broken, not working, slow, latency, hotspot, performance, vulnerability, exploit, security, debug, investigate, root cause
---

## Problem
Random guessing burns hours. Every investigation — bug, perf regression, security concern — benefits from the same disciplined loop: reproduce, isolate, hypothesize, verify. Shortcut any step and the fix lands on a symptom.

## Rule
1. **Reproduce first.** Failing to reproduce = you don't understand the problem yet. Don't skip to code.
2. **Isolate the smallest failing input.** Shrink the repro until removing anything makes the bug disappear.
3. **Form one hypothesis at a time.** Write it down. Predict what you expect before running the check.
4. **Verify with evidence, not intuition.** Logs, metrics, traces, a failing test — one concrete artifact per hypothesis.
5. **Fix the root cause, not the symptom.** If the fix doesn't explain the evidence, it's likely wrong.
6. **Add a regression guard.** Every real bug ends in a test that would have caught it.

## Lenses

**Debug (correctness):**
- Reproduce path → stack trace → bisect the commit or input → find the precise line → fix + regression test.
- Heisenbug? Suspect timing, state, or environment — add logs first, don't mutate code.

**Performance:**
- Reproduce the slow case with a measured baseline (p50/p95/p99). No speculation without numbers.
- Isolate with a profiler or flamegraph — find the actual hotspot, not the "probably slow" code.
- Hypothesize: N+1 query? Allocation in hot loop? Sync I/O? Missing index?
- Verify: re-measure after the fix. If p95 didn't move, the hypothesis was wrong.

**Security:**
- Reproduce with a proof-of-concept attack path, not a theoretical one.
- Isolate: trust boundary crossed? Input unsanitized? Authz bypassed?
- Hypothesize against OWASP top 10 categories first; custom flaws second.
- Verify: the fix must close the specific PoC, and a regression test encodes it.

## Example
```md
Symptom: /api/orders returns 500 in prod, works in staging.

1. Reproduce: hit prod endpoint with same payload that works in staging → 500 only in prod.
2. Isolate: curl with minimal headers → still 500. Remove auth header → 401 (different). So auth header is parsed, something after fails.
3. Hypothesis: different DB row count causes a timeout. Staging has ~1k orders, prod has ~5M.
4. Verify: DB slow log shows `SELECT * FROM orders ORDER BY created_at` taking 8s in prod, 30ms in staging.
5. Root cause: missing index on orders(created_at).
6. Fix: add index migration. Regression test: seed 1M rows in integration env, assert endpoint < 500ms.
```
