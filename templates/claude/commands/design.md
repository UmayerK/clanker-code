---
name: design
description: System architecture design with components, contracts, and tradeoffs.
argument-hint: <system-or-feature>
delegates-to: architect
---

## Purpose
Produce a reviewable architecture proposal with components, data flow, and explicit tradeoffs.

## Inputs
- `<system-or-feature>`: the system, service, or feature to design.

## Behavior
1. Clarify goals, constraints, and non-functional requirements with the user.
2. Delegate to `architect` to draft component boundaries and contracts.
3. Architect defines data model, APIs, integration points, and failure modes.
4. Enumerate at least two alternative approaches with tradeoffs.
5. Recommend one approach with migration or rollout notes.

## Outputs
- Architecture document with diagram-ready structure.
- API and data contracts.
- Tradeoff matrix and recommended path forward.
