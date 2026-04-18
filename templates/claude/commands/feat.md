---
name: feat
description: Full feature workflow: spec → explore → 3-approach design → implement → test → validate.
argument-hint: <feature-name> [--strategy systematic|agile|enterprise] [--parallel] [--validate] [--uc]
delegates-to: planner, code-explorer, code-architect, frontend-builder or backend-builder, tester, reviewer
---

## Purpose
Drive a feature end-to-end with a phased plan, multi-approach design, and validated tests. The signature pattern: **three parallel architectures presented; user picks; then build.**

## Inputs
- `<feature-name>`: short kebab-case name used for the spec file.
- `--parallel`: use wave orchestration for the build and review phases.

## Behavior

**Phase 1 — Spec:**
1. Create `specs/NN-feature-<feature-name>.md` from the project's feature template.
2. Delegate to `planner` to fill the spec interactively (Socratic). Capture acceptance criteria.

**Phase 2 — Explore:**
3. Delegate to `code-explorer` (read-only) to map entry points, execution flow, and extension points of the area being changed.

**Phase 3 — Design (parallel triad):**
4. Spawn three `code-architect` instances in parallel with different philosophies:
   - **Minimal** — smallest diff that satisfies criteria.
   - **Clean** — best long-term structure.
   - **Pragmatic** — honors existing patterns.
5. Present the three side-by-side. **User picks one** before Phase 4.

**Phase 4 — Implement:**
6. Route to `frontend-builder` or `backend-builder` (or both for full-stack) using the chosen blueprint.

**Phase 5 — Test:**
7. Delegate to `tester` for unit + integration + Playwright coverage on UI paths.

**Phase 6 — Review (parallel, if --parallel):**
8. Three parallel `reviewer` lenses: simplicity/DRY, bugs/correctness, conventions/standards. Confidence-filtered ≥ 80.

**Phase 7 — Validate:**
9. Run `/reflect --depth deep --validate --threshold 80`. If any criterion unmet, loop back to the right phase. Max 3 loops.

**Phase 8 — Finalize:**
10. Print suggested commit message; stop. No auto-commit, no auto-push.

**Incremental audit notes:**
During Phases 2, 3, 5, and 6, write intermediate findings to `.claude/scratch/feat-<name>.md` every few items so compaction mid-run doesn't lose progress.

## Outputs
- Filled spec file.
- Three design blueprints + user's choice.
- Implementation diff covering every criterion.
- Test suite run result.
- Parallel-lens review findings (≥80 confidence).
- Reflection verdict.
- Suggested commit message.

## MCP routing
- **sequential-thinking**: phase gating + synthesizing the three architect proposals.
- **memory**: carries spec, plan, and decisions across phases and sessions.
- **serena**: used by `code-explorer` and `reviewer` for semantic depth.
- **playwright**: exercises UI acceptance criteria end-to-end.
- **context7**: framework-specific guidance during implementation.
