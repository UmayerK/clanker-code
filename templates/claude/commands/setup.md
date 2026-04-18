---
name: setup
description: Initialize the specs/ folder structure and project conventions file.
argument-hint: [--force] [--uc]
delegates-to:
---

## Purpose
Bootstrap a project with a `specs/` directory, starter templates, and a conventions file.

## Inputs
- `--force`: overwrite existing files if present.

## Behavior
1. Check for an existing `specs/` folder; stop unless `--force` is provided.
2. Create `specs/` with `00-overview.md`, `01-architecture.md`, and a feature template.
3. Write `specs/TEMPLATE-feature.md` matching the project's feature spec format.
4. Create or update `CLAUDE.md` with project conventions and command pointers.
5. Print next-step guidance for filling in the overview and architecture specs.

## Outputs
- `specs/` directory populated with starter files.
- `CLAUDE.md` with conventions stub.
- Next-step checklist for the user.

## MCP routing
- No MCPs required: scaffolds local files only.
