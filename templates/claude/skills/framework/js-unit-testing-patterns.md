---
name: js-unit-testing-patterns
description: Arrange-act-assert, one behavior per test, no shared mutable state.
triggers: unit test, vitest, jest, test, aaa, arrange act assert, mock
---

## Problem
Sprawling tests that share state or assert many things fail for unclear reasons. AAA with a single behavior makes failures obvious.

## Rule
- Structure each test: Arrange, Act, Assert (blank lines between).
- One logical assertion per test; multiple expects are fine if they describe one behavior.
- No shared mutable state across tests; use `beforeEach` or factories.
- Descriptive names: `it('rejects negative quantities')`.
- Mock at the boundary, not deep internals; prefer real code when cheap.
- Keep tests deterministic; no real network, real time, or real randomness.

## Example
```ts
import { describe, it, expect, vi } from 'vitest';
import { addToCart } from './cart';

describe('addToCart', () => {
  it('rejects negative quantities', () => {
    // Arrange
    const cart = { items: [] };

    // Act
    const result = addToCart(cart, { id: '1', qty: -1 });

    // Assert
    expect(result.ok).toBe(false);
    expect(result.error).toBe('invalid_qty');
  });
});
```
