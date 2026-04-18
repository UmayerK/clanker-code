import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import fs from 'fs-extra';
import pc from 'picocolors';
import prompts from 'prompts';
import { registryPath, targetPaths } from '../paths.js';

const exists = async (p) => access(p).then(() => true).catch(() => false);

export async function mcpHelp({ flags = new Set(), args = [], subcommand } = {}) {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const sub = subcommand || 'interactive';
  const rest = args.slice(1);

  switch (sub) {
    case 'list': return listMcps(registry);
    case 'search': return searchMcps(registry, rest[0] ?? '');
    case 'show': return showMcp(registry, rest[0]);
    case 'add': return addMcp(registry, rest[0], { flags });
    case 'remove': return removeMcp(rest[0]);
    case 'interactive': return interactive(registry, { flags });
    default:
      console.error(pc.red('Unknown subcommand:'), sub);
      printMcpHelp();
      process.exit(1);
  }
}

function printMcpHelp() {
  console.log(`
${pc.bold('clanker mcp-help')} — discover and manage MCPs

${pc.bold('Usage:')}
  clanker mcp-help                   Interactive browse
  clanker mcp-help list              List all known MCPs
  clanker mcp-help search <query>    Search by name/category/description
  clanker mcp-help show <name>       Show full details for one MCP
  clanker mcp-help add <name>        Install an MCP (guided setup if API key needed)
  clanker mcp-help remove <name>     Uninstall an MCP from .mcp.json
`);
}

function listMcps(registry) {
  const byCategory = {};
  for (const [key, mcp] of Object.entries(registry.mcps)) {
    byCategory[mcp.category] ??= [];
    byCategory[mcp.category].push({ key, ...mcp });
  }

  console.log();
  console.log(pc.bold('Available MCPs in the clanker-code registry'));
  console.log(pc.dim(`${Object.keys(registry.mcps).length} total. ★ = in default bundle.`));
  console.log();

  for (const [category, mcps] of Object.entries(byCategory)) {
    console.log(pc.cyan(pc.bold(registry.categories[category] || category)));
    for (const mcp of mcps) {
      const star = registry.defaultBundle.includes(mcp.key) ? pc.yellow('★') : ' ';
      const auth = mcp.requiresKey ? pc.dim(' [key]') : mcp.requiresSignup ? pc.dim(' [signup]') : '';
      console.log(`  ${star} ${pc.bold(mcp.key.padEnd(20))} ${pc.dim(mcp.publisher)}${auth}`);
      console.log(`    ${pc.dim(mcp.description)}`);
    }
    console.log();
  }

  console.log(pc.dim('Install:'), pc.cyan('clanker mcp-help add <name>'));
}

function searchMcps(registry, query) {
  const q = query.toLowerCase();
  if (!q) return listMcps(registry);
  const matches = [];
  for (const [key, mcp] of Object.entries(registry.mcps)) {
    const blob = `${key} ${mcp.name} ${mcp.category} ${mcp.description}`.toLowerCase();
    if (blob.includes(q)) matches.push({ key, ...mcp });
  }
  if (!matches.length) {
    console.log(pc.yellow('No matches for:'), query);
    return;
  }
  console.log();
  console.log(pc.bold(`${matches.length} match(es) for "${query}":`));
  console.log();
  for (const mcp of matches) {
    console.log(`  ${pc.bold(mcp.key)} ${pc.dim(`(${mcp.publisher})`)}`);
    console.log(`    ${pc.dim(mcp.description)}`);
  }
  console.log();
}

function showMcp(registry, name) {
  if (!name) { console.error(pc.red('Usage:'), 'clanker mcp-help show <name>'); process.exit(1); }
  const mcp = registry.mcps[name];
  if (!mcp) {
    console.error(pc.red('Unknown MCP:'), name);
    console.error(pc.dim('Run `clanker mcp-help list` to see available.'));
    process.exit(1);
  }
  console.log();
  console.log(pc.bold(pc.cyan(mcp.name)), pc.dim(`(${name})`));
  console.log(pc.dim(mcp.publisher));
  console.log();
  console.log(mcp.description);
  console.log();
  console.log(pc.bold('Details:'));
  console.log(`  Category:       ${mcp.category}`);
  console.log(`  Tools:          ~${mcp.toolCount}`);
  console.log(`  Local-first:    ${mcp.local ? pc.green('yes') : pc.yellow('no')}`);
  console.log(`  Requires key:   ${mcp.requiresKey ? pc.yellow('yes') : pc.green('no')}`);
  console.log(`  Requires signup:${mcp.requiresSignup ? pc.yellow(' yes') : pc.green(' no')}`);
  if (mcp.requiresPython) console.log(`  ${pc.yellow('⚠')} Requires Python (uv)`);
  if (mcp.prerequisites) console.log(`  Prerequisites:  ${mcp.prerequisites}`);
  if (mcp.setup?.url) console.log(`  Setup URL:      ${pc.cyan(mcp.setup.url)}`);
  if (mcp.setup?.envVar) console.log(`  Env var:        ${mcp.setup.envVar}`);
  if (mcp.setup?.instructions) {
    console.log();
    console.log(pc.bold('Setup instructions:'));
    console.log(`  ${mcp.setup.instructions}`);
  }
  console.log();
  console.log(pc.dim('Install:'), pc.cyan(`clanker mcp-help add ${name}`));
}

