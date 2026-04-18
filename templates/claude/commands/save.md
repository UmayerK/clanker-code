---
name: save
description: Persist session context and decisions to the memory MCP.
argument-hint: [--note "<summary>"]
delegates-to:
---

## Purpose
Write a durable record of the session's decisions, progress, and open threads.

## Inputs
- `--note`: optional short summary to attach to the saved record.

## Behavior
1. Collect the session's key decisions, files touched, and open TODOs.
2. Format a concise record with timestamp, scope, and next actions.
3. Write the record to the memory MCP under the project namespace.
4. Update or create entries for in-flight specs if criteria state changed.
5. Print the saved key for future retrieval.

## Outputs
- Confirmation of saved record with retrieval key.
- Summary of captured decisions and open threads.
