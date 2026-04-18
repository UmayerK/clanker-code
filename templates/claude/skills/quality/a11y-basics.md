---
name: a11y-basics
description: Semantic HTML, alt text, keyboard nav, ARIA only when needed.
triggers: ui, form, button, modal, accessible, accessibility, a11y, screen reader, aria
---

## Problem
Inaccessible UI locks out keyboard and screen-reader users and often signals broader UX bugs. Baseline a11y costs almost nothing when built in.

## Rule
- Use semantic elements: button, nav, main, label, not div+onClick.
- Every image has meaningful alt; decorative images use alt="".
- Every input has an associated label (for/id or wrapping label).
- Focus is visible and order matches visual order.
- Keyboard: every interactive element reachable and operable with Tab/Enter/Space.
- Add ARIA only when semantic HTML cannot express it; no redundant roles.

## Example
```tsx
// Bad
<div onClick={submit}>Save</div>
<img src="/chart.png" />

// Good
<button type="submit" onClick={submit}>Save</button>
<img src="/chart.png" alt="Revenue grew 30% in Q3" />

<label htmlFor="email">Email</label>
<input id="email" type="email" required />
```
