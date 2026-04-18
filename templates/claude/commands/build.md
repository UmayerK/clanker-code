---
name: build
description: Build or compile the project with intelligent error handling.
argument-hint: [--target dev|prod] [--clean] [--parallel] [--uc]
delegates-to:
---

## Purpose
Run the project's build pipeline and surface actionable errors.

## Inputs
- `--target`: build profile; defaults to the project default.
- `--clean`: remove build artifacts before building.

## Behavior
1. Detect the build system from config files (`package.json`, `pyproject.toml`, `Makefile`, etc.).
2. Run the appropriate clean command if requested.
3. Execute the build and stream output.
4. On failure, parse errors and map them to source file:line locations.
5. Suggest fixes for the top errors or re-run after applying a clear fix.

## Outputs
- Build status (success or failure).
- Parsed error list with file:line references on failure.
- Suggested next action or applied fix.

## MCP routing
- No MCPs required: runs local build tooling via Bash.
