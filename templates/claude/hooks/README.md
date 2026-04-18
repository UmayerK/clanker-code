# clanker-code hooks

Hook scripts run automatically on Claude Code events.

## Active by default (8)

| Hook | Event | Purpose |
|---|---|---|
| `destructive-bash-guard.js` | PreToolUse(Bash) | Block destructive commands (`rm -rf /`, force-push main, DROP TABLE, mkfs, fork bombs) |
| `secret-leak-guard.js` | PreToolUse(Write/Edit) | Block content containing common API key patterns |
| `gitignore-warn.js` | PreToolUse(Write) | Warn before writing to gitignored paths |
| `auto-format.js` | PostToolUse(Write/Edit) | Run project formatter (prettier/biome/ruff/black) |
| `spec-awareness.js` | UserPromptSubmit | Inject `specs/` file list into context when present |
| `git-context.js` | UserPromptSubmit | Inject current branch + `git status --short` |
| `context-reinject.js` | SessionStart(compact) | Re-inject project context (branch/commits/specs/CLAUDE.md head) after auto-compaction |
| `stop-notify.js` | Stop | Terminal bell + OS notification for tasks >30s |

## Opt-in via `CLANKER_HOOKS_EXTRA=on` (or per-hook flag)

| Hook | Event | Purpose |
|---|---|---|
| `session-log.js` | Stop | Append 2-line session summary to `.claude/sessions/YYYY-MM-DD.md` |
| `typecheck-bg.js` | PostToolUse(Write/Edit) | Background `tsc --noEmit` after TS edits |
| `pkg-install-offer.js` | PostToolUse(Write) | Remind to run install after `package.json` changes |
| `transcript-backup.js` | PreCompact | Dump the pre-compact transcript to `.claude/transcripts/*.jsonl` |
| `exit-plan-autoapprove.js` | PreToolUse(ExitPlanMode) | Auto-approve ExitPlanMode permission prompts (safest auto-approve pattern) |

## Kill switches

- `CLANKER_HOOKS=off` — disable all clanker hooks globally
- `CLANKER_HOOK_<NAME>=off` — disable a specific hook (e.g., `CLANKER_HOOK_AUTO_FORMAT=off`)
- `CLANKER_HOOKS_EXTRA=on` — enable the opt-in bundle
- `CLANKER_HOOK_<NAME>=on` — enable a specific opt-in hook without turning on the whole extras bundle
- `CLANKER_HOOK_CONTEXT_REINJECT_ALWAYS=on` — re-inject on every SessionStart, not just `compact`

## Writing your own

Each hook:

1. Reads a JSON event from stdin.
2. Decides to allow (`{"continue": true}`), block (`{"continue": false, "stopReason": "..."}`), or inject context (`{"continue": true, "additionalContext": "..."}`).
3. Must be fast (<100ms typical).
4. Must not make network calls.
5. Must honor `CLANKER_HOOKS=off` and its own per-hook kill switch.

See `lib.js` for shared helpers (`ok()`, `block()`, `injectContext()`, `readStdinJson()`).
