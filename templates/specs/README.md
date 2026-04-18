# specs/

This folder holds the specs that drive how Claude Code works in this project. Claude reads these on every session (via the `spec-awareness` hook).

## Files

- `00-product.md` — what this project is, who it's for, the goals
- `01-stack.md` — tech stack, key dependencies, why
- `02-standards.md` — project-specific conventions (naming, testing, PR process)
- `10-feature-*.md` — individual feature specs, numbered from 10

## Creating a feature spec

Use the `/feat <name>` command. It creates `specs/NN-feature-<name>.md` pre-filled with the template below and walks you through filling it in.

## Feature spec template

```markdown
# Feature: [Feature Name]

## Problem
What problem does this solve? Who has this problem?

## Scope
In scope. Out of scope (important — prevents creep).

## UX Notes
User flow, key interactions, loading/empty/error/success states.

## Acceptance Criteria
- [ ] Criterion 1 — specific, testable, unambiguous
- [ ] Criterion 2

## Edge Cases
- Edge case 1 and how it should be handled

## Technical Notes
Implementation details, API contracts, dependencies, migration needs.
```

## Rules

- Feature files are numbered starting at `10-` and increment by 1.
- Keep specs short. 1 page is plenty for most features.
- Update the spec as reality diverges — specs are living docs.
