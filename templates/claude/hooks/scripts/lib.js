// Shared helpers for clanker-code hooks.
// All hooks must honor CLANKER_HOOKS=off globally, and their own env var for specific opt-out.

import { readFileSync } from 'node:fs';

export function hooksDisabled() {
  return process.env.CLANKER_HOOKS === 'off';
}

export function extraHooksEnabled() {
  return process.env.CLANKER_HOOKS_EXTRA === 'on';
}

export function hookDisabled(name) {
  const flag = `CLANKER_HOOK_${name.toUpperCase().replace(/-/g, '_')}`;
  return process.env[flag] === 'off';
}

export async function readStdinJson() {
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { buf += c; });
    process.stdin.on('end', () => {
      try { resolve(buf ? JSON.parse(buf) : {}); }
      catch { resolve({}); }
    });
    process.stdin.on('error', () => resolve({}));
    setTimeout(() => resolve({}), 2000); // safety timeout
  });
}

export function ok() {
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  process.exit(0);
}

export function block(reason) {
  process.stdout.write(JSON.stringify({ continue: false, stopReason: reason }) + '\n');
  process.exit(0);
}

export function injectContext(text) {
  process.stdout.write(JSON.stringify({ continue: true, additionalContext: text }) + '\n');
  process.exit(0);
}

export function warn(text) {
  process.stderr.write(`clanker-code hook: ${text}\n`);
}

export function safeExit() {
  process.exit(0);
}
