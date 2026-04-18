---
name: improve
description: Refactor and quality improvements without changing behavior.
argument-hint: <path-or-scope> [--goal readability|perf|types|tests]
delegates-to: refactorer
---

## Purpose
Improve code quality in-place while preserving behavior and test coverage.

## Inputs
- `<path-or-scope>`: file, directory, or symbol to improve.
- `--goal`: optional optimization target; defaults to readability.

## Behavior
1. Snapshot current tests and confirm they pass.
2. Delegate to `refactorer` with the scope and goal.
3. Refactorer applies small, reviewable changes: extract functions, rename, simplify control flow, tighten types.
4. Re-run tests after each logical change set.
5. Stop if any test fails and report the regression.

## Outputs
- Refactored code with passing tests.
- Before/after summary of complexity, size, or type coverage.
- List of deferred improvements not taken.
