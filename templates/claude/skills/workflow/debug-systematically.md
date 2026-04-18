---
name: debug-systematically
description: Reproduce, isolate, hypothesize, verify. Avoid random guess-and-check debugging.
triggers: bug, debug, not working, broken, error, failing test, investigate, regression
---

## Problem
Random edits and shotgun fixes hide bugs instead of killing them. Systematic debugging finds the cause, not a symptom that masks it.

## Rule
- Reproduce the bug reliably before changing anything.
- Isolate: shrink the input and code path until the failure is minimal.
- Form one hypothesis at a time; predict what the fix will change.
- Verify with a failing test first, then make it pass.
- Read the error and stack trace fully before searching the web.
- If stuck after 3 hypotheses, step back and rethink assumptions.

## Example
```ts
// 1. Reproduce
test('cart total wrong when quantity > 9', () => {
  expect(cartTotal([{ price: 10, qty: 10 }])).toBe(100);
});
// Fails: returns 10. Hypothesis: qty parsed as single digit.
// Isolate: parseInt(qty[0]) in cart.ts:42. Fix. Test passes.
```
