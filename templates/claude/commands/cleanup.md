---
name: cleanup
description: Systematically remove dead code, unused exports, and stale artifacts.
argument-hint: <path-or-scope> [--depth shallow|normal|deep] [--parallel] [--validate] [--uc]
delegates-to: refactorer
---

## Purpose
Shrink the codebase by removing provably unused code and artifacts without changing behavior.

## Inputs
- `<path-or-scope>`: directory or module to clean.

## Behavior
1. Delegate to `refactorer` with the scope.
2. Identify unused exports, unreachable code, orphan files, and stale TODOs.
3. Cross-reference with test files and entry points before deletion.
4. Remove in small, reviewable commits grouped by category.
5. Run tests and typecheck after each batch.

## Outputs
- Deletions and small refactors with passing tests.
- Summary of items removed by category.
- List of suspicious-but-kept items requiring human review.

## MCP routing
- **serena**: semantic symbol search to prove an export has no remaining callers before deletion.
- **sequential-thinking**: sequences batches and validates each removal preserves behavior.
