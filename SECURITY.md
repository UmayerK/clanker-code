# Security policy

## Supported versions

Only the latest minor version of `clanker-code` receives security fixes while the package is pre-1.0. After 1.0, the two latest minor versions will be supported.

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
| < 0.1   | No        |

## Reporting a vulnerability

**Do not open a public GitHub issue for security reports.**

Instead, email: `umayer.k2004@gmail.com` with subject line `clanker-code security`.

Include:
- A description of the vulnerability
- Steps to reproduce, or a minimal proof of concept
- Impact assessment (what an attacker could do)
- Your proposed fix, if any

You'll receive an acknowledgement within 72 hours. Fixes for confirmed high-severity vulnerabilities will be released within 14 days, with a CVE filed where applicable.

Researchers who report valid issues will be credited in the release notes unless they prefer to remain anonymous.

## What the kit does

`clanker-code` is a local CLI that writes files into your project directory and configures Claude Code. It does the following:

- Reads your project's manifest files (`package.json`, `pyproject.toml`, etc.) to detect the stack.
- Writes `.claude/`, `CLAUDE.md`, `.mcp.json`, and `specs/` into the current working directory.
- Installs hook scripts in `.claude/hooks/scripts/` that Claude Code runs on specific events.
- Prompts for API keys when the user explicitly installs an MCP that requires one (via `mcp-help add`).

## What the kit does NOT do

- **No network calls from the CLI.** The CLI ships no telemetry, analytics, or update checks. You can run it offline after dependencies are installed.
- **No auto-execution of arbitrary code.** No preinstall/postinstall lifecycle scripts in `package.json`.
- **No hooks make network calls.** All shipped hooks are local-only and honor `CLANKER_HOOKS=off`.
- **No credential exfiltration.** The MCP registry never uploads keys; keys entered during `mcp-help add` are written only to the local `.mcp.json`.
- **No silent overwrites.** If `.claude/` already exists, the CLI prompts before taking any destructive action.

## Safety rails shipped by default

Clanker installs hooks that protect against common accidents:

- **Destructive Bash guard** blocks patterns like `rm -rf /`, force-push to main/master, `DROP TABLE`, `mkfs`, `dd of=/dev/…`, fork bombs, and `chmod -R 777 /`.
- **Secret leak guard** blocks Write/Edit operations whose content matches common API key patterns (Anthropic, OpenAI, GitHub, Stripe, AWS, Google, Slack).
- **Gitignore warning** warns before writing to gitignored paths so content isn't silently lost.

These are defense-in-depth, not guarantees. Clever obfuscation can bypass any pattern-based guard. Treat them as a safety net, not a substitute for review.

## Threat model

### In scope
- Arbitrary code execution via shipped CLI or hook scripts
- Credential exfiltration (secrets being uploaded somewhere)
- Path traversal or file-write-outside-cwd during `init` or `update`
- Shell injection via user-controlled inputs (file paths, command arguments)
- Supply-chain risks from dependencies

### Out of scope
- Claude Code itself (report to Anthropic)
- MCP servers (each MCP is an independent package — report to its maintainer)
- Dangers intentional to the design (e.g., hooks *can* be disabled by env var — that's a feature)
- Social engineering attacks targeting users of the kit
- Content quality of shipped skills/agents/commands (bug reports, yes; security issues, no)

## Hardening the default install

Users who want tighter safety:

1. **Keep hooks enabled.** They add latency but catch mistakes.
2. **Audit `.claude/` and `CLAUDE.md` after `init`** — they're plain text; read them.
3. **Use `clanker init --no-mcps`** if you don't want any MCPs pre-configured.
4. **Lock to a specific version** in your team's docs (`npm install clanker-code@0.1.0`) so `update` doesn't surprise anyone.
5. **Do not add signup-required MCPs to version control.** `.mcp.json` may contain API keys after `mcp-help add`; gitignore it if so.

## Coordinated disclosure

Fixes will be coordinated with:
- Any MCP server maintainers whose product is involved
- Anthropic, if the issue touches Claude Code behavior
- The Node.js security WG, if the issue is in core or in npm packaging

Credit is given in release notes with the researcher's permission.
