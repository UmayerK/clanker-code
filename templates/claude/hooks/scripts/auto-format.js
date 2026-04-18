#!/usr/bin/env node
// PostToolUse hook for Write/Edit. Runs project formatter on the edited file if detected.
// Detects: prettier, biome, ruff, black. No-ops if none found.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_AUTO_FORMAT=off to disable.

import { hooksDisabled, hookDisabled, readStdinJson, ok } from './lib.js';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { extname, isAbsolute, resolve } from 'node:path';

if (hooksDisabled() || hookDisabled('auto-format')) ok();

const input = await readStdinJson();
const filePathRaw = String(input?.tool_input?.file_path ?? '');
if (!filePathRaw) ok();

// Normalize path and ensure it stays within the cwd. Refuse absolute paths
// outside cwd to prevent formatting unrelated files.
const absolutePath = isAbsolute(filePathRaw) ? resolve(filePathRaw) : resolve(process.cwd(), filePathRaw);
if (!absolutePath.startsWith(resolve(process.cwd()))) ok();

const ext = extname(absolutePath).toLowerCase();
const isJsLike = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.css', '.scss', '.html', '.yaml', '.yml'].includes(ext);
const isPy = ['.py'].includes(ext);
if (!isJsLike && !isPy) ok();

function has(cmd) {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const r = spawnSync(lookup, [cmd], { stdio: 'ignore' });
  return r.status === 0;
}

function run(cmd, args) {
  // spawnSync with array args avoids shell interpolation — no shell injection.
  spawnSync(cmd, args, { stdio: 'ignore', timeout: 5000, shell: false });
}

const cwdHasBiomeCfg = existsSync('biome.json') || existsSync('biome.jsonc');
const cwdHasPrettier = existsSync('.prettierrc') || existsSync('.prettierrc.json') || existsSync('.prettierrc.js') || existsSync('prettier.config.js') || existsSync('prettier.config.cjs');
const cwdHasRuff = existsSync('pyproject.toml') || existsSync('ruff.toml') || existsSync('.ruff.toml');
const cwdHasBlack = existsSync('pyproject.toml');

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

if (isJsLike) {
  if (cwdHasBiomeCfg && has('npx')) {
    run(npxCmd, ['--no-install', 'biome', 'format', '--write', absolutePath]);
  } else if (cwdHasPrettier && has('npx')) {
    run(npxCmd, ['--no-install', 'prettier', '--write', absolutePath]);
  }
} else if (isPy) {
  if (cwdHasRuff && has('ruff')) {
    run('ruff', ['format', absolutePath]);
  } else if (cwdHasBlack && has('black')) {
    run('black', ['--quiet', absolutePath]);
  }
}

ok();
