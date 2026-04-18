---
name: pm
description: Orchestrate multi-agent work with task breakdown, delegation, and progress tracking.
argument-hint: <goal> [--parallel] [--validate]
delegates-to: project-manager
---

## Purpose
Act as the default orchestration layer when a task spans multiple agents, requires coordinated hand-offs, or benefits from explicit progress tracking. Use `/pm` whenever a single-agent command would leave obvious work on the table.

## Inputs
- `<goal>`: the desired end-state in one sentence.
- `--parallel`: run independent sub-tasks as concurrent agents via `/spawn`.
- `--validate`: run `/reflect` against the result before reporting done.

## Behavior
1. Decompose the goal into 3–8 concrete sub-tasks with explicit acceptance criteria.
2. For each sub-task, pick the right agent (`planner`, `frontend-builder`, `backend-builder`, `reviewer`, `tester`, etc.).
3. Order sub-tasks by dependency; batch independent ones for parallel execution when `--parallel`.
4. Track progress via TodoWrite; surface status on demand.
5. Hand off artifacts explicitly between agents (the reviewer gets the implementer's diff; the tester gets the spec).
6. If `--validate`, run `/reflect` on the combined output before finalizing.

## Outputs
- A breakdown + status table.
- All sub-task artifacts in one place.
- A final "done / what's left" summary.

## MCP routing
- **sequential-thinking**: the decomposition step.
- **memory**: persist the task breakdown for cross-session resumption.
- Agents invoked downstream use their own MCP mix.
