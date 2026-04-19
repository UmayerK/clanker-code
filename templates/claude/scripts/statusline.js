#!/usr/bin/env node
// Native clanker-code statusline. Reads the Claude Code statusline JSON on stdin
// (cwd, model, etc.) and emits a short one-line status for display.

import { execSync } from 'node:child_process';
import { basename } from 'node:path';

function sh(cmd) {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 500 }).toString().trim(); }
  catch { return ''; }
}

let input = {};
try {
  let buf = '';
  process.stdin.on('data', (c) => { buf += c; });
  process.stdin.on('end', () => {
    try { input = buf ? JSON.parse(buf) : {}; } catch {}
    render();
  });
  // Safety timeout so the statusline doesn't hang
  setTimeout(() => render(), 300);
} catch {
  render();
}

function render() {
  const cwd = String(input?.workspace?.current_dir ?? process.cwd());
  const dir = basename(cwd);
  const branch = sh('git rev-parse --abbrev-ref HEAD');
  const dirty = sh('git status --porcelain') ? '*' : '';
  const modelId = input?.model?.display_name ?? input?.model?.id ?? '';

  const parts = [];
  parts.push(`clanker · ${dir}`);
  if (branch) parts.push(`${branch}${dirty}`);
  if (modelId) parts.push(modelId);

  process.stdout.write(parts.join(' · '));
  process.exit(0);
}
