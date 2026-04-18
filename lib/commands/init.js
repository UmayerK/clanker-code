import { readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import fs from 'fs-extra';
import pc from 'picocolors';
import prompts from 'prompts';
import { detectStack, describeStack, frameworkSkillsFor, detectToolchain, lspPluginFor } from '../detect.js';
import { templatesDir, registryPath, targetPaths } from '../paths.js';
import {
  backupDir,
  copyTemplateTree,
  writeVersionManifest,
  buildFileHashMap,
  listFilesRecursive,
} from '../merge.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PKG_VERSION = (() => {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(readFileSync(join(here, '..', '..', 'package.json'), 'utf8'));
  return pkg.version;
})();

const exists = async (p) => access(p).then(() => true).catch(() => false);

export async function init({ flags = new Set(), args = [] } = {}) {
  const cwd = process.cwd();
  const paths = targetPaths(cwd);
  const isMinimal = flags.has('--minimal');
  const setupOnly = flags.has('--setup-only');
  const noMcps = flags.has('--no-mcps');
  const noHooks = flags.has('--no-hooks');
  const force = flags.has('--force');
  const dryRun = flags.has('--dry-run');

  console.log();
  console.log(pc.bold(pc.cyan('clanker-code init')));
  console.log(pc.dim('Installing Claude Code starter kit into the current repo.'));
  console.log();

  const detection = await detectStack(cwd);
  const stackLabel = describeStack(detection);
  console.log(`${pc.green('✓')} Detected: ${pc.bold(stackLabel)}`);

  const claudeDirExists = await exists(paths.claudeDir);
  const claudeMdExists = await exists(paths.claudeMd);

  if (claudeDirExists && !force && !dryRun) {
    console.log();
    console.log(pc.yellow('⚠'), `${paths.claudeDir} already exists.`);
    const choice = await prompts({
      type: 'select',
      name: 'action',
      message: 'How should we handle it?',
      choices: [
        { title: 'Merge (keep your changes, add missing clanker-code content)', value: 'merge' },
        { title: 'Backup and replace (saves existing to .clanker-backup/)', value: 'backup-replace' },
        { title: 'Abort', value: 'abort' },
      ],
      initial: 0,
    });

    if (!choice.action || choice.action === 'abort') {
      console.log(pc.dim('Aborted.'));
      return;
    }

    if (choice.action === 'backup-replace') {
      const backupRoot = join(cwd, '.clanker-backup');
      const dest = await backupDir(paths.claudeDir, backupRoot);
      if (dest) console.log(`${pc.green('✓')} Backed up to ${pc.dim(dest)}`);
      await fs.remove(paths.claudeDir);
    }
  }

  const templateBaseClaudeDir = join(templatesDir, 'claude');

  if (setupOnly) {
    console.log();
    console.log(pc.dim('Setup-only: writing specs/ scaffolding.'));
    await installSpecs(paths, { dryRun });
    console.log();
    console.log(pc.green(pc.bold('Done.')));
    console.log(pc.dim('Next:'), 'edit', pc.cyan('specs/00-product.md'), 'and', pc.cyan('specs/01-stack.md'));
    return;
  }

  if (isMinimal) {
    console.log();
    console.log(pc.dim('Minimal install: CLAUDE.md + specs/ only.'));
    await installClaudeMd(detection, paths, { dryRun });
    await installSpecs(paths, { dryRun });
    printDone({ paths, minimal: true });
    return;
  }

  if (dryRun) {
    console.log();
    console.log(pc.cyan('[dry-run]'), 'Would install the following:');
    const files = await listFilesRecursive(templateBaseClaudeDir);
    for (const f of files.slice(0, 20)) {
      console.log('  ', f.replace(templateBaseClaudeDir, '.claude'));
    }
    console.log(pc.dim(`  ... ${files.length} files total`));
    return;
  }

  console.log();
  console.log(pc.dim('Installing .claude/ …'));
  await copyTemplateTree(templateBaseClaudeDir, paths.claudeDir, { overwrite: true });

  await pruneUnwantedFrameworkSkills(paths, detection);

  await installClaudeMd(detection, paths, { dryRun });
  await installSpecs(paths, { dryRun });

  if (!noHooks) {
    console.log(pc.dim('Configuring hooks …'));
    await installSettings(paths, { dryRun });
  }

  if (!noMcps) {
    console.log(pc.dim('Configuring MCPs …'));
    await installMcps(paths, { dryRun });
  }

  await writeManifest(paths, detection, { noMcps, noHooks, isMinimal });

  printDone({ paths, detection, noMcps, noHooks });
}

