---
name: task
description: Orchestrate a complex multi-step task across agents and phases.
argument-hint: <task-description> [--strategy systematic|agile|enterprise] [--parallel] [--validate] [--uc]
delegates-to: project-manager
---

## Purpose
Coordinate a multi-phase task by planning, delegating, and integrating results.

## Inputs
- `<task-description>`: the high-level objective to orchestrate.

## Behavior
1. Delegate to `project-manager` to decompose the task into phases.
2. Project-manager identifies which agents run in each phase and in what order.
3. Execute phases sequentially, passing artifacts between agents.
4. After each phase, validate outputs before proceeding.
5. Summarize results and remaining work at completion.

## Outputs
- Phase-by-phase plan with assigned agents.
- Artifacts produced per phase.
- Final summary with status and remaining items.

## MCP routing
- **sequential-thinking**: plans phase ordering and gates progression on validation results.
- **memory**: carries artifacts between phases and agents without re-deriving context.
