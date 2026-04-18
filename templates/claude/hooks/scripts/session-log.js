#!/usr/bin/env node
// Stop hook (opt-in). Appends brief session summary to .claude/sessions/YYYY-MM-DD.md.
// Enable with: CLANKER_HOOKS_EXTRA=on

import { hooksDisabled, extraHooksEnabled, hookDisabled, ok, readStdinJson } from './lib.js';
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

if (hooksDisabled() || hookDisabled('session-log')) ok();
if (!extraHooksEnabled()) ok();

const input = await readStdinJson();
const summary = String(input?.summary ?? input?.last_message ?? '').slice(0, 400);
if (!summary) ok();

const today = new Date().toISOString().slice(0, 10);
const dir = join(process.cwd(), '.claude', 'sessions');
try { mkdirSync(dir, { recursive: true }); } catch {}

const time = new Date().toISOString().slice(11, 19);
const line = `\n### ${time}\n${summary}\n`;
try { appendFileSync(join(dir, `${today}.md`), line, 'utf8'); } catch {}

ok();