async function installClaudeMd(detection, paths, { dryRun }) {
  const stack = detection.stack;
  const candidates = [
    join(templatesDir, 'claude-md', `${stack}.md`),
    join(templatesDir, 'claude-md', 'generic.md'),
  ];

  let source = null;
  for (const c of candidates) {
    if (await exists(c)) { source = c; break; }
  }
  if (!source) return;

  const body = await readFile(source, 'utf8');
  const frameworkList = detection.frameworks.length ? detection.frameworks.join(', ') : 'generic';
  const rendered = body
    .replace(/\{\{STACK\}\}/g, detection.stack)
    .replace(/\{\{FRAMEWORKS\}\}/g, frameworkList);

  if (await exists(paths.claudeMd)) {
    const existing = await readFile(paths.claudeMd, 'utf8');
    const marker = '<!-- clanker-code:start -->';
    if (existing.includes(marker)) {
      console.log(pc.yellow('  ⚠'), 'CLAUDE.md already has clanker-code section — leaving as-is. Use `clanker update` to refresh.');
      return;
    }
    const appended = `${existing.trimEnd()}\n\n${marker}\n${rendered}\n<!-- clanker-code:end -->\n`;
    if (!dryRun) await writeFile(paths.claudeMd, appended, 'utf8');
    console.log(`${pc.green('✓')} Appended clanker-code section to existing CLAUDE.md`);
  } else {
    const wrapped = `<!-- clanker-code:start -->\n${rendered}\n<!-- clanker-code:end -->\n`;
    if (!dryRun) await writeFile(paths.claudeMd, wrapped, 'utf8');
    console.log(`${pc.green('✓')} Created CLAUDE.md (tailored to ${detection.stack})`);
  }
}

async function installSpecs(paths, { dryRun }) {
  const src = join(templatesDir, 'specs');
  if (!(await exists(src))) return;
  if (await exists(paths.specsDir)) {
    console.log(pc.dim('  specs/ already exists — skipping'));
    return;
  }
  if (!dryRun) await fs.copy(src, paths.specsDir, { overwrite: false });
  console.log(`${pc.green('✓')} Created specs/ scaffolding`);
}

async function installSettings(paths, { dryRun }) {
  const src = join(templatesDir, 'settings.json');
  if (!(await exists(src))) return;
  const shipped = JSON.parse(await readFile(src, 'utf8'));

  let existing = {};
  if (await exists(paths.settingsFile)) {
    try { existing = JSON.parse(await readFile(paths.settingsFile, 'utf8')); } catch {}
  }

  const merged = deepMerge(existing, shipped);
  if (!dryRun) {
    await fs.ensureDir(dirname(paths.settingsFile));
    await writeFile(paths.settingsFile, JSON.stringify(merged, null, 2), 'utf8');
  }
  console.log(`${pc.green('✓')} Wrote .claude/settings.json (7 active hooks)`);
}

