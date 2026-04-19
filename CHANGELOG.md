# Changelog

All notable changes to `clanker-code` are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/spec/v2.0.0.html).

## [0.5.1] — 2026-04-18

Pre-launch polish: CI, health check, community files, scrubbed repo metadata.

### Added

- **`clanker doctor` CLI subcommand** — health-checks Node version, Git, `.claude/` structure, MCP config, hooks, and common misconfigurations. Prints green / yellow / red report.
- **GitHub Actions CI** (`.github/workflows/test.yml`) — runs the full test suite on Node 18/20/22 across Linux, macOS, and Windows on every push and PR.
- **`CODE_OF_CONDUCT.md`** — Contributor Covenant v2.1.
- **Issue + PR templates** under `.github/` — bug reports, feature requests, and structured PR descriptions.
- **Native statusline** (`templates/claude/scripts/statusline.js`) — shows workspace, branch, and model in the Claude Code status bar. Zero external dependencies.
- **README badge row** — npm version, CI, license, Node version.

### Changed

- **Statusline** is now a native script instead of an external CLI invocation. No runtime dependency added, no `npx` bootstrap cost.
- CHANGELOG and README scrubbed of third-party attributions to read as a standalone project.

## [0.5.0] — 2026-04-18

Major content expansion focused on high value-per-token additions.

### Added

**New agents (2):**
- `code-explorer` — deep-dives an existing feature read-only: entry points, execution flow, key components, extension points.
- `code-architect` — designs 3 parallel implementation approaches (minimal / clean / pragmatic). User picks one before `/feat` moves to implementation.

**New command (1):**
- `/revise-claude-md` — audits CLAUDE.md against current repo state; optionally captures session learnings back into it. Proposes diffs, never silently edits.

**New skills (4, lazy-loaded — zero startup cost):**
- `meta/claude-md-improver.md` — prevent CLAUDE.md rot; power `/revise-claude-md`.
- `workflow/tdd.md` — multi-agent RED / GREEN / REFACTOR with separate subagents per phase.
- `quality/api-design-reviewer.md` — REST API linting + breaking-change detection.
- `quality/dependency-auditor.md` — license compliance, CVE scan, upgrade planning.

**Enhanced commands:**
- `/reflect` — added confidence scoring (0–100, filter ≥ 80), `--parallel` for three-lens review, `--threshold N` flag. Added incremental-notes pattern.
- `/feat` — full 8-phase workflow with 3 parallel `code-architect` proposals (minimal / clean / pragmatic), `code-explorer` in Phase 2, parallel reviewers in Phase 6, incremental notes.
- `/analyze` — added incremental-notes pattern for long audits.

**MCP registry:**
- Added `codesight-mcp` (non-default) — 66 languages, 34 tools, hardened tree-sitter AST retrieval.

### Changed

- **Agents:** 20 → 22.
- **Skills:** 42 → 46.
- **Commands:** 25 → 26.
- **MCP registry:** 16 → 17.
- **Startup token budget:** ~18–20K.

### Notes

- Incremental audit notes pattern is near-free and solves the #1 long-run failure mode: compaction mid-audit.
- `claude-md-improver` skill pairs with the `@import` CLAUDE.md pattern from v0.4 for a full "keep CLAUDE.md clean and current" story.

---

## [0.4.0] — 2026-04-18

Hooks, MCPs, and CLAUDE.md structure overhaul.

### Added

- **Default statusline** (`statusLine` in `settings.json`) for live context tracking in the status bar. Zero startup tokens.
- **`/plan` skill (`plan-mode.md`)** — teaches Claude to enter Plan Mode on `/plan <task>` for an explicit Explore → Plan → Implement → Commit loop.
- **`SessionStart(compact)` context re-inject hook** — active by default. After auto-compaction, re-injects branch, last 5 commits, active specs list, and CLAUDE.md top-line. Only fires on compaction — zero cost on fresh sessions.
- **`PreCompact` transcript-backup hook** — opt-in. Dumps pre-compact transcript to `.claude/transcripts/*.jsonl` for detail recovery.
- **`ExitPlanMode` auto-approve hook** — opt-in. Narrow auto-approve for just the Plan Mode exit prompt.
- **Code graph MCPs in registry** (non-default): `code-graph-mcp` and `code-review-graph`. Both local-first, claim 6.8–49× token reductions on repo-wide review.
- **`@import` in all 5 CLAUDE.md templates** — lazy-loads `specs/00-product.md`, `specs/01-stack.md`, `specs/02-standards.md` on demand. Net-saves 300–1,500 tokens per session.

### Changed

- **Hooks:** 10 → 13 (8 active + 5 opt-in).
- **Skills:** 41 → 42.
- **MCP registry:** 14 → 16.

