---
name: test
description: Write and/or run tests for a given scope with coverage reporting.
argument-hint: <path-or-scope> [--write | --run | --both] [--parallel] [--validate] [--uc]
delegates-to: tester
---

## Purpose
Raise test confidence for a scope by adding missing tests, running the suite, and reporting coverage.

## Inputs
- `<path-or-scope>`: file, module, or feature under test.
- `--write | --run | --both`: mode; defaults to `--both`.

## Behavior
1. Delegate to `tester` with the scope and mode.
2. Tester identifies untested branches and missing edge cases.
3. Write unit and integration tests following project conventions.
4. Execute the test suite and capture failures.
5. Report coverage deltas and flaky tests observed.

## Outputs
- New or updated test files.
- Pass/fail summary with failing test details.
- Coverage delta and list of remaining gaps.

## MCP routing
- **playwright**: drives end-to-end and UI interaction tests in a real browser.
- **serena**: locates existing tests, fixtures, and untested branches by symbol.
