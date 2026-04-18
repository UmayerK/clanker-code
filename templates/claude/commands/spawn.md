---
name: spawn
description: Delegate a task to multiple parallel agents and merge results.
argument-hint: <task-description> [--agents a,b,c] [--parallel] [--uc]
delegates-to: project-manager
---

## Purpose
Run several agents in parallel on independent slices of a task and integrate their outputs.

## Inputs
- `<task-description>`: the task to parallelize.
- `--agents`: optional comma-separated agent list; inferred if omitted.

## Behavior
1. Delegate to `project-manager` to partition the task into independent slices.
2. Assign each slice to an appropriate agent; ensure slices do not conflict.
3. Launch agents in parallel with isolated scopes.
4. Collect results and resolve any overlaps or contradictions.
5. Produce a unified output and list any unmerged items.

## Outputs
- Merged artifacts from all agents.
- Per-agent summary of what each produced.
- Conflict log and resolution decisions.

## MCP routing
- **memory**: persists hand-off artifacts between parallel agents and the integrator.
