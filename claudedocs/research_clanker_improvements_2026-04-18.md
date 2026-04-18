# Clanker-Code Improvement Research — 2026-04-18

**Research target:** identify high-ROI additions for `clanker-code` v0.3+ based on the current Claude Code ecosystem, grounded in Anthropic's official best-practices page, canonical awesome-lists, SuperClaude, claude-flow, ccusage, peterkrueck's Development Kit, disler's hooks-mastery, and direct inspection of `clanker-code` at `github.com/UmayerK/clanker-code`.

---

## Executive Summary (Top 7 Highest-Value Additions)

1. **Statusline integration shipped by default** (`npx ccusage statusline` or a small built-in JS statusline). Anthropic now explicitly recommends a custom statusline for context-window visibility. Cost: ~0 startup tokens (rendered by CLI, not the conversation). Sources: https://code.claude.com/docs/en/best-practices, https://github.com/ryoppippi/ccusage.

2. **A local-first codebase-graph MCP option in the registry** — `code-graph-mcp`, `code-review-graph`, or `codegraph`. 6.8–49× token savings on repo-wide reviews, zero signup, local only. Natural companion to Serena. Sources: https://github.com/sdsrss/code-graph-mcp, https://github.com/tirth8205/code-review-graph.

3. **Plan-Mode idiom (`/plan` skill + references in `/implement`/`/vibe`).** Anthropic's canonical workflow is Explore → Plan → Implement → Commit. Clanker leaps to code. A 10–20 line skill fixes this.

4. **`SessionStart(compact)` context re-injection hook.** Anthropic flags this exact pattern. Re-inject branch + recent commits + spec list + CLAUDE.md one-liner whenever compaction fires.

5. **`PreCompact`/`SessionEnd` transcript-backup hook (opt-in).** Most-duplicated creative hook in the ecosystem. ~30 lines of Node.

6. **`PermissionRequest(ExitPlanMode)` auto-approve (opt-in).** The single safest, highest-ergonomic auto-approve — documented by Anthropic as the canonical example.

7. **Explicit `@import` in CLAUDE.md templates.** Anthropic documents `@path/to/file` as first-class; most starter kits still inline everything. Wiring `@specs/01-stack.md` and `@specs/02-standards.md` keeps root CLAUDE.md under 60 lines and **net-reduces** token usage.

---

## Ecosystem Landscape

| Repo | Scale | What it contributes | What it does NOT have |
|---|---|---|---|
| anthropics/claude-code docs (code.claude.com/docs) | Official | Canonical best-practices, 26 hook events, `@import`, Plan Mode, auto-mode, checkpointing, statusline recommendation | Not a starter kit; no opinionated defaults |
| SuperClaude-Org/SuperClaude_Framework | Large (Python) | 30 commands, 20 agents, 7 behavioral modes, ReflexionMemory error learning, AIRIS MCP gateway, PM Agent arch, `sc:research` | Python footprint; no Node CLI; no npm workflow |
| ruvnet/claude-flow (ruflo) | Very large | Swarm orchestration, 64 agents, hive-mind coordination, stream-JSON chaining, 87 MCP tools | Heavy; enterprise-oriented; not a clean starter kit |
| rohitg00/awesome-claude-code-toolkit | Large aggregator | 135 agents, 35 skills, 42 commands, 176+ plugins, 20 hook patterns | Aggregator — not installable as a unit |
| hesreallyhim/awesome-claude-code | Large list | Curated categorical index (hooks, skills, commands, statuslines) | Pure list |
| peterkrueck/Claude-Code-Development-Kit | Mid | 4-file doc layout (spec.md, project-structure.md, progress.md, deployment-infrastructure.md); `/prime`, `/update-docs`, `/review-work`, `/second-opinion` (Gemini); audio notifications; shell installer | Shell-only (Linux/macOS); no Node; no framework detection |
| abhishekray07/claude-md-templates | Mid | 3-level CLAUDE.md hierarchy (global/project/local); <80-line discipline | Templates only, no automation |
| disler/claude-code-hooks-mastery | Mid | 13 hook-event examples including PreCompact backup, SessionStart context, PostToolUseFailure logging, TTS feedback | Python-heavy; demo, not a kit |
| ryoppippi/ccusage | Large | `npx ccusage statusline` for token/cost tracking; reads local JSONL; offline pricing cache | Single tool, not a framework |
| anthropics/claude-plugins-official | Official | Plugin marketplace accessible via `/plugin`; bundled Anthropic plugins (PR review, commit workflows, Agent SDK tools) | Doesn't replace a starter kit |
| johnlindquist/claude-hooks | Small-mid | Strongly-typed TypeScript hook payloads | TS-only ecosystem |
| sdsrss/code-graph-mcp | Small-mid | AST knowledge graph, 10 languages, HTTP route tracing, impact analysis, semantic search | Newer, less battle-tested |
| tirth8205/code-review-graph | Small-mid | Tree-sitter AST + SQLite graph + MCP tools, claims 6.8–49× token reduction | Review-centric, narrower |

