---
name: reflect
description: Validate completed work with semantic awareness, confidence scoring, and optional parallel reviewers.
argument-hint: [--depth shallow|normal|deep] [--validate] [--parallel] [--threshold 80] [--uc]
delegates-to: reviewer
---

## Purpose
Close the loop: did we actually do what was asked, did we break anything, does the result meet the acceptance criteria? Scores each finding 0–100 and filters low-confidence noise. Uses Serena for symbol-level verification.

## Inputs
- `--depth shallow`: confirm diff matches stated task scope.
- `--depth normal` (default): above + verify public surfaces + tests pass.
- `--depth deep`: above + trace data-flow impact on callers + re-check invariants.
- `--validate`: refuse "done" until reflection passes; return fix list otherwise.
- `--parallel`: run 3 reviewers with distinct lenses (simplicity/DRY, bugs/correctness, conventions/standards) in parallel.
- `--threshold N`: only surface findings with confidence ≥ N. Default **80**. Lower for noisier output, higher for only-the-certain.

## Behavior
1. Restate the original task and acceptance criteria.
2. Use Serena (if present) for symbol-level inspection; fall back to Read + Grep.
3. Map diff → acceptance criteria. Mark each satisfied / unsatisfied / unclear.
4. Run tests; summarize pass/fail.
5. **Score each finding 0–100** on confidence. Filter `< threshold`.
6. Surface scope creep separately from bugs.
7. If `--parallel`, run three reviewer passes with different lenses; merge findings by confidence score.
8. **Write incremental notes** to `.claude/scratch/reflect-<date>.md` every 5 items so compaction mid-run doesn't lose progress. On resume, read the scratch file tail.
9. If `--validate` fails, emit a concrete fix list and stop.

## Outputs
- Criterion-by-criterion verdict table (with confidence per item).
- Test summary.
- Scope-creep list.
- Findings ≥ threshold only.
- Go / no-go verdict.

## MCP routing
- **serena** (preferred): symbol-level verification without file re-reads.
- **sequential-thinking**: structure the criterion walk + parallel-reviewer merge.
- **playwright**: for any UI criterion, verify in a real browser.
