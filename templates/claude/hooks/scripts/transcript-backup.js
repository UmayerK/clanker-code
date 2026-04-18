#!/usr/bin/env node
// PreCompact hook (opt-in). Dumps the pre-compact transcript to .claude/transcripts/
// so you can recover detail that compaction would otherwise discard.
//
// Event: PreCompact
// Enable with: CLANKER_HOOKS_EXTRA=on (or CLANKER_HOOK_TRANSCRIPT_BACKUP=on for just this one)

import { hooksDisabled, extraHooksEnabled, hookDisabled, ok, readStdinJson } from './lib.js';
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

if (hooksDisabled() || hookDisabled('transcript-backup')) ok();
if (!extraHooksEnabled() && process.env.CLANKER_HOOK_TRANSCRIPT_BACKUP !== 'on') ok();

const input = await readStdinJson();
const messages = input?.messages ?? input?.transcript ?? input;
if (!messages) ok();

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const dir = join(process.cwd(), '.claude', 'transcripts');
try { mkdirSync(dir, { recursive: true }); } catch {}

const file = join(dir, `pre-compact-${stamp}.jsonl`);

// Accept either a messages array or a whole transcript blob.
const arr = Array.isArray(messages) ? messages : [messages];
try {
  for (const m of arr) {
    appendFileSync(file, JSON.stringify(m) + '\n', 'utf8');
  }
} catch {}

ok();
