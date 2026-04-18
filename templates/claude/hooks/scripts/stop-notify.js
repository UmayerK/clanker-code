#!/usr/bin/env node
// Stop hook. Terminal bell + OS notification on long-running task completion.
// Env: CLANKER_HOOKS=off or CLANKER_HOOK_STOP_NOTIFY=off to disable.

import { hooksDisabled, hookDisabled, ok, readStdinJson } from './lib.js';
import { spawnSync } from 'node:child_process';

if (hooksDisabled() || hookDisabled('stop-notify')) ok();

const input = await readStdinJson();
const durationMs = Number(input?.duration_ms ?? input?.duration ?? 0);
const threshold = Number(process.env.CLANKER_NOTIFY_THRESHOLD_MS ?? 30000);
if (durationMs && durationMs < threshold) ok();

// Terminal bell.
process.stdout.write('\x07');

// Use fixed literal messages only — never interpolate from hook input.
const TITLE = 'Claude Code';
const MESSAGE = 'Task complete';

try {
  if (process.platform === 'darwin') {
    spawnSync('osascript', ['-e', `display notification "${MESSAGE}" with title "${TITLE}"`], {
      stdio: 'ignore',
      shell: false,
      timeout: 2000,
    });
  } else if (process.platform === 'win32') {
    const ps = `
      [reflection.assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null
      $n = New-Object System.Windows.Forms.NotifyIcon
      $n.Icon = [System.Drawing.SystemIcons]::Information
      $n.BalloonTipTitle = '${TITLE}'
      $n.BalloonTipText = '${MESSAGE}'
      $n.Visible = $true
      $n.ShowBalloonTip(3000)
      Start-Sleep -Seconds 3
    `;
    spawnSync('powershell', ['-NoProfile', '-Command', ps], {
      stdio: 'ignore',
      shell: false,
      timeout: 4000,
    });
  } else {
    spawnSync('notify-send', [TITLE, MESSAGE], { stdio: 'ignore', shell: false, timeout: 2000 });
  }
} catch {
  // Best-effort; notification failure should never fail the hook.
}

ok();
