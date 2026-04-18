#!/usr/bin/env node
// PreToolUse hook for Write. Warns (does not block) when writing to a gitignored path.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_GITIGNORE_WARN=off to disable.

import { hooksDisabled, hookDisabled, readStdinJson, ok, warn } from './lib.js';
import { spawnSync } from 'node:child_process';
import { isAbsolute, resolve } from 'node:path';

if (hooksDisabled() || hookDisabled('gitignore-warn')) ok();

const input = await readStdinJson();
const filePathRaw = String(input?.tool_input?.file_path ?? '');
if (!filePathRaw) ok();

// Normalize and ensure path is within cwd. Don't warn on paths outside the repo.
const absolutePath = isAbsolute(filePathRaw) ? resolve(filePathRaw) : resolve(process.cwd(), filePathRaw);
if (!absolutePath.startsWith(resolve(process.cwd()))) ok();

// spawnSync with array args — no shell, no interpolation risk.
const r = spawnSync('git', ['check-ignore', '-q', absolutePath], {
  stdio: 'ignore',
  shell: false,
  timeout: 1000,
});

// `git check-ignore -q` exits 0 if path IS ignored, 1 if not, 128 on error.
if (r.status === 0) {
  warn(`Writing to gitignored path: ${filePathRaw}. Content will not be tracked by git.`);
}

ok();
