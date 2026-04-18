#!/usr/bin/env node
// SessionStart hook. On session start (especially after auto-compaction),
// re-inject a small project-context block so Claude doesn't lose track of:
//   - current branch + status
//   - recent commits
//   - active specs/ files
//   - top-line of CLAUDE.md
//
// Event: SessionStart · Matcher: compact (or any — small cost, high payoff)
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_CONTEXT_REINJECT=off to disable.

import { hooksDisabled, hookDisabled, readStdinJson, ok, injectContext } from './lib.js';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

if (hooksDisabled() || hookDisabled('context-reinject')) ok();

const input = await readStdinJson();
// Only fire on compact (saves tokens on fresh sessions) unless user overrode.
const source = String(input?.source ?? '').toLowerCase();
if (source && source !== 'compact' && process.env.CLANKER_HOOK_CONTEXT_REINJECT_ALWAYS !== 'on') ok();

function sh(args) {
  const r = spawnSync('git', args, {
    stdio: ['ignore', 'pipe', 'ignore'],
    shell: false,
    timeout: 1000,
  });
  if (r.status !== 0) return '';
  return (r.stdout || '').toString().trim();
}

const branch = sh(['rev-parse', '--abbrev-ref', 'HEAD']);
const recentCommits = sh(['log', '--oneline', '-5']);
const shortStatus = sh(['status', '--short']);

let specs = '';
const specsDir = join(process.cwd(), 'specs');
if (existsSync(specsDir)) {
  try {
    const files = readdirSync(specsDir)
      .filter(f => f.endsWith('.md'))
      .sort();
    if (files.length) specs = files.map(f => `- specs/${f}`).join('\n');
  } catch {}
}

let claudeMdFirstLine = '';
const claudeMd = join(process.cwd(), 'CLAUDE.md');
if (existsSync(claudeMd)) {
  try {
    const raw = readFileSync(claudeMd, 'utf8');
    const lines = raw.split('\n').slice(0, 3).filter(Boolean);
    claudeMdFirstLine = lines.join(' ').slice(0, 200);
  } catch {}
}

const parts = [
  '<clanker-code:context-reinject>',
  'Session restart — re-injecting project context:',
];
if (branch) parts.push(`\n**Branch:** ${branch}`);
if (shortStatus) parts.push(`\n**Working tree:**\n${shortStatus.split('\n').slice(0, 20).join('\n')}`);
if (recentCommits) parts.push(`\n**Recent commits:**\n${recentCommits}`);
if (specs) parts.push(`\n**Specs:**\n${specs}`);
if (claudeMdFirstLine) parts.push(`\n**CLAUDE.md:** ${claudeMdFirstLine}`);
parts.push('\n</clanker-code:context-reinject>');

if (parts.length <= 2) ok();

injectContext(parts.join(''));
