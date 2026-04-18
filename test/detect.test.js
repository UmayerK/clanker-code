import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectStack, describeStack, frameworkSkillsFor } from '../lib/detect.js';

async function makeFixture(files) {
  const dir = await mkdtemp(join(tmpdir(), 'clanker-test-'));
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    await mkdir(join(full, '..'), { recursive: true });
    await writeFile(full, content, 'utf8');
  }
  return dir;
}

describe('detectStack', () => {
  test('detects Next.js', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { next: '^15', react: '^19' } }),
    });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'nextjs');
    assert.ok(d.frameworks.includes('nextjs'));
    await rm(dir, { recursive: true, force: true });
  });

  test('detects React + Vite', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { react: '^19', vite: '^5' } }),
    });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'react');
    await rm(dir, { recursive: true, force: true });
  });

  test('detects Express API', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({ dependencies: { express: '^4' } }),
    });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'node-api');
    assert.ok(d.frameworks.includes('express'));
    await rm(dir, { recursive: true, force: true });
  });

  test('detects FastAPI from pyproject', async () => {
    const dir = await makeFixture({
      'pyproject.toml': '[project]\ndependencies = ["fastapi>=0.110"]',
    });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'python-api');
    assert.ok(d.frameworks.includes('fastapi'));
    await rm(dir, { recursive: true, force: true });
  });

  test('detects Django from requirements.txt', async () => {
    const dir = await makeFixture({
      'requirements.txt': 'Django==5.0\npsycopg2\n',
    });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'python-api');
    assert.ok(d.frameworks.includes('django'));
    await rm(dir, { recursive: true, force: true });
  });

  test('detects Go', async () => {
    const dir = await makeFixture({ 'go.mod': 'module example.com/app\n\ngo 1.22\n' });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'go');
    await rm(dir, { recursive: true, force: true });
  });

  test('detects Rust', async () => {
    const dir = await makeFixture({ 'Cargo.toml': '[package]\nname = "app"\n' });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'rust');
    await rm(dir, { recursive: true, force: true });
  });

  test('falls back to generic with no manifests', async () => {
    const dir = await makeFixture({ 'README.md': '# empty' });
    const d = await detectStack(dir);
    assert.equal(d.stack, 'generic');
    await rm(dir, { recursive: true, force: true });
  });

  test('flags TypeScript and Tailwind', async () => {
    const dir = await makeFixture({
      'package.json': JSON.stringify({
        dependencies: { next: '^15' },
        devDependencies: { typescript: '^5', tailwindcss: '^3' },
      }),
    });
    const d = await detectStack(dir);
    assert.ok(d.frameworks.includes('typescript'));
    assert.ok(d.frameworks.includes('tailwind'));
    await rm(dir, { recursive: true, force: true });
  });

  test('handles malformed package.json gracefully', async () => {
    const dir = await makeFixture({ 'package.json': '{ not valid json' });
    const d = await detectStack(dir);
    assert.equal(d.runtime, 'node');
    await rm(dir, { recursive: true, force: true });
  });
});

describe('describeStack', () => {
  test('uses framework list if present', () => {
    assert.equal(describeStack({ stack: 'nextjs', frameworks: ['nextjs', 'typescript'] }), 'nextjs + typescript');
  });
  test('falls back to stack name', () => {
    assert.equal(describeStack({ stack: 'generic', frameworks: [] }), 'generic');
  });
});

describe('frameworkSkillsFor', () => {
  test('adds Next.js skills', () => {
    const skills = frameworkSkillsFor({ frameworks: ['nextjs'] });
    assert.ok(skills.includes('nextjs-app-router-patterns'));
  });
  test('adds TypeScript skill', () => {
    const skills = frameworkSkillsFor({ frameworks: ['typescript'] });
    assert.ok(skills.includes('typescript-strict-mode'));
  });
  test('returns empty for unknown stack', () => {
    const skills = frameworkSkillsFor({ frameworks: [] });
    assert.deepEqual(skills, []);
  });
});
