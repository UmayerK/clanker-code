---
name: tdd
description: Test-driven development with explicit RED → GREEN → REFACTOR phases, ideally with separate subagents per phase.
triggers: tdd, test-driven, red green refactor, test first, failing test first
---

## Problem
Writing tests after code becomes "tests that match the code," not "tests that verify the spec." TDD's RED → GREEN → REFACTOR forces verification before implementation and separates the concerns that cause most test drift.

## Rule

### RED (write a failing test)
- Write the smallest test that encodes *one* acceptance criterion.
- Run it. **Verify it fails for the right reason** — not because of a typo, not because of a missing import, not because of a setup bug. The failure message must describe the thing the feature should do.
- If the test passes, the test is wrong (or the feature already exists).

### GREEN (make it pass — minimally)
- Write the simplest code that makes the test pass. Ugliness is fine here.
- Do not add functionality the test doesn't demand.
- Run the full suite; confirm only the target test moved from fail → pass and nothing else changed.

### REFACTOR (clean up without adding behavior)
- With tests green, improve structure: extract, rename, consolidate.
- Run the full suite after each refactor step. If green turns red, revert.
- Stop when the code is as clean as it needs to be *right now* — not when it's perfect.

### Multi-agent TDD (when available)
- **Delegate each phase to a fresh agent** for discipline:
  - RED: agent A writes and runs the failing test.
  - GREEN: agent B implements (agent B has *not* seen agent A's implementation ideas).
  - REFACTOR: agent C (or reviewer) improves structure.
- Separate contexts keep each phase honest.

## Example
```
Task: user cannot log in with an empty email.

RED:
  it("rejects empty email on login", async () => {
    const res = await api.post("/login", { email: "", password: "x" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("email_required");
  });
  → Ran: got 500 with uncaught TypeError. Wrong reason.
  → Fix test setup, rerun: got 200 success. Now failure is meaningful (401 expected).
  Wait — we expected 400; got 200. RED valid for the right reason.

GREEN:
  Add: if (!email) return res.status(400).json({ error: { code: "email_required" } });
  Suite: 1 new pass, no regressions. Done.

REFACTOR:
  Extract validateLogin(body) pure function. Re-run suite. Still green. Commit.
```
