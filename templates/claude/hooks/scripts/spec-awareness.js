#!/usr/bin/env node
// UserPromptSubmit hook. If a specs/ directory exists, inject its file list as context.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_SPEC_AWARENESS=off to disable.

import { hooksDisabled, hookDisabled, ok, injectContext } from './lib.js';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (hooksDisabled() || hookDisabled('spec-awareness')) ok();

const specsDir = join(process.cwd(), 'specs');
if (!existsSync(specsDir)) ok();

const entries = [];
function walk(dir, depth = 0) {
  if (depth > 2) return;
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const full = join(dir, item);
      const s = statSync(full);
      if (s.isDirectory()) walk(full, depth + 1);
      else if (item.endsWith('.md')) {
        entries.push(full.replace(process.cwd() + '\\', '').replace(process.cwd() + '/', ''));
      }
    }
  } catch {}
}
walk(specsDir);

if (!entries.length) ok();

const lines = [
  '<clanker-code:specs>',
  'This project has a specs/ folder with the following markdown files (consult them when they\'re relevant to the user\'s request):',
  ...entries.map(e => `- ${e.split('\\').join('/')}`),
  '</clanker-code:specs>',
].join('\n');

injectContext(lines);
