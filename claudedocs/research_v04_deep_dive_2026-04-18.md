# Clanker-Code v0.4 Deep-Dive Research — 2026-04-18

**Purpose:** Follow-up to `research_clanker_improvements_2026-04-18.md`. Goes deeper into disler/hooks-mastery, peterkrueck/Dev-Kit, SuperClaude v4.x, Anthropic's official plugin marketplace, emerging 2026 patterns, high-quality skill/agent markdown from top community repos, and MCPs not yet in clanker's 14-MCP registry.

**Known-current state of clanker** (do not re-recommend):
- 10 hooks already shipped: destructive-bash-guard, secret-leak-guard, gitignore-warn, auto-format, spec-awareness, git-context, stop-notify, session-log, typecheck-bg, pkg-install-offer
- 21 `/sc:` commands parity-shipped; 5 SuperClaude framework features absorbed
- 14-MCP registry
- Already covered in v0.3 report: statusline, code-graph-mcp mention, `/plan` skill, `SessionStart(compact)` re-inject, `PreCompact` transcript backup, `ExitPlanMode` auto-approve, `@import` CLAUDE.md, `clanker doctor`, writer/reviewer in `/review`, verification-first meta-skill

---

## Section 1 — disler/claude-code-hooks-mastery full inventory

Disler ships **13 hook examples plus 2 Python validators**. Mapped against clanker's current 10-hook set:

| # | Hook | Event | Matcher | One-liner | Already in clanker? |
|---|---|---|---|---|---|
| 1 | user_prompt_submit | UserPromptSubmit | all | Validates/logs user prompts before Claude sees them | No |
| 2 | pre_tool_use | PreToolUse | Bash+Read+Edit+Write | Blocks rm -rf and `.env` access | Yes (destructive-bash-guard + secret-leak-guard) |
| 3 | post_tool_use | PostToolUse | all | Logs results; JSONL→readable-JSON conversion | Partial (session-log) |
| 4 | post_tool_use_failure | PostToolUseFailure | all | Structured error logs with timestamps + tool context | **No — NET-NEW** |
| 5 | notification | Notification | all | Logs async Claude notifications (optional TTS) | Partial (stop-notify covers Stop only) |
| 6 | stop | Stop | all | AI-powered completion summary + TTS | Partial (stop-notify) |
| 7 | subagent_stop | SubagentStop | all | Announces subagent completion | **No — NET-NEW** |
| 8 | subagent_start | SubagentStart | all | Logs subagent initialization | **No — NET-NEW** |
| 9 | pre_compact | PreCompact | all | Transcript backup before compaction | No — covered in v0.3 report as B1 |
| 10 | session_start | SessionStart | all | Loads dev context (git status, issues, rules) | Yes (git-context + spec-awareness) |
| 11 | session_end | SessionEnd | all | Logs session data + cleanup | Partial (session-log) |
| 12 | permission_request | PermissionRequest | all | Auto-allows read-only operations | No — covered in v0.3 report as B2 |
| 13 | setup | Setup | all | Environment init / context maintenance | No — low value, niche |
| 14 | ruff_validator | PostToolUse | Write+Edit on .py | Enforces Ruff lint | Out of scope (Python-only) |
| 15 | ty_validator | PostToolUse | Write+Edit on .py | Validates Python type annotations | Out of scope |

Source: [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)

### Net-new findings from disler — worth evaluating for v0.4

**F1. PostToolUseFailure structured error logger** — Writes `{timestamp, tool, args, error, cwd}` to `.claude/errors.jsonl` only when a tool fails. Clanker's `session-log` logs everything, which is noisier and harder to grep.
- Event: `PostToolUse` with JSON matcher on `tool_response.is_error == true`
- Approx. code: **30–40 lines** in existing session-log style
- Startup token cost: 0 (runtime only)
- Complexity: **S**
- Quality: **B** — clean separation of failure telemetry from general session log is useful for debugging why a run went sideways. Low risk.
- Why clanker benefits: 1-hour debugging sessions get a focused `errors.jsonl` instead of sifting the whole session log. Kill-switchable.

