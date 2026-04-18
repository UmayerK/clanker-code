import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const exists = async (p) => access(p).then(() => true).catch(() => false);
const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));
const readText = async (p) => readFile(p, 'utf8').catch(() => '');

export function hasCommand(name) {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const r = spawnSync(lookup, [name], { stdio: 'ignore', shell: false });
  return r.status === 0;
}

export function detectToolchain() {
  return {
    uv: hasCommand('uv') || hasCommand('uvx'),
    python: hasCommand('python') || hasCommand('python3'),
    git: hasCommand('git'),
    docker: hasCommand('docker'),
  };
}

export async function detectStack(cwd = process.cwd()) {
  const result = {
    stack: 'generic',
    frameworks: [],
    runtime: null,
    indicators: {},
  };

  const packageJsonPath = join(cwd, 'package.json');
  const pyprojectPath = join(cwd, 'pyproject.toml');
  const requirementsPath = join(cwd, 'requirements.txt');
  const goModPath = join(cwd, 'go.mod');
  const cargoPath = join(cwd, 'Cargo.toml');

  if (await exists(packageJsonPath)) {
    result.runtime = 'node';
    try {
      const pkg = await readJson(packageJsonPath);
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      result.indicators.packageJson = true;

      if (deps.next) {
        result.stack = 'nextjs';
        result.frameworks.push('nextjs');
      } else if (deps.react && (deps.vite || deps['react-scripts'])) {
        result.stack = 'react';
        result.frameworks.push('react');
      } else if (deps.express || deps.fastify || deps.hono || deps.koa) {
        result.stack = 'node-api';
        result.frameworks.push(
          deps.express ? 'express' :
          deps.fastify ? 'fastify' :
          deps.hono ? 'hono' : 'koa'
        );
      } else if (deps.react) {
        result.stack = 'react';
        result.frameworks.push('react');
      }

      if (deps.typescript) result.frameworks.push('typescript');
      if (deps.tailwindcss) result.frameworks.push('tailwind');
      if (deps['@prisma/client'] || deps.prisma) result.frameworks.push('prisma');
      if (deps['@supabase/supabase-js']) result.frameworks.push('supabase');
      if (deps.trpc || deps['@trpc/server']) result.frameworks.push('trpc');
      if (deps.vitest || deps.jest || deps['@playwright/test']) {
        result.frameworks.push(
          deps.vitest ? 'vitest' :
          deps.jest ? 'jest' : 'playwright'
        );
      }
    } catch {
      // malformed package.json — treat as generic node
      result.stack = 'node-api';
    }
    return result;
  }

  if (await exists(pyprojectPath) || await exists(requirementsPath)) {
    result.runtime = 'python';
    result.indicators.python = true;
    const pyproject = await readText(pyprojectPath);
    const requirements = await readText(requirementsPath);
    const blob = pyproject + '\n' + requirements;

    if (/\bfastapi\b/i.test(blob)) {
      result.stack = 'python-api';
      result.frameworks.push('fastapi');
    } else if (/\bdjango\b/i.test(blob)) {
      result.stack = 'python-api';
      result.frameworks.push('django');
    } else if (/\bflask\b/i.test(blob)) {
      result.stack = 'python-api';
      result.frameworks.push('flask');
    } else {
      result.stack = 'python-api';
    }

    if (/\bpytest\b/i.test(blob)) result.frameworks.push('pytest');
    if (/\bsqlalchemy\b/i.test(blob)) result.frameworks.push('sqlalchemy');
    if (/\bpydantic\b/i.test(blob)) result.frameworks.push('pydantic');
    return result;
  }

  if (await exists(goModPath)) {
    result.runtime = 'go';
    result.stack = 'go';
    result.indicators.go = true;
    return result;
  }

  if (await exists(cargoPath)) {
    result.runtime = 'rust';
    result.stack = 'rust';
    result.indicators.rust = true;
    return result;
  }

  return result;
}

export function describeStack(detection) {
  const parts = [];
  if (detection.frameworks.length) {
    parts.push(detection.frameworks.join(' + '));
  } else {
    parts.push(detection.stack);
  }
  return parts.join(' ');
}

export function frameworkSkillsFor(detection) {
  const skills = [];
  const fw = new Set(detection.frameworks);

  if (fw.has('nextjs')) skills.push('nextjs-app-router-patterns', 'nextjs-server-actions');
  if (fw.has('react')) skills.push('react-hooks-rules', 'react-state-colocation');
  if (fw.has('express') || fw.has('fastify') || fw.has('hono') || fw.has('koa')) {
    skills.push('api-rest-conventions', 'node-error-handling');
  }
  if (fw.has('fastapi')) skills.push('fastapi-dependency-injection', 'pydantic-validation');
  if (fw.has('django')) skills.push('django-patterns');
  if (fw.has('flask')) skills.push('flask-patterns');
  if (fw.has('prisma')) skills.push('prisma-migration-safety');
  if (fw.has('tailwind')) skills.push('tailwind-design-tokens');
  if (fw.has('typescript')) skills.push('typescript-strict-mode');
  if (fw.has('pytest')) skills.push('pytest-patterns');
  if (fw.has('vitest') || fw.has('jest')) skills.push('js-unit-testing-patterns');
  if (fw.has('playwright')) skills.push('playwright-test-patterns');

  return skills;
}
