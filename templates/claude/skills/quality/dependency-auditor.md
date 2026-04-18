---
name: dependency-auditor
description: License compliance + vulnerability + upgrade-planning review across npm, pip, etc.
triggers: dependency audit, npm audit, pip audit, license check, upgrade plan, vulnerable dep, transitive, CVE
---

## Problem
Dependencies accrete. Each new dep adds attack surface, license risk, and transitive complexity. Most teams check only when something breaks — too late.

## Rule
- **License compliance**: every new dep must be license-compatible with the project. Flag GPL/AGPL in a non-copyleft project; flag "no license" or proprietary in an OSS project.
- **CVE scan**: run `npm audit` / `pip-audit` / language equivalent on every review. Treat High and Critical as ship-blockers; track Medium with a sunset date.
- **Upgrade strategy**:
  - **Patch** (x.y.Z): safe, auto-merge allowed.
  - **Minor** (x.Y.z): review CHANGELOG; most will work; test touched features.
  - **Major** (X.y.z): always manual; read migration guide; do one dep per PR.
- **Prefer fewer deps**. Before adding one, ask: can stdlib or 10 lines of code do it? "is-odd" is a real package and a real mistake.
- **Transitive surface**: `npm ls --all` / `pip show -r` before adding anything large. Chains of unreviewed deps are where supply-chain attacks land.
- **Lockfile discipline**: commit `package-lock.json` / `pnpm-lock.yaml` / `poetry.lock`. CI must install with `--frozen` / `ci` mode.

## Diff-review checklist
- New dep added? Check license, CVE history, last-commit date, maintainer count.
- Dep version bumped? Check major/minor/patch; read CHANGELOG for breaking changes.
- Dep removed? Check for orphaned imports; CI should catch via unused-import rule.
- Lockfile changed without `package.json` change? Suspect — why did the resolved tree move?

## Example
```md
Review of package.json diff:

🚨 New: "is-odd" ^3.0.1 (MIT)
   → One-line utility. Replace with `n % 2 !== 0`. Remove.

⚠️ Upgrade: react 18.2.0 → 19.0.0 (MAJOR)
   → Breaking: async components, new hooks behavior, refs as props. Read migration guide; land in isolation; update peer deps.

✅ Patch: zod 3.22.4 → 3.22.5. Safe.

🚨 New transitive: colors@1.4.44-liberty-2 (suspicious — original author went rogue; this is a fork).
   → Investigate. Pin direct dep to avoid picking it up.
```
