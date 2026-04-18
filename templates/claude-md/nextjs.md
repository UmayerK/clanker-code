# Project Standards (clanker-code · Next.js)

This section is managed by `clanker-code`. Edits outside the `<!-- clanker-code:start -->` / `<!-- clanker-code:end -->` markers are preserved by `clanker update`.

**Detected stack:** `{{STACK}}` · **Frameworks:** {{FRAMEWORKS}}

---

## 1. Working in this Next.js project

- **App Router by default.** If you see a `pages/` directory alongside `app/`, migration is in progress — ask before adding to either.
- **Server Components are the default.** Mark `'use client'` only when you need interactivity, browser APIs, or state.
- **Server Actions** for mutations. API route handlers for third-party webhooks and public APIs.
- **Metadata** via the `metadata` export or `generateMetadata()`. Never via `<Head>` in App Router.
- **Data fetching**: fetch on the server when possible; cache via `fetch()` options or React's `cache()`.

## 2. MCPs to prefer here

- **context7** — always before touching a Next.js API you're not 100% certain about. Next changes fast.
- **playwright** — non-negotiable for verifying pages render, forms submit, and routes navigate correctly.
- **sequential-thinking** — for routing decisions, RSC vs client component boundaries, caching strategies.

## 3. Testing mandate

Every UI change must be verified with Playwright before marking done:

1. `browser_navigate` to the affected route.
2. `browser_snapshot` the initial state.
3. Interact (click, fill, submit).
4. `browser_snapshot` the result.
5. Check `browser_console_messages` — zero red errors.
6. Check `browser_network_requests` — no unexpected 4xx/5xx.

Test: happy path + empty state + error state.

## 4. Security (Next.js specific)

- Never pass `dangerouslySetInnerHTML` user input without sanitization.
- Environment variables prefixed `NEXT_PUBLIC_` are exposed to the browser — never put secrets there.
- Use the `middleware.ts` pattern for auth gates, not per-page checks.
- Protect Server Actions: check session/auth inside the action, not just at the component level.
- Set `Content-Security-Policy` and other security headers in `next.config.js` or middleware.

## 5. Performance defaults

- Use `<Image>` from `next/image`, never raw `<img>` for project assets.
- Dynamic imports for heavy client-only components: `const X = dynamic(() => import('./X'), { ssr: false })`.
- Avoid `'use client'` at the top of a page if children can be server components.

## 6. Git + PRs

- Conventional commits: `feat(app): …`, `fix(api): …`, `refactor(ui): …`.
- Run `pnpm build` (or `npm run build`) before marking ship-ready — catches type errors and RSC boundary violations.
- Never force-push `main`. Never push without user permission.

## 7. Commands

`/brainstorm`, `/plan`, `/implement`, `/debug`, `/review`, `/test`, `/improve`, `/document`, `/design`, `/analyze`, `/mcp-help`, `/feat`, `/help`.

## 8. Specs

Feature specs live in `specs/`, numbered `10-feature-*.md`. Start new work with `/feat <name>`.
