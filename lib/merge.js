import { readFile, writeFile, mkdir, copyFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, dirname } from 'node:path';
import fs from 'fs-extra';
import pc from 'picocolors';
import prompts from 'prompts';

export async function sha256(filePath) {
  try {
    const buf = await readFile(filePath);
    return createHash('sha256').update(buf).digest('hex');
  } catch {
    return null;
  }
}

export async function listFilesRecursive(root) {
  const out = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile()) out.push(full);
    }
  }
  try {
    await walk(root);
  } catch {
    // root doesn't exist
  }
  return out;
}

export async function backupDir(sourceDir, backupRoot) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = join(backupRoot, `clanker-backup-${timestamp}`);
  await fs.ensureDir(dest);
  try {
    await fs.copy(sourceDir, dest, { overwrite: true });
    return dest;
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function copyTemplateTree(srcDir, destDir, { overwrite = true } = {}) {
  await fs.ensureDir(destDir);
  await fs.copy(srcDir, destDir, { overwrite });
}

export async function writeVersionManifest(manifestPath, payload) {
  await fs.ensureDir(dirname(manifestPath));
  await writeFile(manifestPath, JSON.stringify(payload, null, 2), 'utf8');
}

export async function readVersionManifest(manifestPath) {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Interactive 3-way merge for update command.
 * Compares: original (from manifest), user's current, new (from templates).
 * For each file:
 *   - if user unchanged (current matches original) → auto-update to new
 *   - if user changed but new unchanged → keep user
 *   - if both changed → prompt user: keep / take new / manual
 */
export async function threeWayMerge({ manifest, userRoot, newRoot }) {
  const actions = [];
  const newFiles = await listFilesRecursive(newRoot);

  for (const newFile of newFiles) {
    const relPath = relative(newRoot, newFile);
    const userFile = join(userRoot, relPath);
    const newHash = await sha256(newFile);
    const userHash = await sha256(userFile);
    const originalHash = manifest?.files?.[relPath] ?? null;

    if (userHash === null) {
      actions.push({ relPath, action: 'add', newFile, userFile });
      continue;
    }

    if (userHash === newHash) {
      actions.push({ relPath, action: 'unchanged', newFile, userFile });
      continue;
    }

    if (originalHash && userHash === originalHash) {
      actions.push({ relPath, action: 'auto-update', newFile, userFile });
      continue;
    }

    if (originalHash && newHash === originalHash) {
      actions.push({ relPath, action: 'keep-user', newFile, userFile });
      continue;
    }

    actions.push({ relPath, action: 'conflict', newFile, userFile });
  }

  const toApply = [];
  for (const a of actions) {
    if (a.action === 'add') {
      toApply.push({ ...a, resolution: 'write-new' });
    } else if (a.action === 'auto-update') {
      toApply.push({ ...a, resolution: 'write-new' });
    } else if (a.action === 'conflict') {
      console.log();
      console.log(pc.yellow('Conflict:'), a.relPath);
      const answer = await prompts({
        type: 'select',
        name: 'choice',
        message: `How should we handle ${a.relPath}?`,
        choices: [
          { title: 'Keep mine (no change)', value: 'keep' },
          { title: 'Take new version (overwrite)', value: 'new' },
          { title: 'Skip — leave both versions (I\'ll merge manually)', value: 'skip' },
        ],
        initial: 0,
      });
      if (answer.choice === 'new') toApply.push({ ...a, resolution: 'write-new' });
      else if (answer.choice === 'skip') toApply.push({ ...a, resolution: 'skip' });
      else toApply.push({ ...a, resolution: 'keep' });
    }
  }

  return { actions, toApply };
}

export async function applyMerge(plan, { dryRun = false } = {}) {
  for (const item of plan.toApply) {
    if (item.resolution === 'write-new') {
      if (dryRun) {
        console.log(pc.cyan('  [dry] write'), item.relPath);
      } else {
        await fs.ensureDir(dirname(item.userFile));
        await copyFile(item.newFile, item.userFile);
      }
    }
  }
}

export async function buildFileHashMap(root) {
  const files = await listFilesRecursive(root);
  const map = {};
  for (const f of files) {
    const rel = relative(root, f).split('\\').join('/');
    map[rel] = await sha256(f);
  }
  return map;
}