### Notes

- All new hooks honor `CLANKER_HOOKS=off` and per-hook kill switches.
- `exit-plan-autoapprove` uses the narrowest possible matcher (only `ExitPlanMode`); no broader permission loosening.
- Code graph MCPs require individual enable via `mcp-help add` — not auto-installed since they have overlap with Serena and users should pick one.

---

## [0.3.0] — 2026-04-18

Added the headline `/vibe` command. Trimmed ~4,700 startup tokens through surgical cuts.

### Added

- **`/vibe <idea>`** — end-to-end app builder. Fuzzy idea → Socratic discovery → spec → plan → parallel build → test → review → reflection. Stops with a suggested commit message; never auto-commits or auto-pushes.
- **`systematic-investigation` skill** — unified skeleton for debugging, performance, and security investigations. Replaces three separate skills with one stronger one.
- **`/index --brief` mode** — produces a <3K-token repo knowledge brief (replaces the dropped `/index-repo`).
- **`clanker init --setup-only` flag** — writes only `specs/` scaffolding for existing repos (replaces the dropped `/setup` command).

### Removed

- `/task` — superseded by `/pm`, which has first-class task breakdown.
- `/spawn` — superseded by `/pm --parallel`.
- `/setup` — now `clanker init --setup-only` on the CLI.
- `/index-repo` — merged into `/index --brief`.
- 6 meta skills collapsed into their command bodies: `brainstorm-socratic`, `estimate-conservatively`, `research-depth`, `explain-educationally`, `analyze-systematically`, `document-patterns`.
- 3 investigation skills consolidated into `systematic-investigation`: `debug-systematically`, `performance-investigation`, `security-audit-approach`.
- `architecture-decisions` skill — already covered by `/design` and the `architect` agent.

### Changed

- **Commands:** 28 → 25 (removed 4: `/task`, `/spawn`, `/setup`, `/index-repo`; added 1: `/vibe`).
- **Skills:** 50 → 41.
- **Startup token budget:** ~22–24K → ~17–19K.

---

## [0.2.0] — 2026-04-18

Command and orchestration framework maturity pass.

### Added

**New commands (5):**
- `/index-repo` — compress the repository into a minimal (<3K token) knowledge brief, with `--depth shallow|normal|deep`.
- `/select-tool <task>` — classify task complexity and explicitly pick the right MCP / built-in tool before acting.
- `/pm <goal>` — default orchestration layer with task breakdown, delegation, and `--parallel` / `--validate` flags.
- `/recommend <goal>` — given a fuzzy ask, recommend the right clanker command and explain why.
- `/reflect` (rewritten) — task validation with semantic symbol-level verification.

**New skills (5):**
- `persona-auto-activation` — shift specialist mindsets based on task context without waiting for explicit `/agent` invocation.
- `wave-orchestration` — layered multi-agent coordination: plan → build → verify, with consolidation between waves.
- `ultracompressed-mode` — how Claude responds when `--uc` flag is present.
- `command-flags-spec` — uniform semantics for `--strategy`, `--depth`, `--parallel`, `--validate`, `--uc`.
- `serena-semantic-editing` — when to reach for Serena MCP vs built-in Read/Edit.

**Framework capabilities:**
- **Global flags on every command**: `--strategy systematic|agile|enterprise`, `--depth shallow|normal|deep`, `--parallel`, `--validate`, `--uc`. Flags compose.
- **Serena as conditional default MCP**: if `uv` is detected during `init`, Serena auto-configures in `.mcp.json`. Otherwise, users get a printed hint about how to enable it.
- **Explicit MCP routing in every command** — each command now documents which MCPs it uses and why.
- **Wave orchestration pattern** for structured multi-agent work.
- **Updated `/load`, `/save`, `/analyze`** to leverage Serena for semantic context hydration and symbol-level accuracy.

---

## [0.1.0] — 2026-04-18

Initial public release.

### Added

- CLI with three subcommands: `init`, `update`, `mcp-help`.
- `init` with framework detection (Next.js, React, Node API, Python API, Rust, Go, generic) and stack-tailored CLAUDE.md.
- 4 default local-first MCPs: sequential-thinking, context7, memory, playwright.
- 14-MCP curated registry for `mcp-help` discovery.
- 45 skills across workflow, quality, tool-use, git, framework, meta.
- 20 agents (12 personas + 8 coding) with explicit tool/skill/MCP wiring.
- 24 slash commands.
- 10 safety hooks (7 active + 3 opt-in) with global and per-hook kill switches.
- `specs/` scaffolding for spec-first workflow.
- 3-way interactive merge for `clanker update`.
- Shell-injection hardening across all hook scripts.
