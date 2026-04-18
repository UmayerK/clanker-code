# clanker-code

**The Claude Code starter kit. One command. Ready to ship.**

`clanker-code` transforms any repository into a fully-configured Claude Code workspace in under a minute. It installs curated skills, specialized agents, slash commands, safety hooks, and pre-wired local-first MCPs — all tuned for one thing: shipping code.

---

## Quickstart

```bash
cd your-project
npx clanker-code init
claude
```

That's it. Your repo now has:

- **4 pre-wired local-first MCPs** (+ Serena auto-added if `uv` is detected) — no signup, no API keys
- **25 slash commands** — headlined by `/vibe` (fuzzy idea → working app, end to end), plus `/brainstorm`, `/implement`, `/debug`, `/review`, `/test`, `/feat`, `/select-tool`, `/pm`, `/recommend`, `/reflect`, `/mcp-help`, and more
- **20 specialized agents** — frontend-builder, backend-builder, debugger, reviewer, planner, tester, security-engineer, architect, and 12 more
- **41 curated skills** — workflow, quality, security, git, framework-specific, plus framework patterns (persona auto-activation, wave orchestration, global flags, UC mode, Serena usage)
- **Global command flags** — `--strategy systematic|agile|enterprise`, `--depth shallow|normal|deep`, `--parallel`, `--validate`, `--uc` (ultracompressed)
- **8 safety + ergonomics hooks** — auto-format, destructive-command guard, secret-leak guard, spec-awareness, git-context, SessionStart(compact) re-inject, and more (plus 5 opt-in)
- **Default statusline via `npx ccusage statusline`** — live context and cost tracking in your status bar (Anthropic's recommended pattern)
- **Stack-tailored `CLAUDE.md`** — auto-detects Next.js, React, Node API, Python API, and more
- **`specs/` scaffolding** — spec-first workflow out of the box

### The `/vibe` command

```
/vibe a team todo app with daily standup summaries
```

One command. Claude asks a few clarifying questions (Socratic, one at a time), writes the spec, plans it, builds it in parallel across specialized agents, tests with Playwright, reviews against OWASP and project standards, and stops with a suggested commit message. No auto-commits, no auto-pushes — you stay in control.

---

## What problem does this solve?

Claude Code is powerful — and it ships as a blank slate. Every developer reinvents the same `CLAUDE.md`, the same skill bundle, the same hook configuration. Setup takes hours. Teams drift into inconsistent configs. MCPs require hand-editing JSON files.

`clanker-code` is the missing install layer. One command. Opinionated defaults. Zero dotfiles to copy-paste.

### Compared to alternatives

| | Manual setup | SuperClaude | **clanker-code** |
|---|---|---|---|
| One-command install | No | Python (pip) | **npm (npx)** |
| Pre-wired MCPs | No | No | **Yes** |
| Framework detection | No | No | **Yes** |
| Safety hooks out of box | No | No | **Yes** |
| MCP discovery command | No | No | **Yes** |
| Cross-platform (Win/Mac/Linux) | Manual | Manual | **Yes** |
| Interactive update (3-way merge) | No | No | **Yes** |
| Coding workflows focused | Manual | Meta-heavy | **Yes** |

---

## Commands

```bash
# Install into the current repo (with interactive stack detection)
npx clanker-code init

# Common variants
npx clanker-code init --minimal         # CLAUDE.md + specs/ only
npx clanker-code init --no-mcps         # skip MCP configuration
npx clanker-code init --no-hooks        # skip hook configuration
npx clanker-code init --force           # overwrite without prompting
npx clanker-code init --dry-run         # preview what would be written

# Update to latest shipped version (interactive 3-way merge)
npx clanker-code update

# Discover and install more MCPs
npx clanker-code mcp-help                # interactive browse
npx clanker-code mcp-help list           # list all known MCPs
npx clanker-code mcp-help search <query> # search registry
npx clanker-code mcp-help show <name>    # details + setup instructions
npx clanker-code mcp-help add <name>     # guided install (prompts for keys)
npx clanker-code mcp-help remove <name>  # uninstall

# Meta
npx clanker-code help
npx clanker-code version
```

---

## What gets installed

### Default MCPs (4 + 1 conditional)

All local-first, no signup, no API keys.

| MCP | What it does |
|---|---|
| `sequential-thinking` | Structured reasoning for architecture, debugging, complex problems |
| `context7` | Up-to-date library docs (kills hallucinated API calls) |
| `memory` | Local knowledge graph — persist project facts across sessions |
| `playwright` | Real browser automation for UI verification (downloads Chromium on first use) |
| `serena` *(auto-added if `uv` is installed)* | LSP-backed semantic code editing — renames, find-usages, impact analysis |

If `uv` is not installed, Serena is skipped (with a hint for how to enable it later). Install `uv` at https://docs.astral.sh/uv/ then run `npx clanker-code mcp-help add serena`.

Need more? `clanker mcp-help` has a curated registry of 14+ MCPs across categories — databases, code intelligence, GitHub, Notion, Linear, Figma, and more — with guided setup for anything needing an API key.

### Hooks

**Active by default (7):**

| Hook | What it does |
|---|---|
| Destructive Bash guard | Blocks `rm -rf /`, force-push to main, `DROP TABLE`, fork bombs, mkfs, dd-to-device |
| Secret leak guard | Blocks writing content with Anthropic/OpenAI/GitHub/Stripe/AWS/Google/Slack keys |
| Gitignore warning | Warns before writing to gitignored paths (prevents lost work in `.env`, `build/`) |
| Auto-format | Runs detected formatter (prettier, biome, ruff, black) on edited files |
| Spec-awareness | Injects `specs/` file list into context automatically |
| Git context | Injects current branch + `git status --short` into every prompt |
| Stop notification | Terminal bell + OS notification when a long task completes |

**Opt-in via `CLANKER_HOOKS_EXTRA=on`:**

- Session log on Stop (appends to `.claude/sessions/YYYY-MM-DD.md`)
- Auto-typecheck after TS edits (background `tsc --noEmit`)
- Package install reminder after `package.json` changes

**Kill switches:**
- `CLANKER_HOOKS=off` — disable all clanker hooks globally
- `CLANKER_HOOK_<NAME>=off` — disable a specific hook (e.g., `CLANKER_HOOK_AUTO_FORMAT=off`)

### Slash commands

25 commands. Every command supports the global flag set (`--strategy`, `--depth`, `--parallel`, `--validate`, `--uc`).

```
/vibe         /brainstorm   /implement    /analyze      /debug
/improve      /document     /test         /design       /build
/cleanup      /estimate     /explain      /git          /index
/load         /save         /reflect      /help         /research
/mcp-help     /feat         /select-tool  /pm           /recommend
```

**Power commands:**

- `/vibe <idea>` — **fuzzy idea → complete working app**, end to end
- `/pm <goal>` — multi-agent orchestration (replaces `/task` and `/spawn`)
- `/select-tool <task>` — explicit MCP/tool selection based on task complexity
- `/recommend <goal>` — fuzzy-ask to concrete-command recommendation
- `/reflect [--depth deep] [--validate]` — semantic validation that closes the loop
- `/index --brief` — compress repo into a <3K-token brief for cheap downstream context

### Agents (20)

**12 persona agents:** architect, analyzer, frontend-engineer, backend-engineer, security-engineer, devops-engineer, performance-engineer, quality-engineer, mentor, refactorer, scribe, project-manager

**8 coding agents:** frontend-builder, backend-builder, debugger, reviewer, planner, tester, doc-writer, refactor-executor

### Skills (~45)

- **Workflow (6):** plan-before-coding, debug-systematically, test-before-commit, review-own-diff, incremental-refactor, ask-before-assuming
- **Quality & security (5):** OWASP top 10, input validation, secrets hygiene, a11y basics, perf budget
- **Tool-use (4):** when to reach for Playwright, Context7, sequential-thinking, memory
- **Git (3):** conventional commits, small focused PRs, PR description template
- **Framework-aware (16):** Next.js, React, API patterns, FastAPI, Django, Flask, Prisma, Tailwind, TypeScript, pytest, and more — only loaded if detected
- **Meta (11):** systematic analysis, Socratic brainstorming, estimation, research depth, architecture decisions, and more

---

## Supported stacks (auto-detected)

- **Next.js** (app router patterns, server actions, RSC guidance)
- **React** (Vite, CRA — hooks rules, state colocation)
- **Node API** (Express, Fastify, Hono, Koa — REST conventions, error handling)
- **Python API** (FastAPI, Flask, Django — DI patterns, Pydantic)
- **Rust, Go** — basic detection + generic guidance
- **Generic fallback** — universal content for anything else

Detection is based on `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`.

---

## Updating

```bash
npx clanker-code update
```

Performs an interactive **3-way merge**. For each changed file, clanker compares your installed version against the original (shipped) version and the new (latest) version:

- Untouched files → **auto-updated**
- Your modifications to files we didn't change → **kept as-is**
- New files → **added**
- Conflicts (both you and we changed it) → **prompt**: keep yours / take new / skip

No destructive overwrites. Your changes are safe.

---

## Configuration

All opt-outs via environment variables (no config file needed):

| Variable | Effect |
|---|---|
| `CLANKER_HOOKS=off` | Disable all clanker hooks globally |
| `CLANKER_HOOKS_EXTRA=on` | Enable opt-in hooks (session log, typecheck, pkg-install) |
| `CLANKER_HOOK_<NAME>=off` | Disable a specific hook by name |
| `CLANKER_NOTIFY_THRESHOLD_MS` | Override stop-notify threshold (default: 30000ms) |
| `CLANKER_DEBUG=1` | Show stack traces on CLI errors |

---

## Safety & trust

`clanker-code` is designed to be safe to run in any repository:

- **No network calls** from hooks or CLI (except MCP servers which you explicitly enable)
- **No telemetry** — nothing phones home
- **No auto-modify** of your files beyond format-on-save and the content clanker installs
- **Merge-on-collision** by default — never silently overwrites existing `.claude/` or `CLAUDE.md`
- **Backup on replace** — explicit `backup-and-replace` option preserves your previous config
- **Destructive commands blocked** at the hook layer (`rm -rf /`, force-push to main, etc.)
- **Secret leak guard** blocks writing obvious API keys
- **MIT licensed** — open source, auditable

See [`SECURITY.md`](./SECURITY.md) for the full security policy and vulnerability reporting.

---

## FAQ

**Does this replace SuperClaude?**
No. clanker-code is *inspired by* SuperClaude's command taxonomy and ships 21 parity commands, but focuses tightly on coding workflows and adds MCPs + hooks + framework awareness that SuperClaude doesn't. You can use both together.

**Does clanker-code work on Windows?**
Yes — native Windows, WSL, and Mac/Linux are all supported. The CLI is cross-platform Node.js with no native deps.

**What if I already have a `.claude/` folder?**
`init` detects it and prompts: merge (add missing clanker content, keep yours), backup-and-replace (saves existing to `.clanker-backup/`), or abort. Never overwrites silently.

**How do I uninstall?**
Delete `.claude/`, `.mcp.json`, and the clanker-code section of `CLAUDE.md` (between the `<!-- clanker-code:start -->` / `<!-- clanker-code:end -->` markers).

**Does Playwright really need 150MB?**
Only on first use — Playwright downloads Chromium when you run it the first time. You can pre-download with `npx playwright install chromium`, or skip Playwright entirely with `npx clanker-code init` and remove the playwright entry from `.mcp.json`.

**How do I add a team-specific skill or command?**
After `init`, `.claude/skills/` and `.claude/commands/` are yours to edit. Your changes persist through `clanker update` unless the file was shipped by clanker and you didn't modify it.

**Can I use clanker-code in a private repo?**
Yes. The CLI reads only your project files locally. Nothing is uploaded.

---

## Complementary Anthropic plugins (install via `/plugin`)

`clanker-code` deliberately does not reinvent what Anthropic already ships as official plugins. For deeper capability, complement clanker with:

- **`/plugin install hookify@anthropic-official`** — create custom hooks from natural-language rules. The 80/20 answer for "I want Claude to always/never do X."
- **`/plugin install pr-review-toolkit@anthropic-official`** — specialist PR-review agents (comments, tests, error handling, type design, simplification).
- **`/plugin install claude-md-management@anthropic-official`** — the upstream version of clanker's `claude-md-improver` skill + `/revise-claude-md` command.
- **`/plugin install ralph-loop@anthropic-official`** — iterate-until-complete workflow loop.
- **`/plugin install skill-creator@anthropic-official`** — author your own skills with evals and benchmarks.
- **`/plugin install mcp-server-dev@anthropic-official`** — build MCP servers in TypeScript or Python.

### Matching LSP plugin (auto-suggested on `init`)

For deeper semantic code awareness, install the LSP plugin matching your detected stack:

| Stack | Plugin |
|---|---|
| Next.js / React / TypeScript | `/plugin install typescript-lsp@anthropic-official` |
| Python | `/plugin install pyright-lsp@anthropic-official` |
| Rust | `/plugin install rust-analyzer-lsp@anthropic-official` |
| Go | `/plugin install gopls-lsp@anthropic-official` |
| Ruby / PHP / Java / C# / Swift / Kotlin / Lua / C++ | `/plugin install <lang>-lsp@anthropic-official` |

`clanker init` prints the matching recommendation for your stack automatically.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The governance rule is simple: **every skill, agent, command, hook, and MCP must earn its slot**. PRs that add content without justifying startup-token cost will be closed with a pointer to existing content.

---

## License

[MIT](./LICENSE) © Umayer

---

## Links

- **GitHub:** https://github.com/UmayerK/clanker-code
- **npm:** https://www.npmjs.com/package/clanker-code
- **Issues:** https://github.com/UmayerK/clanker-code/issues
