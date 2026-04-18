#!/usr/bin/env node
// PreToolUse hook for Write/Edit. Blocks content containing common secret patterns.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_SECRET_LEAK_GUARD=off to disable.

import { hooksDisabled, hookDisabled, readStdinJson, ok, block } from './lib.js';

if (hooksDisabled() || hookDisabled('secret-leak-guard')) ok();

const input = await readStdinJson();
const content = String(
  input?.tool_input?.content ??
  input?.tool_input?.new_string ??
  ''
);

const filePath = String(input?.tool_input?.file_path ?? '');

if (!content) ok();

const envFileBypass = /(^|[\\/])\.env(\.|$)/i.test(filePath);
if (envFileBypass) ok();

const PATTERNS = [
  { name: 'Anthropic API key', re: /\bsk-ant-[a-zA-Z0-9_-]{20,}/ },
  { name: 'OpenAI API key', re: /\bsk-[a-zA-Z0-9]{20,}/ },
  { name: 'GitHub personal access token', re: /\bghp_[A-Za-z0-9]{30,}/ },
  { name: 'GitHub fine-grained PAT', re: /\bgithub_pat_[A-Za-z0-9_]{30,}/ },
  { name: 'Stripe secret key', re: /\bsk_live_[A-Za-z0-9]{20,}/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'AWS secret access key', re: /(?<![A-Za-z0-9/+])[A-Za-z0-9/+]{40}(?![A-Za-z0-9/+])/, guard: /AWS|aws|SECRET/ },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{30,}/ },
  { name: 'Slack bot token', re: /\bxox[bapr]-[A-Za-z0-9-]{10,}/ },
  { name: 'Generic "password=..."', re: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{8,}["']/i, guard: /config|example|template/ },
];

for (const p of PATTERNS) {
  if (p.re.test(content)) {
    if (p.guard && p.guard.test(content) === false) continue;
    block(
      `clanker-code secret-leak-guard: ${p.name} pattern detected in ${filePath || 'content'}. ` +
      `If this is a legitimate example, use a placeholder (e.g., "sk-xxx...") or write to a .env file.`
    );
  }
}

ok();
