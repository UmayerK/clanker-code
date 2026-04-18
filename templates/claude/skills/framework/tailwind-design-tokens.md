---
name: tailwind-design-tokens
description: Use theme tokens; avoid arbitrary values [...] except for true one-offs.
triggers: tailwind, design tokens, theme, colors, spacing, arbitrary value, tailwind.config
---

## Problem
Scattering arbitrary values like `text-[#3a7bd5]` across files defeats the design system. Tokens keep design coherent and swappable.

## Rule
- Declare colors, spacing, radii, fonts in `tailwind.config` theme.extend.
- Use semantic names (`primary`, `surface`, `muted`), not raw scales in components.
- Arbitrary values only for genuine one-offs; leave a comment if unavoidable.
- Prefer composition via utilities over custom CSS files.
- For repeated patterns, extract a component, not a `@apply` class dump.
- Keep dark mode tokens parallel to light so swapping is trivial.

## Example
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3a7bd5', hover: '#2f62aa' },
        surface: '#0b0d10',
      },
      spacing: { gutter: '1.25rem' },
    },
  },
};
```
```tsx
<button className="bg-primary hover:bg-primary-hover px-gutter">Save</button>
```