---

## Prioritized Recommendations

### Tier A — Do these next (value/token ratio: very high)

**A1. Ship a default statusline**
- What: Add `statusLine` setting in the generated `settings.json` that invokes `npx ccusage statusline` (or a small built-in JS script). Document "ccusage" and "none" options in `clanker init`.
- Why: Anthropic's best-practices explicitly call out a statusline for continuous context tracking. Users who can't see context burn don't manage it.
- Startup token cost: ~0 (CLI, not in-context).
- Value/token: **High.**
- Complexity: Small — one settings entry + install-time check.

**A2. Add a codebase-graph MCP to the registry (non-default)**
- What: Register one of `code-graph-mcp`, `code-review-graph`, or `codegraph` in `mcp-help`. Do NOT default-install. Recommend in README alongside Serena.
- Why: Claimed 6.8–49× token reductions on repo-wide review/navigation tasks. No signup, local SQLite.
- Startup token cost: 0 (optional).
- Value/token: **High.**
- Complexity: Small (registry JSON entry + doc line).

**A3. `SessionStart(compact)` context re-inject hook**
- What: `context-reinject.js` on `SessionStart` with matcher `compact`. Output: branch, recent commits (`git log --oneline -5`), open spec files, CLAUDE.md one-liner. Kill switch via `CLANKER_HOOK_CONTEXT_REINJECT=off`.
- Why: After auto-compaction Claude forgets local rules and recent work.
- Startup token cost: ~200–400 tokens, but only when compaction happens (not every session).
- Value/token: **High.**
- Complexity: Small (~50 lines in the style of `git-context.js`).

**A4. Teach CLAUDE.md templates to use `@import`**
- What: All 5 CLAUDE.md templates shift to imports: `See @specs/00-product.md, @specs/01-stack.md, @specs/02-standards.md.` Keep root CLAUDE.md under 60 lines.
- Why: Anthropic: *"Bloated CLAUDE.md files cause Claude to ignore your actual instructions."* `@import` lazy-loads on demand.
- Startup token cost: **Saves** ~300–1,500 tokens on sessions that don't need the imported files.
- Value/token: **High (net negative).**
- Complexity: Small (template edits).

**A5. `/plan` skill (Plan Mode idiom)**
- What: Tiny skill that teaches Claude to use Plan Mode explicitly: "When `/plan <task>` fires, enter Plan Mode, read relevant files, produce a phased plan, stop." `/implement` and `/vibe` can reference the plan file.
- Why: Anthropic's canonical loop. Clanker currently leaps to code.
- Startup token cost: ~50–100 tokens.
- Value/token: **High.**
- Complexity: Small.

---

### Tier B — High value, slightly more work

**B1. `PreCompact` transcript-backup hook (opt-in)**
- What: On `PreCompact`, dump recent messages to `.claude/transcripts/YYYY-MM-DD-HHMM.jsonl`.
- Why: Compaction loses detail. Most-copied "creative" hook in the wild.
- Startup token cost: 0.
- Complexity: Small.

**B2. `PermissionRequest(ExitPlanMode)` auto-approve (opt-in)**
- What: Narrow matcher that auto-allows *only* the `ExitPlanMode` permission dialog.
- Why: Anthropic's canonical safe auto-approve example. Eliminates the most annoying prompt without loosening real security.
- Startup token cost: 0.
- Complexity: Small.

**B3. `FileChanged`/`CwdChanged` direnv-reload hook (opt-in)**
- What: When `.env`/`.envrc` changes or cwd changes, append `direnv export bash` to `$CLAUDE_ENV_FILE`.
- Why: Monorepo + env-var-heavy backends hit this daily.
- Startup token cost: 0.
- Complexity: Small.

**B4. `clanker doctor` subcommand**
- What: Checks Node version, CLI tools (`gh`, `jq`, `uv`), MCP server reachability, hook script executability, `settings.json` validity, env vars. Prints green/yellow/red.
- Why: Installability is trust. peterkrueck has a minimal version; a clean `doctor` differentiates.
- Startup token cost: 0 (CLI).
- Complexity: Medium.

**B5. `clanker mcp-add <name>` wrapper**
- What: Thin CLI that runs `claude mcp add` with args from the 14-MCP registry.
- Why: Matches the clanker "curated wrapper" ethos.
- Startup token cost: 0.
- Complexity: Small-Medium.

**B6. Writer/Reviewer pattern in `/review`**
- What: Teach `/review` to spawn a clean subagent (fresh context) rather than self-reviewing.
- Why: Anthropic docs + industry experience: separate context catches ~2× more bugs than self-review.
- Startup token cost: ~100 tokens in the command file.
- Complexity: Small.