async function addMcp(registry, name) {
  if (!name) { console.error(pc.red('Usage:'), 'clanker mcp-help add <name>'); process.exit(1); }
  const mcp = registry.mcps[name];
  if (!mcp) {
    console.error(pc.red('Unknown MCP:'), name);
    process.exit(1);
  }
  const paths = targetPaths(process.cwd());

  let existing = { mcpServers: {} };
  if (await exists(paths.mcpFile)) {
    try { existing = JSON.parse(await readFile(paths.mcpFile, 'utf8')); } catch {}
    existing.mcpServers ??= {};
  }

  if (existing.mcpServers[name]) {
    console.log(pc.yellow('⚠'), `${name} is already configured in .mcp.json.`);
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Overwrite?',
      initial: false,
    });
    if (!overwrite) return;
  }

  console.log();
  console.log(`Adding ${pc.bold(mcp.name)} …`);
  console.log(pc.dim(mcp.description));
  console.log();

  const env = {};
  if (mcp.requiresKey && mcp.setup?.envVar) {
    const fromEnv = process.env[mcp.setup.envVar];
    if (fromEnv) {
      console.log(pc.green('✓'), `Found ${mcp.setup.envVar} in environment, will use it.`);
      env[mcp.setup.envVar] = fromEnv;
    } else {
      if (mcp.setup.url) console.log(pc.dim(`  Get key at: ${mcp.setup.url}`));
      if (mcp.setup.instructions) console.log(pc.dim(`  ${mcp.setup.instructions}`));
      const { key } = await prompts({
        type: 'password',
        name: 'key',
        message: `Paste your ${mcp.setup.envVar} (hidden input):`,
      });
      if (!key) {
        console.log(pc.yellow('⚠'), 'No key provided. Not adding.');
        return;
      }
      env[mcp.setup.envVar] = key;
    }
  }

  if (mcp.requiresPython) {
    console.log(pc.yellow('⚠'), 'This MCP requires `uv` (Python package manager).');
    console.log(pc.dim('  If not installed:'), pc.cyan('curl -LsSf https://astral.sh/uv/install.sh | sh'));
  }

  const entry = {
    command: mcp.install.command,
    args: mcp.install.args.map(a => a.replace('${PWD}', process.cwd())),
  };
  if (Object.keys(env).length) entry.env = env;

  existing.mcpServers[name] = entry;
  await fs.ensureDir(join(process.cwd()));
  await writeFile(paths.mcpFile, JSON.stringify(existing, null, 2), 'utf8');

  console.log(pc.green('✓'), `Added ${name} to .mcp.json`);
  if (mcp.postInstall?.message) console.log(pc.dim(`  ℹ ${mcp.postInstall.message}`));
  console.log(pc.dim('Restart Claude Code to activate the new MCP.'));
}

async function removeMcp(name) {
  if (!name) { console.error(pc.red('Usage:'), 'clanker mcp-help remove <name>'); process.exit(1); }
  const paths = targetPaths(process.cwd());
  if (!(await exists(paths.mcpFile))) {
    console.error(pc.red('Error:'), 'No .mcp.json in this directory.');
    process.exit(1);
  }
  const doc = JSON.parse(await readFile(paths.mcpFile, 'utf8'));
  if (!doc.mcpServers?.[name]) {
    console.log(pc.yellow('⚠'), `${name} is not in .mcp.json.`);
    return;
  }
  delete doc.mcpServers[name];
  await writeFile(paths.mcpFile, JSON.stringify(doc, null, 2), 'utf8');
  console.log(pc.green('✓'), `Removed ${name} from .mcp.json`);
}

async function interactive(registry) {
  const choices = Object.entries(registry.mcps).map(([key, mcp]) => ({
    title: `${key} — ${mcp.description.slice(0, 60)}…`,
    value: key,
  }));
  const { pick } = await prompts({
    type: 'autocomplete',
    name: 'pick',
    message: 'Browse MCPs (type to filter):',
    choices,
  });
  if (!pick) return;
  showMcp(registry, pick);

  const { act } = await prompts({
    type: 'select',
    name: 'act',
    message: 'What do you want to do?',
    choices: [
      { title: 'Install this MCP', value: 'add' },
      { title: 'Just looking, exit', value: 'quit' },
    ],
  });
  if (act === 'add') await addMcp(registry, pick);
}
