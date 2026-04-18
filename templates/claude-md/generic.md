# Project Standards (clanker-code)

This file is managed in part by `clanker-code`. The section between the `<!-- clanker-code:start -->` and `<!-- clanker-code:end -->` markers is updated by `clanker update`. Edits outside those markers are preserved.

**Detected stack:** `{{STACK}}` · **Frameworks:** {{FRAMEWORKS}}

---

## 1. How Claude should work in this project

- Read this file, then `specs/` (if present), before acting on non-trivial work.
- For anything beyond a one-line fix, plan first. Use `/plan` or `/brainstorm`.
- Use the agents in `.claude/agents/`. Prefer the specialized one over a general-purpose run.
- Use skills in `.claude/skills/` — they're there to guide decisions on specific topics.
- Use the MCPs wired in `.mcp.json`:
  - **sequential-thinking** — architecture, debugging, multi-step reasoning
  - **context7** — library docs; reach for this before guessing library APIs
  - **memory** — persist durable project facts across sessions
  - **playwright** — verify UI behavior in a real browser

## 2. Testing

- After any change that affects user-visible behavior, verify it works before reporting done.
- For UIs: use Playwright (`browser_navigate`, `browser_snapshot`, check `browser_console_messages`).
- For backend: run the test suite or exercise the changed path.
- Cover happy path + one realistic edge case. Don't ship without running something.

## 3. Security baseline

- Never hardcode secrets. Use environment variables. `.env` is gitignored.
- Validate input at every boundary (forms, routes, API endpoints, URL params).
- Use parameterized queries — never string-concatenate user input into SQL.
- Escape output — HTML-encode user-generated content.
- Auth-check every protected route.
- Don't disable security mechanisms to "make the test pass."

## 4. Git conventions

- Commit messages follow conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Keep PRs small and focused. One concern per PR.
- Never force-push to `main`/`master`.
- Never `git push` without explicit authorization from the user.

## 5. Commands available

Type any of these in Claude Code:

- `/brainstorm <topic>` — interactive requirements discovery
- `/plan <task>` — break ambiguous work into steps
- `/implement <feature>` — implement with agent + testing
- `/debug <symptom>` — systematic root-cause investigation
- `/review` — review current diff against standards
- `/test <scope>` — write and/or run tests
- `/improve <target>` — refactor and quality improvements
- `/document <target>` — generate or update docs
- `/design <system>` — architecture design
- `/analyze <scope>` — deep analysis across quality/security/performance
- `/mcp-help` — discover and install more MCPs
- `/feat <name>` — full feature workflow (spec → implement → test)
- `/help` — full command list

## 6. Specs

- Feature specs live in `specs/`, numbered from `10-feature-*.md`.
- New features should start with `/feat <name>` which creates the spec first.
- Read existing specs in `specs/` before implementing anything the user refers to.
