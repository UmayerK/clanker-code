import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init } from '../lib/commands/init.js';

const exists = async (p) => access(p).then(() => true).catch(() => false);

async function makeFixture(files) {
  const dir = await mkdtemp(join(tmpdir(), 'clanker-init-'));
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    await mkdir(join(full, '..'), { recursive: true });
    await writeFile(full, content, 'utf8');
  }
  return dir;
}

async function withCwd(dir, fn) {
  const original = process.cwd();
  process.chdir(dir);
  try { return await fn(); }
  finally { process.chdir(original); }
}

describe('init — integration', () => {
  test('installs .claude/, CLAUDE.md, .mcp.json, and manifest in a fresh Next.js repo', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { next: '^15', react: '^19' } }),
    });

    await withCwd(dir, async () => {
      await init({ flags: new Set(['--force', '--no-hooks']), args: [] });
    });

    assert.ok(await exists(join(dir, '.claude')), '.claude/ should exist');
    assert.ok(await exists(join(dir, '.claude', 'skills')), 'skills/ should exist');
    assert.ok(await exists(join(dir, '.claude', 'agents')), 'agents/ should exist');
    assert.ok(await exists(join(dir, '.claude', 'commands')), 'commands/ should exist');
    assert.ok(await exists(join(dir, 'CLAUDE.md')), 'CLAUDE.md should exist');
    assert.ok(await exists(join(dir, '.mcp.json')), '.mcp.json should exist');
    assert.ok(await exists(join(dir, '.claude', '.clanker-version')), 'manifest should exist');
    assert.ok(await exists(join(dir, 'specs')), 'specs/ should exist');

    const claudeMd = await readFile(join(dir, 'CLAUDE.md'), 'utf8');
    assert.ok(claudeMd.includes('<!-- clanker-code:start -->'), 'CLAUDE.md should be wrapped');
    assert.ok(claudeMd.includes('Next.js'), 'CLAUDE.md should be stack-aware');

    const mcpDoc = JSON.parse(await readFile(join(dir, '.mcp.json'), 'utf8'));
    assert.ok(mcpDoc.mcpServers, '.mcp.json should have mcpServers');
    assert.ok(mcpDoc.mcpServers['sequential-thinking'], 'should configure sequential-thinking');
    assert.ok(mcpDoc.mcpServers['context7'], 'should configure context7');
    assert.ok(mcpDoc.mcpServers['memory'], 'should configure memory');
    assert.ok(mcpDoc.mcpServers['playwright'], 'should configure playwright');

    const manifest = JSON.parse(await readFile(join(dir, '.claude', '.clanker-version'), 'utf8'));
    assert.ok(manifest.clankerVersion, 'manifest has version');
    assert.equal(manifest.stack, 'nextjs');

    await rm(dir, { recursive: true, force: true });
  });

  test('--minimal only writes CLAUDE.md + specs/', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { express: '^4' } }),
    });

    await withCwd(dir, async () => {
      await init({ flags: new Set(['--minimal', '--force']), args: [] });
    });

    assert.ok(await exists(join(dir, 'CLAUDE.md')), 'CLAUDE.md should exist');
    assert.ok(await exists(join(dir, 'specs')), 'specs/ should exist');
    assert.equal(await exists(join(dir, '.claude')), false, '.claude/ should NOT be created in minimal mode');
    assert.equal(await exists(join(dir, '.mcp.json')), false, '.mcp.json should NOT be created in minimal mode');

    await rm(dir, { recursive: true, force: true });
  });

  test('--no-mcps skips .mcp.json', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { express: '^4' } }),
    });

    await withCwd(dir, async () => {
      await init({ flags: new Set(['--no-mcps', '--force', '--no-hooks']), args: [] });
    });

    assert.ok(await exists(join(dir, '.claude')), '.claude/ should exist');
    assert.equal(await exists(join(dir, '.mcp.json')), false, '.mcp.json should not exist');

    await rm(dir, { recursive: true, force: true });
  });

  test('prunes framework skills that do not match detected stack', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { next: '^15' } }),
    });

    await withCwd(dir, async () => {
      await init({ flags: new Set(['--force', '--no-hooks', '--no-mcps']), args: [] });
    });

    const fwDir = join(dir, '.claude', 'skills', 'framework');
    assert.ok(await exists(join(fwDir, 'nextjs-app-router-patterns.md')), 'nextjs skill kept');
    assert.equal(
      await exists(join(fwDir, 'fastapi-dependency-injection.md')),
      false,
      'fastapi skill pruned for nextjs stack'
    );

    await rm(dir, { recursive: true, force: true });
  });

  test('preserves existing CLAUDE.md content (appends wrapped section)', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { next: '^15' } }),
      'CLAUDE.md': '# My Existing Rules\n\nThis should survive.\n',
    });

    await withCwd(dir, async () => {
      await init({ flags: new Set(['--force', '--no-hooks', '--no-mcps']), args: [] });
    });

    const claudeMd = await readFile(join(dir, 'CLAUDE.md'), 'utf8');
    assert.ok(claudeMd.includes('# My Existing Rules'), 'existing content preserved');
    assert.ok(claudeMd.includes('<!-- clanker-code:start -->'), 'clanker section appended');

    await rm(dir, { recursive: true, force: true });
  });
});
