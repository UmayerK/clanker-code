import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { templatesDir } from '../lib/paths.js';
import { listFilesRecursive } from '../lib/merge.js';

async function parseFrontmatter(file) {
  const raw = await readFile(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (m) fm[m[1]] = m[2];
  }
  return fm;
}

describe('shipped content — skills', () => {
  test('every skill has required frontmatter', async () => {
    const skillsDir = join(templatesDir, 'claude', 'skills');
    const files = (await listFilesRecursive(skillsDir)).filter(f => f.endsWith('.md'));
    assert.ok(files.length >= 40, `expected 45 skills, got ${files.length}`);
    for (const f of files) {
      const fm = await parseFrontmatter(f);
      assert.ok(fm, `${f} has frontmatter`);
      assert.ok(fm.name, `${f} has name`);
      assert.ok(fm.description, `${f} has description`);
      assert.ok(fm.description.length <= 120, `${f} description too long`);
    }
  });
});

describe('shipped content — agents', () => {
  test('every agent has required frontmatter', async () => {
    const agentsDir = join(templatesDir, 'claude', 'agents');
    const files = (await listFilesRecursive(agentsDir)).filter(f => f.endsWith('.md'));
    assert.ok(files.length >= 18, `expected 20 agents, got ${files.length}`);
    for (const f of files) {
      const fm = await parseFrontmatter(f);
      assert.ok(fm, `${f} has frontmatter`);
      assert.ok(fm.name, `${f} has name`);
      assert.ok(fm.description, `${f} has description`);
    }
  });
});

describe('shipped content — commands', () => {
  test('every command has required frontmatter', async () => {
    const cmdDir = join(templatesDir, 'claude', 'commands');
    const files = (await listFilesRecursive(cmdDir)).filter(f => f.endsWith('.md'));
    assert.ok(files.length >= 20, `expected 24 commands, got ${files.length}`);
    for (const f of files) {
      const fm = await parseFrontmatter(f);
      assert.ok(fm, `${f} has frontmatter`);
      assert.ok(fm.name, `${f} has name`);
      assert.ok(fm.description, `${f} has description`);
    }
  });
});

describe('shipped content — hook scripts are present', () => {
  test('all hook scripts exist', async () => {
    const scripts = join(templatesDir, 'claude', 'hooks', 'scripts');
    const files = await readdir(scripts);
    const expected = [
      'destructive-bash-guard.js', 'secret-leak-guard.js', 'gitignore-warn.js',
      'auto-format.js', 'spec-awareness.js', 'git-context.js', 'stop-notify.js',
      'session-log.js', 'typecheck-bg.js', 'pkg-install-offer.js',
      'context-reinject.js', 'transcript-backup.js', 'exit-plan-autoapprove.js',
      'lib.js',
    ];
    for (const e of expected) assert.ok(files.includes(e), `${e} exists`);
  });
});
