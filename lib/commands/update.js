import { join, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { access } from 'node:fs/promises';
import pc from 'picocolors';
import { templatesDir, targetPaths } from '../paths.js';
import {
  readVersionManifest,
  threeWayMerge,
  applyMerge,
  buildFileHashMap,
  writeVersionManifest,
} from '../merge.js';

const PKG_VERSION = (() => {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(readFileSync(join(here, '..', '..', 'package.json'), 'utf8'));
  return pkg.version;
})();

const exists = async (p) => access(p).then(() => true).catch(() => false);

export async function update({ flags = new Set() } = {}) {
  const cwd = process.cwd();
  const paths = targetPaths(cwd);
  const dryRun = flags.has('--dry-run');

  console.log();
  console.log(pc.bold(pc.cyan('clanker-code update')));
  console.log(pc.dim('Interactive merge against the latest shipped version.'));
  console.log();

  if (!(await exists(paths.claudeDir))) {
    console.error(pc.red('Error:'), 'No .claude/ found. Run `clanker init` first.');
    process.exit(1);
  }

  const manifest = await readVersionManifest(paths.versionManifest);
  if (!manifest) {
    console.log(pc.yellow('⚠'), 'No .clanker-version manifest found.');
    console.log(pc.dim('   This means clanker-code can\'t tell which files you modified.'));
    console.log(pc.dim('   Re-running init with --force is the safest option for first-time users.'));
    return;
  }

  console.log(`Installed version: ${pc.cyan(manifest.clankerVersion)}`);
  console.log(`New version:       ${pc.cyan(PKG_VERSION)}`);

  if (manifest.clankerVersion === PKG_VERSION) {
    console.log(pc.green('✓'), 'Already up to date.');
    return;
  }

  const newRoot = join(templatesDir, 'claude');
  const plan = await threeWayMerge({
    manifest,
    userRoot: paths.claudeDir,
    newRoot,
  });

  const counts = plan.actions.reduce((acc, a) => {
    acc[a.action] = (acc[a.action] || 0) + 1;
    return acc;
  }, {});

  console.log();
  console.log(pc.bold('Summary:'));
  if (counts['unchanged']) console.log(`  ${pc.dim('unchanged')}    ${counts['unchanged']}`);
  if (counts['auto-update']) console.log(`  ${pc.green('auto-update')}  ${counts['auto-update']}`);
  if (counts['keep-user']) console.log(`  ${pc.cyan('keep-user')}    ${counts['keep-user']}`);
  if (counts['add']) console.log(`  ${pc.green('add')}          ${counts['add']}`);
  if (counts['conflict']) console.log(`  ${pc.yellow('conflict')}     ${counts['conflict']}`);

  if (!counts['auto-update'] && !counts['add'] && !counts['conflict']) {
    console.log(pc.dim('Nothing to do.'));
    return;
  }

  if (dryRun) {
    console.log();
    console.log(pc.cyan('[dry-run]'), 'No files will be modified.');
    return;
  }

  await applyMerge(plan, { dryRun: false });

  const newHashes = await buildFileHashMap(paths.claudeDir);
  await writeVersionManifest(paths.versionManifest, {
    ...manifest,
    clankerVersion: PKG_VERSION,
    updatedAt: new Date().toISOString(),
    files: newHashes,
  });

  console.log();
  console.log(pc.green(pc.bold('Update complete.')));
}
