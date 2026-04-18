---
name: feat
description: Full feature workflow: spec-first, implement, test, validate.
argument-hint: <feature-name>
delegates-to: planner, frontend-builder or backend-builder, tester
---

## Purpose
Drive a feature end-to-end from spec creation through implementation and verified tests.

## Inputs
- `<feature-name>`: short kebab-case name used for the spec file.

## Behavior
1. Create `specs/NN-feature-<feature-name>.md` using the project's feature template.
2. Delegate to `planner` to fill the spec via interactive questioning and produce an ordered plan.
3. Route implementation to `frontend-builder` or `backend-builder` based on scope; run both for full-stack.
4. Delegate to `tester` to write and run tests covering all acceptance criteria.
5. Validate every criterion is satisfied and tests pass before marking done.

## Outputs
- Completed spec file with checked acceptance criteria.
- Implementation diff covering the spec.
- Passing test suite with coverage summary.
