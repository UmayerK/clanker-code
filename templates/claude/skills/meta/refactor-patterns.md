---
name: refactor-patterns
description: Extract method/class, rename, introduce parameter object. No behavior change per step.
triggers: refactor, extract, rename, cleanup, restructure, code smell
---

## Problem
Refactors that mix behavior changes with structure changes hide bugs and are unreviewable. Named patterns keep each step small and safe.

## Rule
- Extract Method: pull a chunk into a function with a verb-phrase name.
- Extract Class: split a class when cohesion drops; move fields and methods together.
- Rename: make names reflect current intent; use IDE rename for refs.
- Introduce Parameter Object: collapse long arg lists into a typed struct.
- Invert Dependency: depend on interfaces, not concrete classes, to break cycles.
- One refactor pattern per commit; tests green before and after.

## Example
```ts
// Before: long args + inline logic
function createOrder(userId, items, shipping, billing, notes, currency, discount) { /* 60 lines */ }

// After: extract method + parameter object
type OrderInput = { userId: string; items: Item[]; shipping: Addr; billing: Addr;
                    notes?: string; currency: Currency; discount?: Discount };

function createOrder(input: OrderInput) {
  const total = calculateTotal(input);
  const order = buildOrder(input, total);
  return persist(order);
}
```
