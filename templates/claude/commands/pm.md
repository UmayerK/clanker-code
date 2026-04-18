---
name: pm
description: Orchestrate multi-agent work — task breakdown, parallel execution, progress tracking, validation.
argument-hint: <goal> [--strategy systematic|agile|enterprise] [--parallel] [--validate] [--uc]
delegates-to: project-manager
---

## Purpose
Default orchestration layer when work spans multiple agents, requires coordinated hand-offs, or benefits from explicit progress tracking. `/pm` supersedes and replaces earlier `/task` and `/spawn` commands — the `--parallel` flag covers what `/spawn` did, and task breakdown is first-class.

## Inputs
- `<goal>`: the desired end-state in one sentence.
- `--strategy`: `agile` (iterate small slices) or `systematic` (full breadth) or `enterprise` (formal documentation + audit trail).
- `--parallel`: run independent sub-tasks as concurrent agents. Same effect as the dropped `/spawn`.
- `--validate`: run `/reflect --validate` before reporting done; refuse "done" on gaps.

## Behavior
1. Decompose the goal into 3–8 concrete sub-tasks with explicit acceptance criteria.
2. For each sub-task, pick the right agent (`planner`, `frontend-builder`, `backend-builder`, `reviewer`, `tester`, `doc-writer`, etc.).
3. Order sub-tasks by dependency. Batch independent ones for parallel execution when `--parallel`.
4. Use **wave orchestration** for complex flows: plan → build → verify, with consolidation between waves. See `wave-orchestration` skill.
5. Track progress via TodoWrite; surface status on demand.
6. Hand off artifacts explicitly between agents (reviewer gets the diff, tester gets the spec).
7. If `--validate`, run `/reflect --depth deep --validate` on the combined output before finalizing.

## Outputs
- Breakdown + status table.
- All sub-task artifacts consolidated.
- Final "done / what's left" summary.

## MCP routing
- **sequential-thinking**: the decomposition and wave consolidation steps.
- **memory**: persist the task breakdown for cross-session resumption.
- Agents invoked downstream use their own MCP mix.