**F2. SubagentStart + SubagentStop hooks** — Announce/log when any subagent spawns and completes. This is how multi-agent workflows (already in `/spawn`, `/sc:spawn`, `/review`) become debuggable.
- Event: `SubagentStart` and `SubagentStop`
- Approx. code: **~40 lines combined**, writes to `.claude/subagents.jsonl`
- Startup token cost: 0
- Complexity: **S**
- Quality: **B** — clanker already ships multi-agent commands; subagent observability is the missing telemetry piece. With `/spawn` doing worktree-isolated parallel agents, knowing "which subagent produced which file change" is meaningful.
- Why clanker benefits: Debug and reason about `/spawn` outcomes without scrolling through noise.

**F3. Notification hook (non-Stop)** — Stop-notify only fires at end-of-turn. Disler's Notification hook captures the broader set (permission prompts, idle prompts, errors) that Claude Code fires mid-session.
- Event: `Notification`
- Approx. code: **~25 lines**
- Startup token cost: 0
- Complexity: **S**
- Quality: **C** — overlaps with stop-notify enough that adding a second notification hook creates a "which one fires?" confusion. **Mention-only.**

**Grade summary:** F1 and F2 are the two additions worth shipping in v0.4. F3 is noise.

---

## Section 2 — peterkrueck/Claude-Code-Development-Kit commands

