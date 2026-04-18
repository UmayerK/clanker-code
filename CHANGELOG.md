# Changelog

All notable changes to `clanker-code` are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/spec/v2.0.0.html).

## [0.5.0] — 2026-04-18

Grade A ecosystem adoptions. 11 high-value additions from the deep-dive research round, prioritized for value/token ratio.

### Added

**New agents (2):**
- `code-explorer` — deep-dives an existing feature read-only: entry points, execution flow, key components, extension points. Fills a real gap `/analyze` didn't cover.
- `code-architect` — designs 3 parallel implementation approaches (minimal / clean / pragmatic). User picks one before `/feat` moves to implementation.

**New command (1):**
- `/revise-claude-md` — audits CLAUDE.md against current repo state; optionally captures session learnings back into it. Proposes diffs, never silently edits. Source: Anthropic claude-md-management plugin.

**New skills (4, lazy-loaded — zero startup cost):**
- `meta/claude-md-improver.md` — prevent CLAUDE.md rot; power `/revise-claude-md`.
- `workflow/tdd.md` — multi-agent RED/GREEN/REFACTOR with separate subagents per phase.
- `quality/api-design-reviewer.md` — REST API linting + breaking-change detection. Source: alirezarezvani/claude-skills.
- `quality/dependency-auditor.md` — license compliance, CVE scan, upgrade planning.

**Enhanced commands:**
- `/reflect` — added confidence scoring (0–100, filter ≥ 80), `--parallel` for three-lens review, `--threshold N` flag. Added incremental-notes pattern. Source: Anthropic code-review plugin.
- `/feat` — full 8-phase workflow with 3 parallel `code-architect` proposals (minimal/clean/pragmatic), `/code-explorer` Phase 2, parallel reviewers in Phase 6, incremental-notes. Source: Anthropic feature-dev plugin.
- `/analyze` — added incremental-notes pattern for long audits.

**MCP registry:**
- Added `codesight-mcp` (non-default) — 66 languages, 34 tools, hardened tree-sitter AST retrieval, claims ~99% token reduction. Source: cmillstead.

**README — complementary Anthropic plugins:**
- Recommends `hookify`, `pr-review-toolkit`, `claude-md-management`, `ralph-loop`, `skill-creator`, `mcp-server-dev` via `/plugin install` — offloads long-tail needs to Anthropic's maintained plugins rather than replicating.

**Init-time LSP recommendation:**
- After stack detection, `clanker init` prints the matching Anthropic LSP plugin (`typescript-lsp`, `pyright-lsp`, `rust-analyzer-lsp`, etc.). Zero token cost, pure documentation win.

### Changed

- **Agents:** 20 → 22 (added `code-explorer`, `code-architect`).
- **Skills:** 42 → 46 (added 4 new).
- **Commands:** 25 → 26 (added `/revise-claude-md`).
- **MCP registry:** 16 → 17.
- **Startup token budget:** ~18–20K (from ~17–19K — added ~900 tokens of new agents + command + enhancements, all under budget).

### Notes

- `/reflect --threshold 80` default comes from Anthropic's code-review plugin. Lower for noisier output, raise for only-the-certain.
- Incremental audit notes pattern (from MDD/TheDecipherist) is near-free and solves the #1 long-run failure mode: compaction mid-audit.
- `claude-md-improver` skill pairs with v0.4's `@import` CLAUDE.md pattern for a full "keep CLAUDE.md clean and current" story.

---

## [0.4.0] — 2026-04-18

Ecosystem parity pass. Ported the highest-value patterns from across the Claude Code ecosystem (Anthropic official docs, ccusage, disler hooks-mastery, peterkrueck dev kit, code-graph-mcp) into clanker-code's install layer — **net-zero or net-negative startup token cost**.

### Added

