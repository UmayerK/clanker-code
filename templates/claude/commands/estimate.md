---
name: estimate
description: Development estimate for a task or feature with assumptions and risks.
argument-hint: <task-or-feature-description>
delegates-to: planner
---

## Purpose
Produce a ranged effort estimate with explicit assumptions, risks, and breakdown.

## Inputs
- `<task-or-feature-description>`: the scope to estimate.

## Behavior
1. Delegate to `planner` to decompose the work into atomic tasks.
2. For each task, estimate optimistic, likely, and pessimistic effort.
3. List assumptions that would invalidate the estimate if wrong.
4. Flag risks and unknowns that require spikes.
5. Aggregate into a total range with confidence level.

## Outputs
- Task breakdown with per-task ranges.
- Total effort range and confidence.
- Assumptions, risks, and recommended spikes.
