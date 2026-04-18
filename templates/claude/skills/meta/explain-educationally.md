---
name: explain-educationally
description: Define jargon on first use, build from known to unknown, examples before rules.
triggers: explain, teach, what is, how does, clarify, tutorial, onboarding
---

## Problem
Explanations that jump to abstractions or assume shared vocabulary lose the reader. Scaffolding from familiar to new sticks.

## Rule
- Define each jargon term on its first appearance; link the definition if reused.
- Start from a concrete example, then generalize to the rule.
- Build on what the reader already knows; relate new concepts to familiar ones.
- Show the wrong-but-natural answer and why it fails before the right one.
- Use small runnable snippets, not essay-length prose.
- End with a short "try this" exercise for retention.

## Example
```md
Q: What is a closure?

A closure is a function that remembers variables from where it was created,
even after that outer code has returned.

```js
function makeCounter() {
  let n = 0;           // lives on in the returned function
  return () => ++n;    // this is a closure over n
}
const c = makeCounter();
c(); c(); // 2
```

Rule: any inner function you return carries its enclosing scope with it.
Try: write makeAdder(x) that returns y => x + y.
```
