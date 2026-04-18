---
name: serena-semantic-editing
description: When to reach for Serena MCP (LSP-backed semantic code intelligence) instead of Read/Grep/Edit.
triggers: rename, refactor, find usages, symbol, semantic, where is this called, impact analysis
---

## Problem
Read + Grep + Edit are cheap for small known files, but degrade fast on "rename this function everywhere," "find all callers," or "what does this touch?" Serena answers those in one symbol-level query — a fraction of the cost.

## Rule
- Use Serena when the task is **about symbols**: rename, find usages, trace callers, list public surface.
- Use Serena when the task spans **more than ~3 files** and the relationship is structural.
- Use built-in Read/Edit when the task is **local** (one file, one function) — Serena startup beats nothing.
- Use Serena's symbol-level edits (not patches) for renames and signature changes — it updates all call sites atomically.
- Never mix Serena edits and direct Edits in the same step; pick one path per change.
- If Serena is not configured, fall back to Grep + Read with an explicit note in the response that results may be less complete.

## Example
Task: "Rename `getUser` to `fetchUserById` everywhere."

With Serena:
```
serena: rename_symbol { name: "getUser", newName: "fetchUserById" }
```
Updates definition and all call sites in one atomic operation.

Without Serena (fallback):
```
Grep "getUser" → list files → Edit each → run tests → watch for shadowed names
```
Slower, error-prone on overloads or shadowed locals.
