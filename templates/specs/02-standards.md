# Project Standards

<!-- Project-specific conventions that aren't obvious from the code. -->

## Naming
- File naming (kebab-case / camelCase / PascalCase per directory)
- Variable naming conventions
- Test file naming (`*.test.ts`, `*.spec.ts`, etc.)

## Code organization
- Where does what live (components/, lib/, services/, routes/)
- Import ordering / rules
- What gets a separate file vs. gets inlined

## Testing
- Test pyramid shape for this project
- What must have tests (APIs, complex logic) and what doesn't (trivial UI)
- Playwright is the UI verification standard for clanker-code projects

## PR process
- Required reviewers
- Merge method (squash / merge commit / rebase)
- Branch naming convention
- Commit message format (conventional commits is the clanker-code default)

## Deployment
- How deploys happen (CI / manual / preview envs)
- Rollback procedure
