import { readFile, access, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import pc from 'picocolors';
import { targetPaths, registryPath } from '../paths.js';
import { detectStack, describeStack, detectToolchain } from '../detect.js';

const exists = async (p) => access(p).then(() => true).catch(() => false);

function row(level, label, detail) {
  const icon = level === 'ok' ? pc.green('✓')
    : level === 'warn' ? pc.yellow('⚠')
    : level === 'fail' ? pc.red('✗')
    : pc.dim('·');
  const detailStr = detail ? pc.dim(`— ${detail}`) : '';
  return `  ${icon} ${label} ${detailStr}`.trimEnd();
}

function nodeVersionOK() {
  const match = process.version.match(/^v(\d+)/);
  const major = match ? Number(match[1]) : 0;
  return { ok: major >= 18, version: process.version };
}

async function checkShippedContent() {
  const { readdir } = await import('node:fs/promises');
  const { templatesDir } = await import('../paths.js');
  const results = {};
  try {
    const commandsDir = join(templatesDir, 'claude', 'commands');
    const cmds = (await readdir(commandsDir)).filter(f => f.endsWith('.md'));
    results.commands = cmds.length;
  } catch { results.commands = 0; }
  try {
    const hooksDir = join(templatesDir, 'claude', 'hooks', 'scripts');
    const hooks = (await readdir(hooksDir)).filter(f => f.endsWith('.js') && f !== 'lib.js');
    results.hooks = hooks.length;
  } catch { results.hooks = 0; }
  try {
    const agentsCoding = (await readdir(join(templatesDir, 'claude', 'agents', 'coding'))).filter(f => f.endsWith('.md')).length;
    const agentsPersonas = (await readdir(join(templatesDir, 'claude', 'agents', 'personas'))).filter(f => f.endsWith('.md')).length;
    results.agents = agentsCoding + agentsPersonas;
  } catch { results.agents = 0; }
  try {
    const statusline = await exists(join(templatesDir, 'claude', 'scripts', 'statusline.js'));
    results.statusline = statusline;
  } catch { results.statusline = false; }
  return results;
}

async function checkRegistry() {
  try {
    const raw = await readFile(registryPath, 'utf8');
    const reg = JSON.parse(raw);
    const count = Object.keys(reg.mcps || {}).length;
    const defaults = (reg.defaultBundle || []).length;
    return { ok: count > 0 && defaults > 0, count, defaults };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function checkProjectClaude() {
  const paths = targetPaths(process.cwd());
  const out = {
    hasClaudeDir: await exists(paths.claudeDir),
    hasClaudeMd: await exists(paths.claudeMd),
    hasSpecs: await exists(paths.specsDir),
    hasSettings: await exists(paths.settingsFile),
    hasMcp: await exists(paths.mcpFile),
    hasManifest: await exists(paths.versionManifest),
  };

  if (out.hasSettings) {
    try {
      JSON.parse(await readFile(paths.settingsFile, 'utf8'));
      out.settingsValid = true;
    } catch {
      out.settingsValid = false;
    }
  }
  if (out.hasMcp) {
    try {
      JSON.parse(await readFile(paths.mcpFile, 'utf8'));
      out.mcpValid = true;
    } catch {
      out.mcpValid = false;
    }
  }
  return out;
}

async function checkHookScriptsInProject() {
  const paths = targetPaths(process.cwd());
  if (!(await exists(paths.hooksDir))) return { installed: false };
  try {
    const { readdir } = await import('node:fs/promises');
    const scripts = join(paths.hooksDir, 'scripts');
    if (!(await exists(scripts))) return { installed: false };
    const files = await readdir(scripts);
    return { installed: true, count: files.filter(f => f.endsWith('.js')).length };
  } catch {
    return { installed: false };
  }
}

function checkCommand(name) {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const r = spawnSync(lookup, [name], { stdio: 'ignore', shell: false });
  return r.status === 0;
}

export async function doctor({ flags = new Set() } = {}) {
  const quiet = flags.has('--quiet');
  const problems = [];
  const warnings = [];

  console.log();
  console.log(pc.bold(pc.cyan('clanker-code doctor')));
  console.log(pc.dim('Health check for clanker-code and the current project.'));
  console.log();

  // 1. Node version
  const nv = nodeVersionOK();
  if (nv.ok) {
    console.log(row('ok', 'Node version', nv.version));
  } else {
    console.log(row('fail', 'Node version', `${nv.version} — clanker-code requires Node ≥ 18`));
    problems.push('Upgrade Node to 18 or newer.');
  }

  // 2. Toolchain
  const tc = detectToolchain();
  console.log(row(tc.git ? 'ok' : 'warn', 'git', tc.git ? 'available' : 'not found — some hooks degrade gracefully'));
  console.log(row(tc.uv ? 'ok' : 'info', 'uv (Python package manager)', tc.uv ? 'available (enables Serena MCP)' : 'not installed — Serena MCP will be skipped'));

  // 3. Claude Code CLI
  const hasClaude = checkCommand('claude');
  if (hasClaude) {
    console.log(row('ok', 'claude CLI', 'on PATH'));
  } else {
    console.log(row('warn', 'claude CLI', 'not on PATH — install Claude Code to use the shipped kit'));
    warnings.push('Install the Claude Code CLI to use clanker-code in-session.');
  }

  // 4. Shipped content
  console.log();
  console.log(pc.bold('Shipped content (package):'));
  const shipped = await checkShippedContent();
  console.log(row('ok', `commands: ${shipped.commands}`));
  console.log(row('ok', `agents: ${shipped.agents}`));
  console.log(row('ok', `hook scripts: ${shipped.hooks}`));
  console.log(row(shipped.statusline ? 'ok' : 'warn', `statusline script`, shipped.statusline ? 'present' : 'missing'));
  if (!shipped.statusline) warnings.push('statusline script is missing from templates/claude/scripts/.');

  // 5. Registry
  const reg = await checkRegistry();
  if (reg.ok) {
    console.log(row('ok', `MCP registry`, `${reg.count} MCPs, ${reg.defaults} in default bundle`));
  } else {
    console.log(row('fail', 'MCP registry', reg.error || 'missing or invalid'));
    problems.push('MCP registry is missing or invalid.');
  }

  // 6. Project (current cwd)
  console.log();
  console.log(pc.bold('Current project (cwd):'));
  const stack = await detectStack(process.cwd());
  console.log(row('info', 'detected stack', describeStack(stack)));

  const proj = await checkProjectClaude();
  if (proj.hasClaudeDir) {
    console.log(row('ok', '.claude/', 'present'));
    if (proj.hasManifest) {
      try {
        const m = JSON.parse(await readFile(join(process.cwd(), '.claude', '.clanker-version'), 'utf8'));
        console.log(row('ok', 'installed clanker version', m.clankerVersion));
      } catch {
        console.log(row('warn', '.clanker-version', 'unreadable'));
      }
    } else {
      console.log(row('warn', '.clanker-version', 'missing — `clanker update` cannot merge safely'));
      warnings.push('Missing .claude/.clanker-version — consider re-running `clanker init --force`.');
    }

    const hooks = await checkHookScriptsInProject();
    if (hooks.installed) {
      console.log(row('ok', 'hook scripts', `${hooks.count} installed`));
    } else {
      console.log(row('warn', 'hook scripts', 'not installed — `clanker init` skipped or hooks removed'));
    }
  } else {
    console.log(row('info', '.claude/', 'not initialized in this directory'));
    console.log(row('info', 'next step', 'run `npx clanker-code init`'));
  }

  if (proj.hasClaudeMd) console.log(row('ok', 'CLAUDE.md', 'present'));
  else console.log(row('info', 'CLAUDE.md', 'not present'));

  if (proj.hasSpecs) console.log(row('ok', 'specs/', 'present'));
  else console.log(row('info', 'specs/', 'not present'));

  if (proj.hasSettings) {
    if (proj.settingsValid) console.log(row('ok', '.claude/settings.json', 'valid JSON'));
    else { console.log(row('fail', '.claude/settings.json', 'invalid JSON')); problems.push('Fix invalid .claude/settings.json.'); }
  }
  if (proj.hasMcp) {
    if (proj.mcpValid) console.log(row('ok', '.mcp.json', 'valid JSON'));
    else { console.log(row('fail', '.mcp.json', 'invalid JSON')); problems.push('Fix invalid .mcp.json.'); }
  }

  // 7. Summary
  console.log();
  if (problems.length === 0 && warnings.length === 0) {
    console.log(pc.green(pc.bold('All clear.')));
  } else {
    if (problems.length) {
      console.log(pc.red(pc.bold(`Problems (${problems.length}):`)));
      for (const p of problems) console.log('  -', p);
    }
    if (warnings.length) {
      console.log(pc.yellow(pc.bold(`Warnings (${warnings.length}):`)));
      for (const w of warnings) console.log('  -', w);
    }
  }
  console.log();

  if (problems.length) process.exit(1);
}
