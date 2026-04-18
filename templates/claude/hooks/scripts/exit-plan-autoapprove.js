#!/usr/bin/env node
// PreToolUse hook (opt-in). Auto-approves the ExitPlanMode permission prompt only.
// This is the safest auto-approve pattern Anthropic documents — narrow matcher,
// permission dialog disappears, no security loosening beyond Plan Mode's own guarantees.
//
// Event: PreToolUse · Matcher: ExitPlanMode
// Enable with: CLANKER_HOOKS_EXTRA=on (or CLANKER_HOOK_EXIT_PLAN_AUTOAPPROVE=on for just this one)

import { hooksDisabled, extraHooksEnabled, hookDisabled, readStdinJson } from './lib.js';

if (hooksDisabled() || hookDisabled('exit-plan-autoapprove')) {
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  process.exit(0);
}
if (!extraHooksEnabled() && process.env.CLANKER_HOOK_EXIT_PLAN_AUTOAPPROVE !== 'on') {
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  process.exit(0);
}

const input = await readStdinJson();
const toolName = String(input?.tool_name ?? input?.name ?? '');
if (toolName !== 'ExitPlanMode') {
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  process.exit(0);
}

// Auto-allow. Narrowest possible matcher — only bypasses the prompt on plan-mode exit.
process.stdout.write(JSON.stringify({ continue: true, decision: 'allow' }) + '\n');
process.exit(0);
