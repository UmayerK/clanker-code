---
name: implement
description: Implement a feature from a spec file or inline description, routing to the right builder.
argument-hint: <spec-path-or-description> [--strategy systematic|agile] [--depth normal|deep] [--validate] [--uc]
delegates-to: frontend-builder or backend-builder
---

## Purpose
Turn a feature spec or description into working, tested code by routing to the correct builder agent.

## Inputs
- `<spec-path-or-description>`: path to a `specs/*.md` file or a short inline feature description.

## Behavior
1. Load the spec file if a path is given; otherwise treat the argument as the brief.
2. Classify scope: UI/UX/client-only to `frontend-builder`; data/API/server-only to `backend-builder`; full-stack invokes both sequentially (backend first).
3. Delegate implementation, passing the brief and project conventions.
4. Confirm every acceptance criterion is addressed in the diff.
5. Surface any open questions back to the user before finalizing.

## Outputs
- Code changes that satisfy the spec's acceptance criteria.
- A concise summary of files touched and criteria covered.

## MCP routing
- **context7**: resolves current library and framework APIs before writing call sites.
- **serena**: finds insertion points, related symbols, and callers semantically.
- **sequential-thinking**: orders subtasks and reconciles the diff against acceptance criteria.
- **playwright**: validates UI acceptance criteria once the change is in place.
