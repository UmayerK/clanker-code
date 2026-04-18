---
name: reflect
description: Validate completed work against original task requirements and acceptance criteria.
argument-hint: <task-or-spec-path>
delegates-to: reviewer
---

## Purpose
Verify that completed work actually satisfies the stated requirements before declaring done.

## Inputs
- `<task-or-spec-path>`: the spec file or task description to validate against.

## Behavior
1. Load the original spec or task and extract acceptance criteria.
2. Delegate to `reviewer` with the diff and criteria.
3. Reviewer maps each criterion to evidence in code or tests.
4. Flag criteria that are unmet, partially met, or silently changed.
5. Recommend fixes or spec updates for any gaps.

## Outputs
- Criterion-by-criterion status table.
- List of gaps with recommended actions.
- Go/no-go verdict for marking the task complete.
