#!/usr/bin/env node
import { init } from '../lib/commands/init.js';
import { update } from '../lib/commands/update.js';
import { mcpHelp } from '../lib/commands/mcp-help.js';
import pc from 'picocolors';

const [, , cmd, ...rest] = process.argv;

const flags = new Set(rest.filter(a => a.startsWith('--')));
const args = rest.filter(a => !a.startsWith('--'));

const commands = {
  init: () => init({ flags, args }),
  update: () => update({ flags, args }),
  'mcp-help': () => mcpHelp({ flags, args, subcommand: args[0] }),
  help: printHelp,
  '--help': printHelp,
  '-h': printHelp,
  version: printVersion,
  '--version': printVersion,
  '-v': printVersion,
};

function printHelp() {
  console.log(`
${pc.bold('clanker-code')} — the Claude Code starter kit

${pc.bold('Usage:')}
  clanker <command> [options]

${pc.bold('Commands:')}
  ${pc.cyan('init')}              Install clanker-code into the current repo
  ${pc.cyan('update')}            Interactive merge with the latest shipped version
  ${pc.cyan('mcp-help')}          Discover, install, or remove MCPs
  ${pc.cyan('help')}              Show this message
  ${pc.cyan('version')}           Show version

${pc.bold('init flags:')}
  --minimal         CLAUDE.md + specs/ only
  --setup-only      Only write specs/ scaffolding (for existing repos)
  --no-mcps         Skip MCP installation
  --no-hooks        Skip hook configuration
  --force           Overwrite existing .claude/ without prompting
  --dry-run         Preview without writing

${pc.bold('Examples:')}
  npx clanker-code init
  npx clanker-code init --minimal
  npx clanker-code init --setup-only
  npx clanker-code mcp-help list
  npx clanker-code mcp-help add github
`);
}

async function printVersion() {
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');
  const here = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8'));
  console.log(pkg.version);
}

const runner = commands[cmd] ?? (() => {
  if (!cmd) {
    printHelp();
    process.exit(0);
  }
  console.error(pc.red(`Unknown command: ${cmd}`));
  console.error(`Run ${pc.cyan('clanker help')} for usage.`);
  process.exit(1);
});

try {
  await runner();
} catch (err) {
  console.error(pc.red('Error:'), err.message);
  if (process.env.CLANKER_DEBUG) console.error(err.stack);
  process.exit(1);
}
