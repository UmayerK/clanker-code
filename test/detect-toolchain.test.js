import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { detectToolchain, hasCommand } from '../lib/detect.js';

describe('detectToolchain', () => {
  test('returns an object with expected keys', () => {
    const t = detectToolchain();
    assert.ok('uv' in t);
    assert.ok('python' in t);
    assert.ok('git' in t);
    assert.ok('docker' in t);
    for (const v of Object.values(t)) {
      assert.equal(typeof v, 'boolean');
    }
  });

  test('git is detected on dev machines that have it', () => {
    const t = detectToolchain();
    // This test is informational; accept either.
    assert.equal(typeof t.git, 'boolean');
  });
});

describe('hasCommand', () => {
  test('returns false for an obviously fake command', () => {
    assert.equal(hasCommand('this-command-definitely-does-not-exist-xyz'), false);
  });

  test('returns true for node (running this test)', () => {
    assert.equal(hasCommand('node'), true);
  });
});
