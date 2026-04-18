# clanker-code hooks

These scripts implement safety and convenience hooks that run automatically on Claude Code events.

## Active by default

| Hook | Event | Purpose |
|---|---|---|
| `destructive-bash-guard.js` | PreToolUse(Bash) | Block obvious destructive commands (`rm -rf /`, force-push to main, etc.) |
| `secret-leak-guard.js` | PreToolUse(Write/Edit) | Block content containing common API key patterns |
| `gitignore-warn.js` | PreToolUse(Write) | Warn before writing to gitignored paths |
| `auto-format.js` | PostToolUse(Write/Edit) | Run project formatter (prettier/biome/ruff/black) on edited files |
| `spec-awareness.js` | UserPromptSubmit | Inject `specs/` file list into context when present |
| `git-context.js` | UserPromptSubmit | Inject current branch + `git status --short` |
| `stop-notify.js` | Stop | Terminal bell + OS notification for tasks >30s |

## Opt-in via `CLANKER_HOOKS_EXTRA=on`

| Hook | Event | Purpose |
|---|---|---|
| `session-log.js` | Stop | Append 2-line summary to `.claude/sessions/YYYY-MM-DD.md` |
| `typecheck-bg.js` | PostToolUse(Write/Edit) | Run `tsc --noEmit` in background after TS edits |
| `pkg-install-offer.js` | PostToolUse(Write) | Remind to run install after `package.json` changes |

## Kill switches

- `CLANKER_HOOKS=off` — disable all clanker hooks globally
- `CLANKER_HOOK_<NAME>=off` — disable specific hook (e.g., `CLANKER_HOOK_AUTO_FORMAT=off`)

## Writing your own

Each hook:

1. Reads a JSON event from stdin.
2. Decides to allow (`{"continue": true}`), block (`{"continue": false, "stopReason": "..."}`), or inject context (`{"continue": true, "additionalContext": "..."}`).
3. Must be fast (<100ms typical).
4. Must not make network calls.
5. Must honor `CLANKER_HOOKS=off`.

See `lib.js` for shared helpers (`ok()`, `block()`, `injectContext()`, `readStdinJson()`).
