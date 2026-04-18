import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export const pkgRoot = resolve(here, '..');
export const templatesDir = join(pkgRoot, 'templates');
export const registryPath = join(pkgRoot, 'lib', 'registry', 'mcps.json');

export function targetPaths(cwd) {
  return {
    cwd,
    claudeDir: join(cwd, '.claude'),
    claudeMd: join(cwd, 'CLAUDE.md'),
    specsDir: join(cwd, 'specs'),
    settingsFile: join(cwd, '.claude', 'settings.json'),
    mcpFile: join(cwd, '.mcp.json'),
    versionManifest: join(cwd, '.claude', '.clanker-version'),
    skillsDir: join(cwd, '.claude', 'skills'),
    agentsDir: join(cwd, '.claude', 'agents'),
    commandsDir: join(cwd, '.claude', 'commands'),
    hooksDir: join(cwd, '.claude', 'hooks'),
  };
}
