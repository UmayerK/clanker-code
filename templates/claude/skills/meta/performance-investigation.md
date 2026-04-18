---
name: performance-investigation
description: Profile before optimizing. Measure p50/p95/p99. Find the bottleneck, not a bottleneck.
triggers: performance, slow, latency, profile, bottleneck, optimize, p95
---

## Problem
"It feels slow" leads to guesswork fixes that move nothing. Percentiles and profilers find the actual constraint.

## Rule
- Reproduce the slowness with a measurable workload.
- Report p50/p95/p99, not averages; tails matter for UX.
- Profile end-to-end: client, network, server, DB; find the dominant stage.
- Attack the top bottleneck first; re-measure before the next.
- Distinguish CPU-bound from IO-bound before choosing fixes.
- Protect against regression with a benchmark or budget test in CI.

## Example
```txt
Complaint: /search is slow.

Measure: p50=120ms, p95=900ms, p99=2.4s.
Profile: p95 dominated by DB query (700ms), EXPLAIN shows seq scan.
Fix: add index on (tenant_id, created_at). Re-measure: p95=180ms.
Lock in: assert p95<250ms in perf test.
```
