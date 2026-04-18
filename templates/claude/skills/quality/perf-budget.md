---
name: perf-budget
description: Measure before optimizing. Set a budget. Profile, do not guess.
triggers: slow, performance, optimize, fast, bundle size, latency, memory, profile
---

## Problem
Optimizing without data makes code uglier and rarely faster. A budget and a profiler point to the 5% that matters.

## Rule
- Define the target first: p95 latency, bundle KB, memory cap.
- Measure current value before changing anything.
- Profile to find the top hotspot; optimize that, not guesses.
- Re-measure after; reject changes that do not move the metric.
- Prefer algorithmic fixes over micro-optimizations.
- Budget regressions block merge; track in CI.

## Example
```txt
Budget: /search p95 < 200ms, JS bundle < 180KB gzipped

Before: p95 = 640ms. Profile: 500ms in N+1 DB query.
Fix: batch query with IN (...). After: p95 = 140ms. Merged.

Before: p95 = 180ms. No optimization needed; do not touch.
```
