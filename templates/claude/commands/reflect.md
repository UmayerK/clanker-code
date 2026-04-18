---
name: reflect
description: Validate completed work against stated requirements with semantic code awareness.
argument-hint: [--depth shallow|normal|deep] [--validate]
delegates-to: reviewer
---

## Purpose
Close the loop on a task: did we actually do what was asked, did we break anything, and does the result meet the acceptance criteria? Uses Serena for symbol-level verification when available — cheaper and more precise than re-reading files.

## Inputs
- `--depth shallow`: confirm the diff matches the stated task scope.
- `--depth normal` (default): above + verify affected public surfaces behave as expected + tests pass.
- `--depth deep`: above + trace data-flow impact on callers + re-check invariants.
- `--validate`: refuse to mark "done" until reflection passes; return a fix list otherwise.

## Behavior
1. Restate the original task and acceptance criteria.
2. Use Serena (if present) to inspect the affected symbols and their callers; fall back to Read + Grep otherwise.
3. Map diff → acceptance criteria, one by one. Mark each satisfied / unsatisfied / unclear.
4. Run tests; summarize pass/fail.
5. Surface anything that was changed but wasn't requested — flag potential scope creep or accidental side-effects.
6. If `--validate` fails, emit a concrete fix list and stop.

## Outputs
- Criterion-by-criterion verdict table.
- Test summary.
- Scope-creep list (if any).
- Go / no-go recommendation with specific next steps if no-go.

## MCP routing
- **serena** (preferred): symbol-level verification without file re-reads.
- **sequential-thinking**: structure the criterion-matching walk.
- **playwright**: for any UI criterion, verify in a real browser.
