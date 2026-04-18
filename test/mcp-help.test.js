import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { registryPath } from '../lib/paths.js';

describe('MCP registry', () => {
  test('registry is valid JSON and has expected shape', async () => {
    const raw = await readFile(registryPath, 'utf8');
    const reg = JSON.parse(raw);
    assert.ok(Array.isArray(reg.defaultBundle), 'defaultBundle is array');
    assert.ok(reg.mcps && typeof reg.mcps === 'object', 'mcps is object');
    assert.ok(reg.categories && typeof reg.categories === 'object', 'categories is object');
  });

  test('default bundle contains exactly 4 MCPs', async () => {
    const reg = JSON.parse(await readFile(registryPath, 'utf8'));
    assert.equal(reg.defaultBundle.length, 4);
    assert.deepEqual(
      reg.defaultBundle.sort(),
      ['context7', 'memory', 'playwright', 'sequential-thinking']
    );
  });

  test('every default-bundle MCP is local-first with no signup', async () => {
    const reg = JSON.parse(await readFile(registryPath, 'utf8'));
    for (const key of reg.defaultBundle) {
      const mcp = reg.mcps[key];
      assert.ok(mcp, `${key} exists in mcps map`);
      assert.equal(mcp.local, true, `${key} is local`);
      assert.equal(mcp.requiresSignup, false, `${key} requires no signup`);
      assert.equal(mcp.requiresKey, false, `${key} requires no key`);
    }
  });

  test('every MCP has required fields', async () => {
    const reg = JSON.parse(await readFile(registryPath, 'utf8'));
    for (const [key, mcp] of Object.entries(reg.mcps)) {
      assert.ok(mcp.name, `${key} has name`);
      assert.ok(mcp.publisher, `${key} has publisher`);
      assert.ok(mcp.category, `${key} has category`);
      assert.ok(mcp.description, `${key} has description`);
      assert.ok(mcp.install?.command, `${key} has install.command`);
      assert.ok(Array.isArray(mcp.install?.args), `${key} has install.args`);
      assert.ok(reg.categories[mcp.category], `${key} category "${mcp.category}" is defined`);
    }
  });

  test('MCPs requiring a key also have setup instructions', async () => {
    const reg = JSON.parse(await readFile(registryPath, 'utf8'));
    for (const [key, mcp] of Object.entries(reg.mcps)) {
      if (mcp.requiresKey) {
        assert.ok(mcp.setup, `${key} requires key and has setup block`);
        assert.ok(mcp.setup.instructions || mcp.setup.url, `${key} has setup instructions or URL`);
      }
    }
  });
});
