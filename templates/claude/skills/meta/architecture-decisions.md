---
name: architecture-decisions
description: Capture context, decision, and consequences ADR-style. List tradeoffs explicitly.
triggers: architecture, adr, decision, tradeoff, design, choose stack, pattern
---

## Problem
Undocumented architecture decisions get re-litigated every six months and forgotten by new joiners. An ADR freezes the reasoning at decision time.

## Rule
- Write an ADR for any non-trivial, non-reversible decision.
- Sections: Context, Decision, Consequences (positive and negative), Alternatives.
- Name decisions `NNNN-short-title.md` under `docs/adr/`.
- List at least two alternatives you rejected and why.
- State consequences, not wishes; include migration/revert cost.
- Mark status: Proposed, Accepted, Superseded by NNNN.

## Example
```md
# 0007 Use Postgres (not MongoDB) for core data

Status: Accepted  Date: 2026-04-18

## Context
We need strong relational constraints and ad-hoc reporting.

## Decision
Use Postgres 16 as primary store; Prisma as ORM.

## Consequences
+ Joins, transactions, SQL reporting out of the box
+ Mature ops story (backups, PITR)
- Less flexible for unstructured blobs; use jsonb sparingly

## Alternatives
- MongoDB: flexible docs but weaker constraints; rejected.
- DynamoDB: great scale, poor ad-hoc queries; rejected.
```
