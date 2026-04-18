---
name: estimate
description: Development estimate for a task or feature with assumptions and risks.
argument-hint: <task-or-feature-description> [--strategy systematic|agile|enterprise] [--uc]
delegates-to: planner
---

## Purpose
Produce a ranged effort estimate with explicit assumptions, risks, and breakdown. Honest estimates include review, testing, and deploy — not just code.

## Inputs
- `<task-or-feature-description>`: the scope to estimate.

## Behavior
1. Break the work into concrete atomic sub-tasks before estimating anything.
2. Use T-shirt sizes (XS/S/M/L/XL) for each sub-task before committing to days.
3. **Include the full lifecycle**: implementation, review, tests, docs, deploy, post-deploy verification.
4. For each sub-task, estimate optimistic, likely, pessimistic effort.
5. Add a buffer for unknowns — rule of thumb: 30%.
6. Flag assumptions that would invalidate the estimate if wrong.
7. Call out risks and unknowns needing spikes.
8. Re-estimate after the first sub-task ships — recalibrate, don't stay anchored.

## Outputs
- Task breakdown with per-task ranges and T-shirt size.
- Total effort range with confidence.
- Assumptions and risks list.
- Recommended spikes for unknowns.

## MCP routing
- **sequential-thinking**: decomposes scope into atomic tasks and reasons about risk-weighted ranges.