- **Default statusline** (`statusLine` in `settings.json`) — invokes `npx -y ccusage statusline` for live context/cost tracking. Zero startup tokens (rendered by the CLI, not the conversation). Anthropic's recommended pattern.
- **`/plan` skill (plan-mode.md)** — teaches Claude to enter Plan Mode on `/plan <task>` for Anthropic's canonical Explore → Plan → Implement → Commit loop. ~100 tokens, lazy-loaded.
- **SessionStart(compact) context re-inject hook** (`context-reinject.js`) — active by default. After auto-compaction, re-injects branch, last 5 commits, active specs list, and CLAUDE.md top-line. Only fires on compaction — zero cost on fresh sessions.
- **PreCompact transcript-backup hook** (`transcript-backup.js`) — opt-in. Dumps pre-compact transcript to `.claude/transcripts/*.jsonl` for detail recovery.
- **ExitPlanMode auto-approve hook** (`exit-plan-autoapprove.js`) — opt-in. Anthropic's canonical narrow auto-approve pattern — bypasses *only* the Plan Mode exit prompt.
- **Code Graph MCPs in registry** (non-default): `code-graph-mcp` and `code-review-graph`. Both claim 6.8–49× token reductions on repo-wide review. Install via `clanker mcp-help add code-graph-mcp`.
- **`@import` in all 5 CLAUDE.md templates** — lazy-loads `specs/00-product.md`, `specs/01-stack.md`, `specs/02-standards.md` on demand. Net-saves 300–1,500 tokens per session on projects that don't need imported detail loaded.

### Changed

- **Hooks:** 10 → 13 (8 active + 5 opt-in).
- **Skills:** 41 → 42 (added `plan-mode`).
- **MCP registry:** 14 → 16 (added 2 code-graph MCPs; non-default).
- **Token budget:** still ~17–19K startup; new hooks and skill are either zero-startup or lazy-loaded. `@import` makes the net trend downward.

### Notes

- `ccusage` is called via `npx -y`, which self-installs on first use. If users decline, the statusline gracefully disappears.
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
- 6 meta skills collapsed into their command bodies: `brainstorm-socratic`, `estimate-conservatively`, `research-depth`, `explain-educationally`, `analyze-systematically`, `document-patterns`. Same guidance, now where it's actually loaded.
- 3 investigation skills consolidated into `systematic-investigation`: `debug-systematically`, `performance-investigation`, `security-audit-approach`.
- `architecture-decisions` skill — already covered by `/design` and the `architect` agent.

### Changed

- **Commands:** 28 → 25 (removed 4: `/task`, `/spawn`, `/setup`, `/index-repo`; added 1: `/vibe`).
- **Skills:** 50 → 41.
- **Agents:** 20 → 20 (unchanged — persona agents preserved per user preference).
- **Startup token budget:** ~22–24K → ~17–19K. Back under the original 0.1 target.

### Notes

- Persona agent duplication with Claude Code built-ins was flagged again but deliberately kept per user preference; users who want the trim can delete `.claude/agents/personas/` locally.
- All removed commands had direct replacements — no capability regression.

---


## [0.2.0] — 2026-04-18

Parity pass with SuperClaude's coding-relevant features.

### Added

**Commands (5 new):**
- `/index-repo` — compress the repository into a minimal (<3K token) knowledge brief, with `--depth shallow|normal|deep`.
- `/select-tool <task>` — classify task complexity and explicitly pick the right MCP / built-in tool before acting.
- `/pm <goal>` — default orchestration layer with task breakdown, delegation, and `--parallel` / `--validate` flags.
- `/recommend <goal>` — given a fuzzy ask, recommend the right clanker command and explain why.
- `/reflect` (rewritten) — task validation with Serena-aware symbol-level verification.

**Skills (5 new):**
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

**CLI:**
- `lib/detect.js` exports `detectToolchain()` with `uv`, `python`, `git`, `docker` detection.
- `init` auto-adds conditional-default MCPs when toolchain satisfies requirements.

### Changed

- CLAUDE.md templates (all 5 stacks) now reference the new framework capabilities (persona auto-activation, global flags, wave orchestration, Serena) and the 5 new commands.
- Startup token budget revised: ~22–24K (from ~18–20K). Acknowledged at ceiling; no further content accepted without cutting something.

### Notes

- **Auto-activating personas and wave orchestration are prompt patterns**, not runtime enforcement. They work the same way SuperClaude implements them: instructions in CLAUDE.md + skills that Claude reads and follows. No runtime shim.
- `clanker-code` remains a standalone install — it does **not** depend on or install SuperClaude.
- Serena still requires `uv` (Python). Users without `uv` get the full kit minus Serena, plus a hint on how to add it.

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
- 24 slash commands (21 SuperClaude-parity + 3 clanker-native).
- 10 safety hooks (7 active + 3 opt-in) with global and per-hook kill switches.
- `specs/` scaffolding for spec-first workflow.
- 3-way interactive merge for `clanker update`.
- 35 passing tests; zero `npm audit` vulnerabilities.
- Shell-injection hardening across all hook scripts.
