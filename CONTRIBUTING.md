# Contributing to clanker-code

Thanks for considering a contribution. Before you open a PR, read this — the kit has a hard governance rule that drives what gets merged.

## The "every slot earns its place" rule

Every shipped skill, agent, command, hook, and MCP costs startup tokens or latency for every user, on every Claude Code session. The kit's goal is to stay under ~20K startup tokens while delivering real value.

**For any new skill, agent, command, or hook, your PR must answer:**

1. **What problem does this solve that isn't already solved by existing content?**
2. **What is the token cost or latency cost?** (Measure it.)
3. **Who benefits?** (Primary: solo indie developers. Secondary: small-team engineers.)
4. **Why is this better than documenting the pattern in `CLAUDE.md`?**

PRs that can't answer these cleanly will be closed with a pointer to existing content that already covers the use case.

## What we won't ship

- Meta-commands that don't help ship code (business panels, estimation frameworks, decision matrices)
- Skills that duplicate built-in Claude Code tools (filesystem ops, basic git commands, generic web fetching)
- Hooks that auto-modify user files beyond format-on-save
- Hooks that make network calls
- MCPs that require signup or API keys in the default bundle (ship those in the registry for `mcp-help` instead)
- Auto-commit, auto-push, auto-run-tests-on-Stop behavior

## Content standards

### Skills

- Frontmatter: `name`, `description` (one line, ≤100 chars), `triggers` (when Claude should load this).
- Body: ≤300 words. Tight, specific guidance. No filler.
- Structure: problem → rule → example.

### Agents

- Frontmatter: `name`, `description`, `tools` (explicit list), `skills` (which skills this agent uses), `mcps` (which MCPs this agent uses).
- Body: role statement, when to invoke, what it produces, boundaries.

### Commands

- Frontmatter: `name`, `description`, `delegates-to` (agent name if any).
- Body: inputs, outputs, workflow steps.

### Hooks

- Written as Node.js scripts in `templates/hooks/scripts/`.
- Must be idempotent, offline, and fast (<100ms typical).
- Must honor `CLANKER_HOOKS=off` and hook-specific env vars.
- Must not make network calls.
- Must not write to user files beyond the documented behavior.

## Testing

Every PR that adds or changes CLI behavior must include:

- Unit tests for new functions
- Integration test for the user-visible flow
- Manual test on a fresh fixture repo

Run `npm test` before pushing.

## Measuring token cost

We ship a token-measurement script (`scripts/measure-tokens.js`) that estimates the startup cost of shipped content. Run it before and after your change; include the delta in the PR description.

## Release process

Maintainers only. Versioning follows semver. Breaking changes to installed content structure require a major bump and a migration note in the `update` command.
