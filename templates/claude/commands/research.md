---
name: research
description: Deep web research with adaptive planning and source synthesis.
argument-hint: <question-or-topic> [--depth quick|standard|deep] [--parallel] [--uc]
delegates-to:
---

## Purpose
Investigate a topic with planned queries, cite primary sources, and synthesize a decision-ready brief.

## Inputs
- `<question-or-topic>`: the research question.
- `--depth`: effort level; defaults to standard.

## Behavior
1. Decompose the question into sub-questions and search angles.
2. Use WebSearch for discovery, then WebFetch on high-value sources.
3. Prefer primary sources: official docs, standards, release notes, repos.
4. Track claims with source URLs and last-modified dates.
5. Synthesize findings, flag contradictions, and state confidence per claim.

## Outputs
- Structured brief with findings, citations, and confidence levels.
- Source list with URLs and dates.
- Open questions and recommended follow-ups.

## MCP routing
- No MCPs required beyond built-in WebSearch and WebFetch.
