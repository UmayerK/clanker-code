#!/usr/bin/env node
// PostToolUse hook (opt-in). After writing package.json, prints a hint to install deps.
// Enable with: CLANKER_HOOKS_EXTRA=on

import { hooksDisabled, extraHooksEnabled, hookDisabled, ok, readStdinJson, warn } from './lib.js';

if (hooksDisabled() || hookDisabled('pkg-install-offer')) ok();
if (!extraHooksEnabled()) ok();

const input = await readStdinJson();
const filePath = String(input?.tool_input?.file_path ?? '');
if (!/package\.json$/.test(filePath)) ok();

warn('package.json changed. Run `npm install` / `pnpm install` / `yarn` to sync dependencies.');
ok();
