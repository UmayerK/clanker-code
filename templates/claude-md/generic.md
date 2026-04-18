# Project Standards (clanker-code)

This file is managed in part by `clanker-code`. The section between the `<!-- clanker-code:start -->` and `<!-- clanker-code:end -->` markers is updated by `clanker update`. Edits outside those markers are preserved.

**Detected stack:** `{{STACK}}` · **Frameworks:** {{FRAMEWORKS}}

---

## 1. How Claude should work in this project

- Read this file, then `specs/` (if present), before acting on non-trivial work.
- For anything beyond a one-line fix, plan first. Use `/plan` or `/brainstorm`.
- **Activate the right specialist mindset automatically** — see the `persona-auto-activation` skill. A security question gets an OWASP lens; a perf question demands measurements; an architecture question gets ADR treatment. Do not wait for explicit `/agent` invocation.
- Use the agents in `.claude/agents/` for tasks that need parallelism or file writes.
- Use skills in `.claude/skills/` — they guide decisions on specific topics.
- Use the MCPs wired in `.mcp.json`:
  - **sequential-thinking** — architecture, debugging, multi-step reasoning
  - **context7** — library docs; reach for this before guessing library APIs
  - **memory** — persist durable project facts across sessions
  - **playwright** — verify UI behavior in a real browser
  - **serena** *(if configured)* — LSP-backed semantic code editing; preferred for renames, find-usages, impact analysis. See `serena-semantic-editing` skill.

## 2. Global command flags

Every command supports these flags (see `command-flags-spec` skill):

- `--strategy systematic|agile|enterprise` — mode of working
- `--depth shallow|normal|deep` — how far to trace
- `--parallel` — run independent sub-tasks concurrently via `/spawn` or wave orchestration
- `--validate` — refuse to return "done" until `/reflect --validate` passes
- `--uc` — ultracompressed response mode (see `ultracompressed-mode` skill)

Flags compose.

## 3. Multi-agent orchestration

For tasks that span multiple specialists, use **wave orchestration** (see `wave-orchestration` skill): plan → build → verify, with consolidation between waves. `/pm` and `/spawn` are the entry points.

## 4. Testing

- After any change that affects user-visible behavior, verify it works before reporting done.
- For UIs: use Playwright (`browser_navigate`, `browser_snapshot`, check `browser_console_messages`).
- For backend: run the test suite or exercise the changed path.
- Cover happy path + one realistic edge case. Don't ship without running something.

## 5. Security baseline

- Never hardcode secrets. Use environment variables. `.env` is gitignored.
- Validate input at every boundary (forms, routes, API endpoints, URL params).
- Use parameterized queries — never string-concatenate user input into SQL.
- Escape output — HTML-encode user-generated content.
- Auth-check every protected route.
- Don't disable security mechanisms to "make the test pass."

## 6. Git conventions

- Commit messages follow conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Keep PRs small and focused. One concern per PR.
- Never force-push to `main`/`master`.
- Never `git push` without explicit authorization from the user.

## 7. Commands available

- `/brainstorm <topic>` — interactive requirements discovery
- `/plan <task>` — break ambiguous work into steps
- `/implement <feature>` — implement with agent + testing
- `/debug <symptom>` — systematic root-cause investigation
- `/review` — review current diff against standards
- `/test <scope>` — write and/or run tests
- `/improve <target>` — refactor and quality improvements
- `/document <target>` — generate or update docs
- `/design <system>` — architecture design
- `/analyze <scope>` — deep analysis across quality/security/perf/arch
- `/index-repo` — compress the repo into a minimal knowledge brief
- `/select-tool <task>` — score complexity and pick the right MCP/tool
- `/pm <goal>` — multi-agent orchestration with task breakdown
- `/recommend <goal>` — recommend the right command for a fuzzy ask
- `/reflect` — validate completed work against requirements
- `/mcp-help` — discover and install more MCPs
- `/feat <name>` — full feature workflow (spec → implement → test)
- `/help` — full command list

## 8. Specs

- Feature specs live in `specs/`, numbered from `10-feature-*.md`.
- New features should start with `/feat <name>` which creates the spec first.
- Read existing specs in `specs/` before implementing anything the user refers to.
