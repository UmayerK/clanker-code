# Project Standards (clanker-code · React)

This section is managed by `clanker-code`. Edits outside the `<!-- clanker-code:start -->` / `<!-- clanker-code:end -->` markers are preserved by `clanker update`.

**Detected stack:** `{{STACK}}` · **Frameworks:** {{FRAMEWORKS}}

## Imported context (lazy-loaded on demand)

See @specs/00-product.md for product context.
See @specs/01-stack.md for stack details beyond React conventions.
See @specs/02-standards.md for project-specific conventions.

---

## 1. React conventions

- **Hooks rules** are non-negotiable: call at top level, never in conditions or loops. ESLint's `react-hooks/rules-of-hooks` must stay on.
- **Colocate state.** Lift state only as high as it needs to be shared. Global state is a last resort.
- **Components do one thing.** Split at ~200 lines or when a component has >3 responsibilities.
- **Keys must be stable.** Use IDs, never array index for dynamic lists.
- **Avoid `useEffect` for derivations.** If data is derivable from props/state, compute it inline or with `useMemo`.

## 2. MCPs to prefer

- **context7** — before using any React library API you haven't verified.
- **playwright** — UI verification on every user-facing change.
- **sequential-thinking** — for state architecture, performance debugging, render analysis.
- **serena** *(if configured)* — symbol-level renames, find-usages, impact analysis. See `serena-semantic-editing` skill.

## 2a. Working smart

- **Auto-activate specialist mindsets** — security questions get OWASP lens, perf questions demand measurements. See `persona-auto-activation` skill.
- **Global flags**: `--strategy systematic|agile|enterprise`, `--depth shallow|normal|deep`, `--parallel`, `--validate`, `--uc`. Flags compose. See `command-flags-spec` skill.
- **Multi-agent work** uses wave orchestration. Entry points: `/pm`, `/spawn`. See `wave-orchestration` skill.

## 3. Testing

Every UI change must be verified with Playwright:

1. `browser_navigate`, `browser_snapshot`, interact, re-snapshot.
2. Check `browser_console_messages` for errors.
3. Cover happy path + empty state + error state.

Unit tests for reducers, pure functions, complex hooks.

## 4. Security

- Never render user HTML without sanitization.
- Validate all form input on both client and server.
- Don't store secrets in frontend bundles (they're public).
- Use `HttpOnly`, `Secure`, `SameSite` flags on auth cookies.

## 5. Performance

- Measure before optimizing. Use the React DevTools Profiler.
- `React.memo` only after identifying a measured bottleneck.
- Code-split at route boundaries.

## 6. Git

- Conventional commits. Small focused PRs. No force-push to main. No push without user permission.

## 7. Commands

`/vibe`, `/brainstorm`, `/implement`, `/debug`, `/review`, `/test`, `/improve`, `/document`, `/design`, `/analyze`, `/index`, `/select-tool`, `/pm`, `/recommend`, `/reflect`, `/mcp-help`, `/feat`, `/help`.

## 8. Specs

Feature specs in `specs/`. Start new work with `/feat <name>`.