async function installMcps(paths, { dryRun }) {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const bundle = [...registry.defaultBundle];
  const toolchain = detectToolchain();

  const conditionalAdded = [];
  for (const cond of registry.conditionalDefaults || []) {
    const satisfied = cond.requires.every(req => toolchain[req]);
    if (satisfied) {
      bundle.push(cond.mcp);
      conditionalAdded.push(cond.mcp);
    }
  }

  const mcpServers = {};
  for (const key of bundle) {
    const entry = registry.mcps[key];
    if (!entry) continue;
    mcpServers[key] = {
      command: entry.install.command,
      args: entry.install.args.map(a => a.replace('${PWD}', process.cwd())),
    };
  }

  let existing = {};
  if (await exists(paths.mcpFile)) {
    try { existing = JSON.parse(await readFile(paths.mcpFile, 'utf8')); } catch {}
  }
  const finalDoc = {
    ...existing,
    mcpServers: { ...(existing.mcpServers || {}), ...mcpServers },
  };

  if (!dryRun) {
    await writeFile(paths.mcpFile, JSON.stringify(finalDoc, null, 2), 'utf8');
  }
  console.log(`${pc.green('✓')} Wrote .mcp.json (${bundle.length} MCPs: ${bundle.join(', ')})`);

  if (conditionalAdded.length) {
    console.log(pc.dim(`  ℹ Auto-added conditional MCPs (toolchain detected): ${conditionalAdded.join(', ')}`));
  } else if (!toolchain.uv) {
    console.log(pc.dim('  ℹ Install `uv` to auto-enable Serena MCP (LSP-backed semantic editing):'));
    console.log(pc.dim('    https://docs.astral.sh/uv/getting-started/installation/'));
    console.log(pc.dim('    Then run: clanker mcp-help add serena'));
  }

  const playwrightEntry = registry.mcps.playwright;
  if (playwrightEntry?.postInstall?.message) {
    console.log(pc.dim(`  ℹ ${playwrightEntry.postInstall.message}`));
  }
}

async function pruneUnwantedFrameworkSkills(paths, detection) {
  const keepFrameworkSkills = new Set(frameworkSkillsFor(detection));
  const fwDir = join(paths.skillsDir, 'framework');
  if (!(await exists(fwDir))) return;
  const files = await listFilesRecursive(fwDir);
  for (const f of files) {
    const base = f.split(/[\\/]/).pop().replace(/\.md$/, '');
    if (!keepFrameworkSkills.has(base)) {
      await fs.remove(f);
    }
  }
}

async function writeManifest(paths, detection, meta) {
  const fileHashes = await buildFileHashMap(paths.claudeDir);
  const manifest = {
    clankerVersion: PKG_VERSION,
    installedAt: new Date().toISOString(),
    stack: detection.stack,
    frameworks: detection.frameworks,
    flags: meta,
    files: fileHashes,
  };
  await writeVersionManifest(paths.versionManifest, manifest);
}

function deepMerge(base, patch) {
  if (Array.isArray(patch)) return patch;
  if (typeof patch !== 'object' || patch === null) return patch;
  const out = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = k in out ? deepMerge(out[k], v) : v;
  }
  return out;
}

function printDone({ paths, detection, minimal, noMcps, noHooks }) {
  console.log();
  console.log(pc.green(pc.bold('Done.')));
  console.log();
  console.log('Next steps:');
  console.log(pc.dim('  1.'), 'Open your repo in Claude Code:', pc.cyan('claude'));
  if (!minimal && !noMcps) {
    console.log(pc.dim('  2.'), 'First Playwright run will download Chromium (~150MB).');
  }
  console.log(pc.dim('  3.'), 'Try:', pc.cyan('/vibe') + ',', pc.cyan('/feat') + ',', pc.cyan('/debug') + ', or', pc.cyan('/mcp-help'));
  if (!minimal) {
    console.log(pc.dim('  4.'), 'Read the generated', pc.cyan('CLAUDE.md'), 'for full usage.');
  }

  if (detection) {
    const lsp = lspPluginFor(detection);
    if (lsp) {
      console.log();
      console.log(pc.dim('Recommended:'), 'install the matching Anthropic LSP plugin for deeper semantic awareness:');
      console.log(pc.cyan(`  /plugin install ${lsp}@anthropic-official`));
    }
  }
  console.log();
}
