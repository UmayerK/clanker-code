---
name: research-depth
description: Depth scales with risk. Cite sources. Include counter-evidence.
triggers: research, investigate, evaluate, compare, decide, choose, options
---

## Problem
Shallow research produces confident-but-wrong recommendations; exhaustive research wastes time on trivia. Match depth to decision risk.

## Rule
- Calibrate depth to reversibility: one-way doors demand deeper research.
- Prefer primary sources (official docs, RFCs, source code) over blogs.
- Cite sources inline with links; no unattributed claims.
- Include at least one counter-view or failure case per option.
- Summarize before expanding; give the answer first, evidence next.
- State confidence level and what would change your mind.

## Example
```md
Q: Drizzle vs Prisma for new service?

Answer (med confidence): Prisma for faster onboarding; Drizzle if raw SQL control matters.

Evidence:
- Prisma docs on migrations (prisma.io/docs, 2026-03)
- Drizzle perf benchmark (drizzle.team/benchmarks)
- Counter: Prisma query engine overhead; complaint thread (github.com/prisma/prisma/issues/X)

Would change mind if: team needs Postgres-specific SQL features heavily.
```
