---
name: select-tool
description: Score a task's complexity and recommend the right MCP / tool combination.
argument-hint: <task description>
delegates-to: analyzer
---

## Purpose
For non-trivial tasks, pause and explicitly pick which MCP(s) and built-in tools fit best — before acting. Prevents wasted context by reaching for Read/Grep when Serena would have answered in one call.

## Inputs
- `<task description>`: the task being considered. Can be the user's raw prompt or a paraphrase.

## Behavior
1. Classify the task on three axes:
   - **Shape**: lookup / investigation / build / verify / refactor / explain
   - **Breadth**: one file / one subsystem / whole repo / external systems
   - **Depth**: syntactic / semantic / architectural / behavioral
2. Match to the right primary tool:
   - Lookup of library API → **context7**
   - Semantic code question across files → **serena** (if available), else Grep + Read
   - Architecture / debugging reasoning → **sequential-thinking**
   - UI behavior verification → **playwright**
   - Cross-session fact → **memory**
   - Repo briefing → `/index-repo` output if present, else `serena` overview
3. Name a secondary tool if confirmation is needed.
4. State the decision in one sentence before beginning work.

## Outputs
- One-line decision: `Using <MCP/tool> because <one-sentence reason>`
- Then execute the task with the selected tools.

## MCP routing
- **sequential-thinking**: run the classification in one structured thought if the task is complex.
- All other MCPs are candidates, not participants — the point of this command is to *pick*.
