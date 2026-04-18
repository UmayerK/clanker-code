#!/usr/bin/env node
// PostToolUse hook (opt-in). After a .ts/.tsx Edit/Write, runs `tsc --noEmit` in the background.
// Enable with: CLANKER_HOOKS_EXTRA=on

import { hooksDisabled, extraHooksEnabled, hookDisabled, ok, readStdinJson } from './lib.js';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { extname } from 'node:path';

if (hooksDisabled() || hookDisabled('typecheck-bg')) ok();
if (!extraHooksEnabled()) ok();

const input = await readStdinJson();
const filePath = String(input?.tool_input?.file_path ?? '');
if (!/\.(ts|tsx)$/.test(filePath)) ok();
if (!existsSync('tsconfig.json')) ok();

try {
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--no-install', 'tsc', '--noEmit'], {
    stdio: 'ignore',
    detached: true,
  });
  child.unref();
} catch {}

ok();
