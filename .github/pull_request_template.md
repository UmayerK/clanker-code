## Summary

<!-- One or two sentences. What changed and why. -->

## Type of change

- [ ] Bug fix
- [ ] New feature (new skill/agent/command/hook/MCP/CLI)
- [ ] Refactor (no behavior change)
- [ ] Docs / content update
- [ ] CI / tooling

## "Earns its slot" justification (required for new content)

If this PR adds a new skill, agent, command, hook, or MCP:

- **Problem solved:**
- **Token / latency cost:**
- **Why not just CLAUDE.md:**
- **Token-budget impact before/after:** ~___K → ~___K

PRs that skip this section for new content will be closed with a pointer to existing content.

## Test plan

- [ ] `npm test` passes locally
- [ ] `npx clanker-code doctor` clean in a fresh fixture repo
- [ ] Manual smoke on macOS / Linux / Windows (circle what applies)
- [ ] New content tested end-to-end in a real Claude Code session
- [ ] Hooks: verified `CLANKER_HOOKS=off` and per-hook kill switch still work

## Breaking changes

- [ ] None
- [ ] Yes — describe below and propose a migration note for `clanker update`

## Checklist

- [ ] Followed the existing format for skills / agents / commands (frontmatter + body sections)
- [ ] No mentions of external projects by name in shipped content
- [ ] No new network calls, auto-commits, or auto-pushes
- [ ] CHANGELOG entry added if user-visible
