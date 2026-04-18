---
name: save
description: Persist session decisions, symbols touched, and open threads to memory (and Serena if present).
argument-hint: [--note "<summary>"] [--scope session|feature|project]
delegates-to:
---

## Purpose
Write a durable record so the next session (or a collaborator) can resume where we left off.

## Inputs
- `--note "<summary>"`: one-line human-readable summary attached to the record.
- `--scope session` (default): decisions from this session only.
- `--scope feature`: include the feature spec's criteria state and linked symbols.
- `--scope project`: also persist high-level architecture shifts.

## Behavior
1. Collect decisions, files touched, symbols changed, open TODOs, and unresolved questions.
2. If Serena is available, ask it for the exact symbols modified during the session and record those rather than file paths.
3. Format a concise record: timestamp, scope, decision list, next actions, retrieval key.
4. Write to memory MCP under the project namespace.
5. If feature-scoped, update the linked `specs/10-feature-*.md` acceptance-criteria checkboxes where appropriate.
6. Print the retrieval key for future `/load` runs.

## Outputs
- Confirmation of saved record + retrieval key.
- Summary of captured decisions and open threads.

## MCP routing
- **memory** (primary): durable record store.
- **serena**: symbol-level accuracy when present.
