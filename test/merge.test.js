import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sha256, buildFileHashMap, listFilesRecursive } from '../lib/merge.js';

async function mkdirp(p) { await mkdir(p, { recursive: true }); }

describe('sha256', () => {
  test('returns a hex digest for an existing file', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'clanker-test-'));
    const f = join(dir, 'x.txt');
    await writeFile(f, 'hello', 'utf8');
    const h = await sha256(f);
    assert.match(h, /^[0-9a-f]{64}$/);
    await rm(dir, { recursive: true, force: true });
  });

  test('returns null for missing file', async () => {
    const h = await sha256('/definitely/does/not/exist/xyz');
    assert.equal(h, null);
  });

  test('differs for different content', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'clanker-test-'));
    const a = join(dir, 'a.txt');
    const b = join(dir, 'b.txt');
    await writeFile(a, 'one', 'utf8');
    await writeFile(b, 'two', 'utf8');
    assert.notEqual(await sha256(a), await sha256(b));
    await rm(dir, { recursive: true, force: true });
  });
});

describe('listFilesRecursive', () => {
  test('walks nested directories', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'clanker-test-'));
    await mkdirp(join(dir, 'a', 'b'));
    await writeFile(join(dir, 'top.md'), 'x', 'utf8');
    await writeFile(join(dir, 'a', 'mid.md'), 'x', 'utf8');
    await writeFile(join(dir, 'a', 'b', 'leaf.md'), 'x', 'utf8');
    const files = await listFilesRecursive(dir);
    assert.equal(files.length, 3);
    await rm(dir, { recursive: true, force: true });
  });

  test('returns [] for missing directory', async () => {
    const files = await listFilesRecursive('/not/a/real/path');
    assert.deepEqual(files, []);
  });
});

describe('buildFileHashMap', () => {
  test('builds relative-path hash map', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'clanker-test-'));
    await mkdirp(join(dir, 'skills'));
    await writeFile(join(dir, 'skills', 'x.md'), 'content', 'utf8');
    const map = await buildFileHashMap(dir);
    assert.ok(map['skills/x.md']);
    assert.match(map['skills/x.md'], /^[0-9a-f]{64}$/);
    await rm(dir, { recursive: true, force: true });
  });
});
