---
name: prisma-migration-safety
description: Never rename columns in one migration; use a two-step expand/contract.
triggers: prisma, migration, migrate, schema, rename, drop column, database change
---

## Problem
Renaming or dropping a column in one migration breaks any running code that still reads the old name. Expand/contract deploys safely.

## Rule
- Expand: add the new column, dual-write from app code, backfill data.
- Contract: stop reading/writing the old column, then drop it in a later migration.
- Never combine add + drop of related columns in one migration.
- Always review generated SQL before `migrate dev`; name migrations descriptively.
- Test migrations on a copy of production data for large tables.
- Back up production before running destructive migrations.

## Example
```txt
Rename `username` to `handle`.

Migration 1: add `handle` column, write both, backfill.
Deploy app v2 that reads `handle`, falls back to `username`.
Migration 2: stop writing `username`.
Deploy app v3 that reads only `handle`.
Migration 3: drop `username`.
```
