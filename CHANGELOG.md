# Changelog

All notable changes to `clanker-code` are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/spec/v2.0.0.html).

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
