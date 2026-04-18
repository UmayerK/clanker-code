---
name: analyze-systematically
description: When asked to analyze, cover quality, security, performance, and architecture.
triggers: analyze, review, audit, assess, evaluate, code review, deep dive
---

## Problem
Ad-hoc analysis finds one issue and stops. A fixed lens catches what each focus alone misses.

## Rule
- Quality: readability, tests, duplication, dead code, naming.
- Security: input validation, authz, secrets, dependency CVEs.
- Performance: hotspots, N+1, bundle size, memory, async misuse.
- Architecture: module boundaries, coupling, dependency direction, scalability.
- Prioritize by impact x effort; label findings Critical/High/Medium/Low.
- Produce concrete next actions, not observations alone.

## Example
```md
Analysis of src/auth/

Security [HIGH]: JWT secret read from const literal in jwt.ts:8. Move to env.
Perf [MED]: getUser called N times in /orders list (auth.ts:42). Batch.
Quality [LOW]: login.ts mixes validation + response shaping. Split.
Arch [MED]: auth depends on billing for feature flags. Invert via interface.

Next: fix HIGH this sprint; MEDs tracked in #234.
```
