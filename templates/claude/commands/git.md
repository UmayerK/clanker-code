---
name: git
description: Git operations with intelligent commit messages and safe defaults.
argument-hint: <status|commit|branch|log|diff> [args]
delegates-to:
---

## Purpose
Run common git operations with sensible defaults and auto-generated commit messages.

## Inputs
- `<subcommand>`: one of `status`, `commit`, `branch`, `log`, `diff`.
- `[args]`: passthrough arguments for the subcommand.

## Behavior
1. Run `git status` and `git diff --staged` to understand pending changes.
2. For `commit`, draft a Conventional Commits-style message from the staged diff.
3. Present the message for confirmation before committing.
4. Never push, force push, or create PRs unless the user explicitly requests it.
5. For other subcommands, run them directly and format output.

## Outputs
- Command output or formatted summary.
- Drafted commit message when committing.
- Warning if destructive flags were requested.
