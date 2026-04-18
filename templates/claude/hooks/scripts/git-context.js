#!/usr/bin/env node
// UserPromptSubmit hook. Inject current git branch + short status into context.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_GIT_CONTEXT=off to disable.

import { hooksDisabled, hookDisabled, ok, injectContext } from './lib.js';
import { spawnSync } from 'node:child_process';

if (hooksDisabled() || hookDisabled('git-context')) ok();

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
if (!branch) ok();

const status = sh(['status', '--short']);
const ahead = sh(['rev-list', '--count', '@{u}..HEAD']);
const behind = sh(['rev-list', '--count', 'HEAD..@{u}']);

const parts = [`branch: ${branch}`];
if (ahead && ahead !== '0') parts.push(`ahead ${ahead}`);
if (behind && behind !== '0') parts.push(`behind ${behind}`);

const lines = [
  '<clanker-code:git>',
  parts.join(' · '),
  status ? `changes:\n${status.split('\n').slice(0, 30).join('\n')}` : 'working tree clean',
  '</clanker-code:git>',
].join('\n');

injectContext(lines);
