---
name: command-flags-spec
description: Uniform semantics for --strategy, --depth, --parallel, --validate, --uc across all clanker commands.
triggers: --strategy, --depth, --parallel, --validate, --uc, flags, modal
---

## Problem
Inconsistent flag behavior makes commands feel random. A `--deep` on one command must mean the same as `--deep` on another, or users stop trusting the flags.

## Rule
- `--strategy systematic` (default): exhaustive, cover-all-branches approach.
- `--strategy agile`: iterate in small loops, minimal viable pass first.
- `--strategy enterprise`: audit trail, compliance lens, formal documentation.
- `--depth shallow`: one-pass, surface only.
- `--depth normal` (default): one level deeper than shallow, with cross-refs.
- `--depth deep`: trace callers / callees / invariants across files.
- `--parallel`: when present, independent sub-tasks run concurrently via `/spawn`.
- `--validate`: refuse to return "done" unless `/reflect --validate` passes first.
- `--uc`: activate ultracompressed-mode for the response.
- Flags compose. `--depth deep --parallel --uc` is valid.
- Unknown flags on a command → surface them as warnings, don't silently ignore.

## Example
`/analyze src/auth --depth deep --focus security --parallel`
→ deep analysis on `src/auth`, security-only lens, split the pass across parallel agents.

`/implement user-avatars --strategy agile --validate --uc`
→ minimal-viable implementation path, run `/reflect --validate` before finalizing, terse responses throughout.
