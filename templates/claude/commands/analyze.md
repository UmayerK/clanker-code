---
name: analyze
description: Deep analysis across quality, security, performance, and architecture.
argument-hint: <path-or-scope> [--focus quality|security|perf|arch] [--depth shallow|normal|deep] [--parallel]
delegates-to: analyzer
---

## Purpose
Produce a prioritized findings report across four dimensions for the given scope. Semantic (Serena-aware) when available; falls back to Grep + Read.

## Inputs
- `<path-or-scope>`: file, directory, or module. Defaults to repo root.
- `--focus quality|security|perf|arch`: limit to one dimension; otherwise cover all four.
- `--depth shallow|normal|deep`: controls how many files to inspect and how far to trace callers.
- `--parallel`: run the four dimension passes concurrently via `/spawn` (faster, more tokens).

## Behavior
1. Resolve scope. If Serena is available, build a symbol inventory first — cheaper than reading everything.
2. For each active dimension, use the right approach:
   - **Quality**: complexity, duplication, naming, cohesion. Favor `analyzer` agent + `refactor-patterns` skill.
   - **Security**: `security-engineer` agent + `owasp-top-10` skill + secret-pattern scan.
   - **Performance**: `performance-engineer` agent + hot-path identification; no speculation without measurements.
   - **Architecture**: layering, coupling, cycles; Serena is ideal here.
3. Rank findings by severity × likelihood / effort-to-fix.
4. Surface the top 3 recommended actions separate from the full list.

## Outputs
- Severity-ranked findings with `file:line` citations.
- Concrete remediation suggestions per finding.
- Top-three actionable next steps.

## MCP routing
- **serena** (preferred for arch + semantic quality): symbol graph, call graph, cross-refs.
- **sequential-thinking**: structure the multi-dimension pass without losing threads.
- **context7**: library-specific best-practice reference where relevant.
- **playwright**: only if the scope includes UI correctness verification.
