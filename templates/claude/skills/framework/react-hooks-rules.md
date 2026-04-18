---
name: react-hooks-rules
description: Hooks at top level only, no conditionals, follow rules-of-hooks.
triggers: react, hook, usestate, useeffect, usememo, custom hook, rules-of-hooks
---

## Problem
Conditional or nested hook calls break the internal hook order and produce inconsistent state. The ESLint rule catches most of this; understand why.

## Rule
- Call hooks at the top of a component or custom hook, never inside if/for/early-return.
- Custom hook names start with `use`; only hooks may call hooks.
- Keep hook dependency arrays honest; do not silence the lint with comments.
- Avoid effects for derived state; compute in render.
- Split a component when too many hooks cluster around unrelated concerns.
- Enable `eslint-plugin-react-hooks` with error severity.

## Example
```tsx
// Bad: conditional hook
function Profile({ id }) {
  if (!id) return null;
  const [user, setUser] = useState(null); // breaks hook order
}

// Good
function Profile({ id }) {
  const [user, setUser] = useState(null);
  if (!id) return null;
  useEffect(() => { fetchUser(id).then(setUser); }, [id]);
  return <div>{user?.name}</div>;
}
```
