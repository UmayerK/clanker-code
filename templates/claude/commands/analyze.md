---
name: analyze
description: Deep analysis across code quality, security, performance, and architecture.
argument-hint: <path-or-scope> [--focus quality|security|perf|arch]
delegates-to: analyzer
---

## Purpose
Produce a prioritized findings report across four dimensions for the given scope.

## Inputs
- `<path-or-scope>`: file, directory, or module to analyze. Defaults to repo root.
- `--focus`: optional filter to a single dimension.

## Behavior
1. Resolve the scope and enumerate target files.
2. Delegate to `analyzer` with the scope and focus flag.
3. Analyzer inspects quality (complexity, duplication), security (OWASP), performance (hot paths, N+1), and architecture (coupling, layering).
4. Rank findings by severity and effort-to-fix.
5. Return a structured report with file:line references and suggested remediations.

## Outputs
- Severity-ranked findings list with file:line citations.
- Concrete remediation suggestions per finding.
- Top-three recommended next actions.
