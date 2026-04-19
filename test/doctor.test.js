import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const bin = join(here, '..', 'bin', 'clanker.js');

describe('clanker doctor', () => {
  test('runs end-to-end and exits 0 on this repo', () => {
    const r = spawnSync(process.execPath, [bin, 'doctor'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10000,
    });
    const out = (r.stdout || Buffer.alloc(0)).toString();
    assert.equal(r.status, 0, `doctor exited non-zero: ${r.stderr}`);
    assert.match(out, /clanker-code doctor/);
    assert.match(out, /Node version/);
    assert.match(out, /MCP registry/);
    assert.match(out, /commands:/);
  });

  test('lists doctor in help output', () => {
    const r = spawnSync(process.execPath, [bin, 'help'], {
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    });
    const out = (r.stdout || Buffer.alloc(0)).toString();
    assert.match(out, /doctor/);
  });
});