**B7. `verification-first.md` meta-skill**
- What: Reminds Claude to ask for or produce verification criteria (tests, screenshots, expected outputs) before coding.
- Why: Anthropic calls this "the single highest-leverage thing you can do."
- Startup token cost: ~150 tokens if in CLAUDE.md, 0 if lazy-loaded as skill.
- Complexity: Small.

---

### Tier C — Nice but lower priority

**C1. Elicitation hook logger** — logs every MCP elicitation to `.claude/elicitations.jsonl`. Audit-friendly; teams only.

**C2. `StopFailure` hook for rate-limit telemetry** — log runs ending in rate limit for cost-of-truncation analysis.

**C3. Writer/Reviewer dual-agent recipe in README** — pure docs, zero code. Chain `backend-builder` → `reviewer` across sessions.

**C4. Second-opinion skill (Gemini/OpenAI CLI optional)** — peterkrueck's idea, adapted as conditional skill that only activates if `gemini` or similar is on PATH.

**C5. Document `type: "prompt"` and `type: "agent"` hooks** — new Anthropic feature; one example each so users know it exists.

**C6. `AGENTS.md` alias** — some ecosystems read `AGENTS.md`; emit a symlink or stub for portability.

---

## What Clanker Already Does Better Than Most Competitors

1. **Node-native, npm-distributed.** `npx clanker init` is smoother first-contact than any competitor.
2. **3-way merge updates.** SuperClaude and peterkrueck overwrite; clanker respects user edits.
3. **Stack-tailored CLAUDE.md templates (5).** Most kits ship one.
4. **Conditional Serena via `uv` detection.** Graceful degradation is rare; most kits fail loudly.
5. **Per-hook kill switches.** `CLANKER_HOOK_<NAME>=off` is cleaner than "edit settings.json."
6. **Balanced token budget (~17–19K).** SuperClaude 35K+; claude-flow much more. Clanker is the best-calibrated in its bracket.
7. **Spec-first workflow with templated `specs/`.** One of the cleanest layouts in the ecosystem.
8. **Six-category skill taxonomy.** Most kits use one flat folder.

---

## Things to Explicitly NOT Add

1. **Swarm / multi-agent orchestrator on the scale of claude-flow.** Would blow the token budget and kill "starter kit" positioning.
2. **TTS / audio-feedback by default.** Novelty, not value. OK as opt-in hook.
3. **Own cost dashboard web UI.** ccusage already does this; recommend it, don't rewrite it.
4. **Cloud-synced session memory / ReflexionMemory equivalent.** No evidence it helps in practice; adds non-trivial state.
5. **A `/everything` super-command.** `/vibe` is already the furthest this should go.
6. **Own plugin marketplace.** Anthropic runs the official one; feed into it.
7. **135-agent catalogs.** Agents proliferate, dilute Claude's selection. Keep the 20; add agents only for demonstrable gaps.
8. **Heavy Python dependencies.** Pure-Node is a moat.
9. **Britfix-style gimmick hooks.**

---

## Open Questions

1. Exact startup token cost of awesome-claude-code-toolkit at full install.
2. Whether `claude --permission-mode auto` is stable enough to recommend by default.
3. Real-world efficacy of prompt/agent hooks (`type: "prompt"`, `type: "agent"`).
4. SuperClaude v4.1 TypeScript plugin system — positioning impact.
5. Whether Anthropic's official plugins will include a "starter-kit"-shaped plugin.
6. code-graph-mcp vs code-review-graph vs codegraph — no independent benchmark at scale.
7. `ConfigChange` hook adoption — documented but not widely shipped.

---

## Sources

- Anthropic Claude Code Best Practices: https://code.claude.com/docs/en/best-practices
- Anthropic Hooks Guide: https://code.claude.com/docs/en/hooks-guide
- SuperClaude Framework: https://github.com/SuperClaude-Org/SuperClaude_Framework
- claude-flow / ruflo: https://github.com/ruvnet/claude-flow
- awesome-claude-code (hesreallyhim): https://github.com/hesreallyhim/awesome-claude-code
- awesome-claude-code-toolkit (rohitg00): https://github.com/rohitg00/awesome-claude-code-toolkit
- Claude-Code-Development-Kit (peterkrueck): https://github.com/peterkrueck/Claude-Code-Development-Kit
- claude-md-templates (abhishekray07): https://github.com/abhishekray07/claude-md-templates
- claude-code-hooks-mastery (disler): https://github.com/disler/claude-code-hooks-mastery
- ccusage (ryoppippi): https://github.com/ryoppippi/ccusage
- code-graph-mcp: https://github.com/sdsrss/code-graph-mcp
- code-review-graph: https://github.com/tirth8205/code-review-graph
- codegraph: https://github.com/colbymchenry/codegraph
- claude-plugins-official: https://github.com/anthropics/claude-plugins-official
- claude-hooks (johnlindquist): https://github.com/johnlindquist/claude-hooks