Full command set from [peterkrueck/Claude-Code-Development-Kit](https://github.com/peterkrueck/Claude-Code-Development-Kit):

| Command | What it does | Pattern | Port to clanker? |
|---|---|---|---|
| `/prime` | Loads project docs into context at session start | Context injection via 4-doc scaffolding | **Superseded** — clanker already ships `@import` pattern + `git-context` + `spec-awareness` hooks. `/prime` is the manual version of what clanker automates. Skip. |
| `/update-docs` | Keeps docs synchronized after code changes | Event-based sync following code mods | **Worth porting, lean version.** |
| `/review-work` | Spawns parallel sub-agents to review uncommitted diff | Bug Hunter + Rules Auditor parallel | **Partially already in** clanker's `/review`. v0.3 B6 covers the "fresh context subagent" fix. |
| `/second-opinion` | Consults Gemini CLI for architecture decisions | Cross-AI consultation | **C — niche, conditional skill.** Only useful when `gemini` is on PATH. |
| `/image-gen`, `/image-edit`, `/bg-remove` | Visual tools via Gemini/Pillow/rembg | External CLI wrappers | **Skip** — out of clanker's starter-kit scope. |
| `/deploy` | Customizable deployment pipeline template | User-configurable multi-stage | **Already shipped** (`/deploy` is one of the 12 clanker commands). |

### F4. `/update-docs` command (worth porting — lean version)

peterkrueck's pattern: after a feature is implemented, trigger an update pass across the 4 canonical doc files (spec.md, project-structure.md, progress.md, deployment-infrastructure.md). Clanker's spec structure (`specs/10-feature-*.md`) has a different shape, but the core idea — "after implement, before commit, update the docs that changed" — is portable.

- Implementation: a 40-line slash command in `commands/update-docs.md`
- Behavior: git-diff the last commit range, detect which spec files reference changed modules, propose diff-sized spec updates
- Alternative: wire it into `/feat` as a post-implement step rather than a standalone command
- Approx. tokens added: **~150 tokens** (command file)
- Complexity: **S–M**
- Quality: **B** — solves a real problem (stale specs). Could be an auto-trigger on a `PostToolUse(Edit)` hook rather than a manual command, but manual-first is safer.
- Why clanker benefits: closes the "spec drift" gap that's the #1 reason long-running projects abandon spec-first workflows.

### F5. Audio-feedback hook (peterkrueck `notify.sh`)

peterkrueck ships macOS/Linux desktop audio notifications on Stop. Clanker's `stop-notify` already covers this — **already shipped.**

### F6. Three-stop escalation nudge (peterkrueck `review-on-stop.sh`)

Novel pattern: an advisory hook that nudges the user to `/review` on the 1st Stop, stronger on the 2nd, and blocks on the 3rd until `/review` is run. Clever anti-procrastination.

- Complexity: **M**
- Quality: **C** — opinionated; could feel like nagging. Worth noting but not shipping by default.

---

## Section 3 — SuperClaude v4.x latest 2026 additions

Sources: [SuperClaude CHANGELOG.md](https://github.com/SuperClaude-Org/SuperClaude_Framework/blob/master/CHANGELOG.md), [agents.md](https://github.com/SuperClaude-Org/SuperClaude_Framework/blob/master/docs/user-guide/agents.md)

### Timeline of 2026 SuperClaude additions

- **v4.1.9 (2026-01-15):** Tavily MCP, Chrome DevTools MCP, 30 slash commands re-packaged
- **v4.2.0 (2026-01-18):** AIRIS MCP Gateway (60+ tools unified behind single localhost:9400 SSE endpoint with 98% token reduction via HOT/COLD tool management); Airis Agent + MindBase MCP servers
- **v4.3.0 (2026-03-22):** 20 agent files deployed to `~/.claude/agents/`; SHA-256 integrity verification for downloads; ReflexionMemory replaces Mindbase

### Does clanker port any of these?

**F7. ReflexionMemory (SuperClaude)** — self-improvement memory for learning from mistakes across sessions. Uses `ReflexionPattern mindbase HTTP API`.
- Approx. startup tokens: **~600–1200** (always-loaded rule file)
- Complexity: **L**
- Quality: **C** — cloud-dependent (Mindbase HTTP API) and v0.3 already flagged "no evidence it helps in practice; adds non-trivial state." **Confirmed C.** Explicit skip.

**F8. AIRIS MCP Gateway (SuperClaude v4.2)** — unified SSE endpoint bundling 60+ tools with HOT/COLD tool management (98% token reduction).
- Concept: instead of registering 14 separate MCPs, register one gateway that does on-demand tool hydration
- Quality: **B** — if Anthropic's Tool Search is already 95% token reduction per their docs, AIRIS is a 2025-era solution to a problem partially solved in 2026. **Mention in README alongside Tool Search**, don't default.
- Why mention: sophisticated users on 20+ MCP setups will find it. Don't ship it as a dep — just document the pattern.

**F9. PM Agent (SuperClaude)** — meta-layer agent that "documents implementations, analyzes mistakes, maintains knowledge base continuously."
- Approx. tokens if shipped as agent: **~300–500 tokens**
- Quality: **B** — novel pattern. Runs after specialist agents finish; writes notes to `.claude/learnings.md`. Fits clanker's spec-first philosophy because it auto-closes the doc-drift loop.
- But clanker already has F4 (`/update-docs`) and `/save` session-lifecycle equivalents. **Don't add as a separate agent**; bake the "capture-learnings" step into `/save` and `/feat` completion.

**F10. Deep Research Agent (SuperClaude)** — "comprehensive research with adaptive strategies and multi-hop reasoning." Clanker's `sc:research` already exists as a command. A dedicated agent file (vs. a command) is a structural choice.
- Quality: **C — already covered** via `sc:research`.

### What's NOT in SuperClaude that matters

No behavioral modes were added in 2026 beyond the original 7 (Brainstorming, Business Panel, Deep Research, Orchestration, Token-Efficiency, Task Management, Introspection). Clanker is not missing a "behavioral modes" gap.

---

## Section 4 — Anthropic's official plugin marketplace

Full listing of 33 plugins at [anthropics/claude-plugins-official/plugins](https://github.com/anthropics/claude-plugins-official/tree/main/plugins). Grouped by relevance to clanker:

### Directly relevant (developer workflow)

**F11. `hookify` plugin (Anthropic)** — create custom hooks from natural language. Two modes: `/hookify "don't use console.log in TS files"` creates a rule; `/hookify` with no args analyzes recent conversation for behaviors you've corrected and proposes rules. Rules are markdown with YAML frontmatter (`.claude/hookify.*.local.md`).
- Source: [hookify README](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/hookify/README.md)
- Approx. tokens if shipped: **0 at startup** (loads on demand via `/hookify`)
- Complexity to emulate: **L** (non-trivial to build; Anthropic already maintains it)
- Quality: **A — DO NOT REPLICATE. RECOMMEND IN README.** Tell clanker users "for ad-hoc hooks, install `/plugin install hookify@anthropic-official`." This is the 80/20 answer for "I want a rule about X behavior."
- Why clanker benefits: offloads the long tail of per-user hook needs to Anthropic's plugin without inflating clanker's shipped hook count.

**F12. `pr-review-toolkit` plugin (Anthropic)** — comprehensive PR-review agents specializing in comments, tests, error handling, type design, code quality, code simplification. Author: Anthropic support.
- Quality: **B — RECOMMEND, DO NOT REPLICATE.** Clanker's `/review` is generalist; pr-review-toolkit is a specialist suite. README line: "For deep PR reviews, install `pr-review-toolkit@anthropic-official`."
- Note: pr-review-toolkit's internal pattern (multiple parallel specialists with confidence scoring) is the pattern clanker's `/review` should absorb in v0.3 B6.

**F13. `code-review` plugin (Anthropic)** — /code-review launches 4 parallel agents (2× CLAUDE.md compliance, 1× bug detection, 1× git-blame historical context), scores each issue 0–100, filters <80 confidence, posts only high-confidence findings.
- **Confidence-scoring pattern is directly portable to clanker's `/review`.**
- Quality: **A — PORT THE PATTERN.** Add confidence-filtering (>80 threshold) to clanker's `/review`. No new command needed; upgrade existing.
- Approx. tokens added to `/review.md`: **~100 tokens**
- Complexity: **S**
- Why clanker benefits: single biggest complaint about automated review is noise. Confidence gate solves it.

**F14. `feature-dev` plugin (Anthropic)** — 7-phase workflow (Discovery → Codebase Exploration with 2-3 parallel `code-explorer` agents → Clarifying Questions → Architecture Design with 2-3 parallel `code-architect` agents presenting 3 approaches (minimal/clean/pragmatic) → Implementation → Quality Review with 3 parallel `code-reviewer` agents → Summary).
- Maps onto clanker's `/feat` nearly 1:1 but more opinionated on phasing and parallel-agent use.
- Quality: **A — PORT TWO PATTERNS.** (1) `code-architect` with 3 parallel approaches (minimal/clean/pragmatic) and user picks — this is genuinely novel and worth adding to `/feat`. (2) 3 parallel reviewers with distinct lenses (simplicity/DRY, bugs/correctness, conventions) at the end.
- Approx. tokens added to `/feat.md`: **~200 tokens**
- Complexity: **M**
- Why clanker benefits: turns `/feat` from "let me implement" to "let me show you three approaches and pick one." Huge quality lift.

**F15. `ralph-loop` plugin (Anthropic)** — self-referential iteration loop via Stop hook. `/ralph-loop "<prompt>" --completion-promise "COMPLETE" --max-iterations 50`. The Stop hook re-injects the prompt; Claude sees its modified files/git history and iterates. Stops when Claude outputs `COMPLETE`.
- Source: [ralph-loop README](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/ralph-loop/README.md)
- Quality: **B — OPT-IN SKILL/COMMAND.** Highly useful for greenfield with clear verification criteria (exactly the clanker use case). But dangerous if looped with unclear success criteria — can burn tokens.
- Approx. tokens: **~80** for command file + Stop hook logic
- Complexity: **M**
- Why clanker benefits: "`/ralph-loop "Make all tests pass" --completion-promise "ALL_GREEN"`" is a realistic automation.

**F16. `commit-commands` plugin (Anthropic)** — `/commit` (auto message from staged+unstaged changes), `/commit-push-pr` (one-shot), `/clean_gone` (prune local branches whose remotes were deleted).
- Quality: **B — CONSIDER `/clean_gone`.** Clanker already has `/sc:git`; the specific `/clean_gone` idiom is a common need and a 15-line script.
- Complexity: **S**

**F17. `claude-md-management` plugin (Anthropic)** — ships `claude-md-improver` skill (audits CLAUDE.md vs. current codebase) + `/revise-claude-md` command (captures session learnings into CLAUDE.md).
- Quality: **A — PORT BOTH.** Clanker already assumes CLAUDE.md is central; an auto-audit skill + manual revise command are cheap, high-value.
- Approx. tokens: **~150** (lazy-loaded skill + short command)
- Complexity: **S**
- Why clanker benefits: prevents CLAUDE.md rot. Pair with `@import` (v0.3 A4) to keep the root file short and audited.

**F18. `skill-creator` plugin (Anthropic)** — create new skills from scratch; optimize existing; run evals; benchmark with variance analysis.
- Quality: **C — mention in README.** Meta-tool for skill authors. Clanker users who want to add their own skills get pointed here.

**F19. `mcp-server-dev` plugin (Anthropic)** — 3 skills (build-mcp-server, build-mcp-app, build-mcpb) for creating MCP servers in TypeScript or Python.
- Quality: **C — mention in README.** Clanker is a starter kit, not an MCP-builder kit. Point users at this when they want to build their own MCP.

### LSP plugins (11 total)

`clangd-lsp`, `csharp-lsp`, `gopls-lsp`, `jdtls-lsp`, `kotlin-lsp`, `lua-lsp`, `php-lsp`, `pyright-lsp`, `ruby-lsp`, `rust-analyzer-lsp`, `swift-lsp`, `typescript-lsp`.
- Quality: **B — mention conditionally in generated CLAUDE.md.** When clanker detects a stack, suggest the matching LSP plugin as `/plugin install <stack>-lsp@anthropic-official`.
- Approx. tokens added: **0** (conditional README line only)
- Complexity: **S**
- Why clanker benefits: existing stack detection (`detect.js`) can emit a one-line recommendation at init time.

### Out-of-scope plugins

`math-olympiad`, `playground`, `example-plugin`, `learning-output-style`, `explanatory-output-style` — mention-only, not clanker-relevant.

---

## Section 5 — Emerging 2026 patterns

### F20. Hash-verified file editing (hex-line-mcp by levnikolaevich)

Source: [levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills), published as `@levnikolaevich/hex-line-mcp` on npm.

Every line carries a content hash; edits must match the hash or they're rejected. Eliminates a real failure mode where Claude overwrites recent changes with outdated context (especially after compaction).

- Local-first, no signup, 9 tools exposed
- Install: `claude mcp add hex-line-mcp -- npx -y @levnikolaevich/hex-line-mcp`
- Approx. startup token cost: **0** (optional MCP)
- Complexity to register: **S** (one line in MCP registry)
- Quality: **B — register in MCP registry, don't default.** Real problem solved; niche enough that most users won't need it, but when they do, it's the right tool.
- Why clanker benefits: reduces a documented compaction-related failure mode. Pairs with v0.3 A3 (SessionStart compact re-inject).

### F21. Incremental audit notes survive compaction (TheDecipherist/claude-code-mastery-project-starter-kit)

Novel pattern from [MDD Workflow starter](https://github.com/TheDecipherist/claude-code-mastery-project-starter-kit): during long audit operations, write findings to disk every 2 items. If context compacts mid-audit, Claude resumes by reading the notes tail. "Survived 6 complete audit cycles."

- Implementation: a skill-level instruction embedded in long-running commands (like `/audit`, `/review`)
- Approx. tokens: **~80 tokens** embedded in affected commands
- Complexity: **S**
- Quality: **A — PORT.** This is the single cheapest token/resilience-value pattern found across all research. Adds 3 lines to `/review`, `/feat`, `/audit` that tell Claude "write intermediate notes to `.claude/scratch/<cmd>.md` every N items."
- Why clanker benefits: long operations in clanker currently silently fail on compaction. This fix is near-free.

### F22. Red Gate / Green Gate / Integration Gate pattern (MDD)

Same repo's 7-phase build pattern enforces:
- **Red Gate:** generated failing tests must actually fail before implementation
- **Green Gate:** all tests must pass before marking implementation done
- **Integration Gate:** real HTTP/DB/browser behavior confirmed before closing task

- Quality: **B — port Red Gate and Green Gate into `/feat`.** Integration Gate is already in clanker's `/qcheck` (Playwright-first verification). The Red-Gate idea ("prove the test fails for the right reason before making it pass") is ~20 tokens of instruction.
- Complexity: **S**

### F23. claude-mem (thedotmack/claude-mem)

Source: [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem). Local-first (SQLite + Chroma embeddings, Bun worker on port 37777), no signup. 6 lifecycle hooks + 4 MCP search tools.

- Pattern: auto-capture observations → AI-compress into semantic summaries → search index before details ("~10× token savings by filtering before fetching")
- Quality: **B — mention in MCP registry, don't default.** Bun runtime dependency is a downside for Node-first clanker users. But the pattern (lifecycle capture + progressive disclosure search) is superior to `session-log` for multi-month projects.
- Why not default: adds Bun runtime + port 37777 service. Too heavy for a starter kit default.

### F24. `claude-supermemory` (supermemoryai)

Source: [supermemoryai/claude-supermemory](https://github.com/supermemoryai/claude-supermemory). Cloud-based, requires Supermemory Pro subscription + API key.
- Quality: **C — DO NOT recommend for default bundle.** Violates the no-paid-tier, no-signup constraint. Mention only.

### F25. Browser-tab-as-proxy pattern

Source: MemPalace and others. Use the user's already-authenticated browser tab (via browser automation) as a proxy to reach services without exposing an MCP server to the public internet.
- Quality: **C — novel but fragile.** Requires Playwright + a very specific setup; breaks the moment the auth cookie expires. Mention-only.

### F26. Orchestrator Protocol (6-step loop)

Pattern cited broadly in 2026 community: IMPLEMENT → VERIFY → REVIEW → FIX → RE-VERIFY → SCORE. This is a generalization of Anthropic's Explore-Plan-Implement-Commit with explicit verify/review/re-verify gates.
- Quality: **B — absorb into `/feat` and `/sc:implement`.** Essentially a superset of the Red/Green gates pattern. Add SCORE as a 0–100 confidence output at the end of long workflows.

---

## Section 6 — High-quality skill and agent markdown for direct adoption

Selected from [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills), [glebis/claude-skills](https://github.com/glebis/claude-skills), and Anthropic official plugins. All selections: local-first, no-signup, lazy-loaded (zero startup token cost).

**F27. `api-design-reviewer.md`** (alirezarezvani) — REST API linting with breaking-change detection. Plugs into clanker `skills/review/api-design-reviewer.md`. Source: [claude-skills/api-design-reviewer](https://github.com/alirezarezvani/claude-skills). Quality: **A.** Perfect fit for backend-heavy clanker users.

**F28. `dependency-auditor.md`** (alirezarezvani) — license compliance scanning + upgrade planning (npm/NuGet/pip). `skills/devops/dependency-auditor.md`. Source: same repo. Quality: **A.** Complements clanker's existing `pkg-install-offer` hook.

**F29. `api-test-suite-builder.md`** (alirezarezvani) — auto-generate tests from API routes. `skills/testing/api-test-suite-builder.md`. Quality: **B.** Natural pair with `/qcheck`.

**F30. `ci-cd-pipeline-builder.md`** (alirezarezvani) — GitHub Actions/GitLab CI generation. `skills/devops/ci-cd-pipeline-builder.md`. Quality: **B.** Solves the "first deploy" gap clanker leaves users with.

**F31. `codebase-onboarding.md`** (alirezarezvani) — auto-generate developer onboarding docs. `skills/docs/codebase-onboarding.md`. Quality: **B.** Pairs with clanker's `spec-awareness` hook.

**F32. `tdd/SKILL.md`** (glebis) — multi-agent test-driven development: RED → GREEN → REFACTOR with separate sub-agents per phase. `skills/testing/tdd.md`. Source: [glebis/claude-skills/tdd](https://github.com/glebis/claude-skills). Quality: **A.** The TDD skill most faithful to the canonical 3-phase pattern; parallel-agent phase separation is genuinely novel.

**F33. `retrospective/SKILL.md`** (glebis) — session review that captures learnings into per-skill improvement notes. `skills/meta/retrospective.md`. Quality: **B.** Fits clanker's `/save` command lifecycle.

**F34. `session-search/SKILL.md`** (glebis) — semantic search across past Claude Code session transcripts. `skills/meta/session-search.md`. Quality: **B** (requires a session store — works best with the existing `session-log` hook output).

**F35. `code-explorer` agent** (Anthropic feature-dev plugin) — deep-dives an existing feature's entry points, execution flow, key components, architecture insights. `agents/code-explorer.md`. Source: [feature-dev plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/feature-dev/README.md). Quality: **A.** Clanker has no equivalent of this; `sc:analyze` is different (quality/security focus, not "understand how X works").

**F36. `code-architect` agent** (Anthropic feature-dev plugin) — design implementation blueprints. Runs 3 parallel with different tradeoffs (minimal/clean/pragmatic), user picks. `agents/code-architect.md`. Quality: **A.** Port alongside F35 as a pair.

---

## Section 7 — MCPs not yet in clanker's 14-MCP registry

All options below are local-first, no-signup.

**F37. `codesight-mcp`** (cmillstead) — tree-sitter AST parsing, 34 tools, 66 languages, in-memory graph, security-hardened (6-step path validation, prompt-injection defenses), 2,495 tests, claims ~99% token reduction via byte-offset precision retrieval. Source: [cmillstead/codesight-mcp](https://github.com/cmillstead/codesight-mcp). Install: `claude mcp add codesight-mcp -e CODESIGHT_ALLOWED_ROOTS=/path -- /path/codesight-mcp`.
- Quality: **A — REGISTER ALONGSIDE code-graph-mcp.** Hardened, huge language coverage, very high tool count. Compared to code-graph-mcp (16 languages, 10 tools, 23 stars), codesight-mcp is broader but less popular.
- Why: gives users a second option with different tradeoffs.

**F38. `openapi-mcp-swagger`** (salacoste) — convert any Swagger/OpenAPI spec into an MCP server; endpoint discovery + schema relationships. Source: [salacoste/openapi-mcp-swagger](https://github.com/salacoste/openapi-mcp-swagger).
- Quality: **B — register conditionally.** Only valuable if the user's project has OpenAPI specs. Hook clanker's stack detection to recommend it when it finds `openapi.yaml` / `swagger.json`.
- Note: 13 stars, newer (v0.1.0) — register with a "young project" note.

**F39. `hex-line-mcp`, `hex-graph-mcp`, `hex-ssh-mcp`** (levnikolaevich) — respectively: hash-verified editing, code knowledge graph with 14 tools, hash-verified remote SSH editing. All on npm, local-first, no auth.
- Quality: **B — register all three, mark as advanced.** hex-line-mcp is the most clanker-friendly; the other two are power-user tools.

**F40. `jcodemunch-mcp`** (jgravelle) — GitHub source-code exploration via tree-sitter AST.
- Quality: **C — mention only.** Overlaps with codesight-mcp and code-graph-mcp; no clear advantage.

**F41. `wrale/mcp-server-tree-sitter`** — generic tree-sitter MCP. Lower-level than codesight-mcp or code-graph-mcp.
- Quality: **C — mention only.** Users wanting raw tree-sitter access can install it; not worth registry promotion.

**F42. `postman/postman-mcp-server`** — API testing via Postman collections. Local stdio mode supported. **Requires Postman API key** (free tier available).
- Quality: **C for default bundle** (violates no-signup rule). **B for MCP registry with note** ("requires free Postman account"). Document under "optional API-testing MCPs."

### Already in registry and worth re-validating

Based on v0.3 context — `code-graph-mcp` was a v0.3 recommendation. If it's now in the 14-MCP registry, pair it with F37 (codesight-mcp). If not yet, prioritize code-graph-mcp first (more mature: 341 commits, v0.12.0 on 2026-04-17).

---

## Top 10 Findings Ranked by Quality × Value

1. **F21 — Incremental audit notes survive compaction** (MDD pattern). ~80 tokens, 3 lines per command. S complexity. A quality. Single highest value/token ratio found across 7 sections.
2. **F17 — `/revise-claude-md` + claude-md-improver skill** (Anthropic). ~150 tokens. S. A. Prevents CLAUDE.md rot; pairs with v0.3 A4 `@import` pattern.
3. **F14 — feature-dev patterns in `/feat`** (Anthropic). ~200 tokens. M. A. Three parallel architecture approaches + 3 parallel reviewers is genuinely novel and high-value.
4. **F13 — Confidence-scoring (>80) in `/review`** (Anthropic code-review). ~100 tokens. S. A. Kills reviewer-noise complaint in one line of config.
5. **F11 — Recommend hookify plugin in README** (Anthropic). 0 tokens. S. A. Offloads long-tail hook needs to Anthropic.
6. **F37 — Register codesight-mcp in MCP registry.** 0 tokens. S. A. 66 languages, hardened, 99% token reduction claim.
7. **F35+F36 — code-explorer and code-architect agents.** ~400 tokens combined. M. A. Fills a real gap clanker has around "understand existing feature before changing it."
8. **F1 — PostToolUseFailure structured error hook** (disler). 30–40 lines. S. B. Clean separation of failure telemetry from general session log.
9. **F27 — api-design-reviewer skill** (alirezarezvani). 0 startup. S. A. Critical for backend-heavy users; lazy-loaded.
10. **F4 — `/update-docs` command** (peterkrueck). ~150 tokens. S–M. B. Closes the spec-drift gap that kills long-running spec-first projects.

---

## Sources

- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [peterkrueck/Claude-Code-Development-Kit](https://github.com/peterkrueck/Claude-Code-Development-Kit)
- [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- [SuperClaude CHANGELOG](https://github.com/SuperClaude-Org/SuperClaude_Framework/blob/master/CHANGELOG.md)
- [SuperClaude agents.md](https://github.com/SuperClaude-Org/SuperClaude_Framework/blob/master/docs/user-guide/agents.md)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [anthropic hookify plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/hookify/README.md)
- [anthropic feature-dev plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/feature-dev/README.md)
- [anthropic code-review plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-review/README.md)
- [anthropic claude-md-management plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-md-management/README.md)
- [anthropic pr-review-toolkit](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit)
- [anthropic ralph-loop](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/ralph-loop/README.md)
- [anthropic commit-commands](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/commit-commands/README.md)
- [anthropic frontend-design](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/frontend-design/README.md)
- [anthropic mcp-server-dev](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/mcp-server-dev/README.md)
- [anthropic agent-sdk-dev](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/agent-sdk-dev/README.md)
- [anthropic plugin-dev](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/plugin-dev/README.md)
- [anthropic claude-code-setup](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-code-setup/README.md)
- [karanb192/claude-code-hooks](https://github.com/karanb192/claude-code-hooks)
- [decider/claude-hooks](https://github.com/decider/claude-hooks)
- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- [glebis/claude-skills](https://github.com/glebis/claude-skills)
- [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)
- [TheDecipherist/claude-code-mastery-project-starter-kit](https://github.com/TheDecipherist/claude-code-mastery-project-starter-kit)
- [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- [supermemoryai/claude-supermemory](https://github.com/supermemoryai/claude-supermemory)
- [levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills)
- [sdsrss/code-graph-mcp](https://github.com/sdsrss/code-graph-mcp)
- [cmillstead/codesight-mcp](https://github.com/cmillstead/codesight-mcp)
- [salacoste/openapi-mcp-swagger](https://github.com/salacoste/openapi-mcp-swagger)
- [postmanlabs/postman-mcp-server](https://github.com/postmanlabs/postman-mcp-server)
- [unicodeveloper — 10 must-have skills 2026](https://medium.com/@unicodeveloper/10-must-have-skills-for-claude-and-any-coding-agent-in-2026-b5451b013051)
- [David R Oliver — Skills and Hooks Starter Kit](https://medium.com/@davidroliver/skills-and-hooks-starter-kit-for-claude-code-c867af2ace32)
