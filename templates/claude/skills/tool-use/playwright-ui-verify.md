---
name: playwright-ui-verify
description: When and how to use the Playwright MCP for end-to-end UI verification.
triggers: ui change, form, route, page, button, click, e2e, verify, screenshot
---

## Problem
UI changes that look right in code often break in the browser. Playwright MCP confirms the real user path, including console and network.

## Rule
- Use Playwright MCP after any change that affects routes, forms, or visible behavior.
- Standard flow: navigate, snapshot, interact, snapshot, check console, check network.
- Test at least one happy path and one error/empty state.
- Wait on elements, not timeouts, to avoid flakes.
- Capture a screenshot when the change is visual or the bug is layout.
- If a check fails, fix the bug before moving on; do not skip.

## Example
```txt
1. browser_navigate http://localhost:3000/signup
2. browser_snapshot -> confirm form present
3. browser_fill_form {email, password}
4. browser_click submit
5. browser_snapshot -> expect /dashboard
6. browser_console_messages -> no errors
7. browser_network_requests -> POST /api/signup = 201
```
