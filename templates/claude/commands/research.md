---
name: research
description: Deep web research with adaptive depth, primary sources, and counter-evidence.
argument-hint: <question-or-topic> [--depth quick|standard|deep] [--parallel] [--uc]
delegates-to:
---

## Purpose
Investigate a topic with planned queries, cite primary sources, and synthesize a decision-ready brief. Depth should match decision reversibility — one-way doors demand deeper research.

## Inputs
- `<question-or-topic>`: the research question.
- `--depth`: effort level; defaults to standard.

## Behavior
1. Decompose the question into sub-questions and search angles.
2. Use WebSearch for discovery, then WebFetch on high-value sources.
3. **Prefer primary sources**: official docs, RFCs, source code, release notes, repos. Not blogs.
4. Track claims with source URLs and last-modified dates — no unattributed claims.
5. **Include at least one counter-view or failure case per option** — don't cherry-pick the happy path.
6. Synthesize: give the answer first, evidence next.
7. State confidence level per claim and what would change your mind.

## Outputs
- Decision-ready brief: answer → evidence → confidence.
- Source list with URLs and dates.
- Counter-evidence for each option.
- Open questions and recommended follow-ups.

## MCP routing
- No MCPs required beyond built-in WebSearch and WebFetch.
- **sequential-thinking** (optional): structure the sub-question decomposition for complex topics.
