---
name: mcp-help
description: Discover, install, and remove MCP servers via the clanker CLI.
argument-hint: <list|install|remove|info> [server-name] [--uc]
delegates-to:
---

## Purpose
Manage MCP server installations from inside Claude Code without leaving the session.

## Inputs
- `<subcommand>`: `list`, `install`, `remove`, or `info`.
- `[server-name]`: required for `install`, `remove`, and `info`.

## Behavior
1. Shell out to `clanker mcp-help <subcommand> [server-name]`.
2. For `list`, show available and installed MCP servers with status.
3. For `install`, run the installer and print post-install instructions.
4. For `remove`, confirm before uninstalling and clean up config.
5. For `info`, print the server's tools, scopes, and configuration keys.

## Outputs
- Command output from `clanker mcp-help`.
- Post-action guidance for next steps (env vars, restart, etc.).

## MCP routing
- No MCPs required: reads the local clanker registry via Bash.
