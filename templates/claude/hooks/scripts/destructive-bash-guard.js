#!/usr/bin/env node
// PreToolUse hook for Bash. Blocks obvious destructive commands.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_DESTRUCTIVE_BASH_GUARD=off to disable.

import { hooksDisabled, hookDisabled, readStdinJson, ok, block } from './lib.js';

if (hooksDisabled() || hookDisabled('destructive-bash-guard')) ok();

const input = await readStdinJson();
const cmd = String(input?.tool_input?.command ?? '').trim();

if (!cmd) ok();

const DANGEROUS = [
  { pattern: /\brm\s+(-[a-z]*r[a-z]*f?|-[a-z]*f[a-z]*r?)\s+\/(?:\s|$)/, reason: 'rm -rf / blocked' },
  { pattern: /\brm\s+(-[a-z]*r[a-z]*f?)\s+~(\s|$)/, reason: 'rm -rf ~ blocked' },
  { pattern: /\brm\s+(-[a-z]*r[a-z]*f?)\s+\$HOME(\s|$)/, reason: 'rm -rf $HOME blocked' },
  { pattern: /\bgit\s+push\s+(--force|-f)\s+.*\b(main|master)\b/, reason: 'force push to main/master blocked' },
  { pattern: /\bgit\s+push\s+.*\b(main|master)\b.*\s(--force|-f)\b/, reason: 'force push to main/master blocked' },
  { pattern: /\b(DROP\s+(TABLE|DATABASE|SCHEMA))\b/i, reason: 'unfiltered DROP statement blocked' },
  { pattern: /\bmkfs(\.[a-z0-9]+)?\b/, reason: 'mkfs blocked' },
  { pattern: /\bdd\s+.*\bof=\/dev\/[a-z]/, reason: 'dd to device blocked' },
  { pattern: /:\(\)\{\s*:\|:&\s*\};:/, reason: 'fork bomb blocked' },
  { pattern: /\bchmod\s+-R\s+777\s+\/(?:\s|$)/, reason: 'chmod -R 777 / blocked' },
];

for (const { pattern, reason } of DANGEROUS) {
  if (pattern.test(cmd)) {
    block(`clanker-code destructive-bash-guard: ${reason}. If intentional, run the command manually outside Claude Code.`);
  }
}

ok();
