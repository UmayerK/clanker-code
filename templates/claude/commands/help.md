---
name: help
description: List available slash commands with short descriptions.
argument-hint: [command-name]
delegates-to:
---

## Purpose
Help the user discover commands and learn what each one does.

## Inputs
- `[command-name]`: optional; show detailed help for a single command instead of the full list.

## Behavior
1. Scan the `commands/` directory for all command files.
2. Parse frontmatter for `name`, `description`, and `argument-hint`.
3. If a command name is provided, print its full frontmatter and body.
4. Otherwise, print a table of all commands grouped by category.
5. Highlight commands that delegate to agents and list agent names.

## Outputs
- Command table or single-command detail view.
- Quick-start pointers for common workflows.
