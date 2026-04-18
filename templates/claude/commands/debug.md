---
name: debug
description: Systematic root-cause investigation of a bug or failure.
argument-hint: <symptom-or-error>
delegates-to: debugger
---

## Purpose
Trace a reported symptom to its root cause and propose a minimal, verifiable fix.

## Inputs
- `<symptom-or-error>`: failing test name, stack trace, error message, or reproduction steps.

## Behavior
1. Capture the symptom, reproduction steps, and recent changes.
2. Delegate to `debugger` to form hypotheses ranked by likelihood.
3. Debugger reads relevant code, logs, and tests to confirm or falsify each hypothesis.
4. Identify the root cause with file:line evidence.
5. Propose the smallest fix and a regression test that fails without it.

## Outputs
- Root cause with supporting evidence.
- Proposed fix diff and new regression test.
- Reproduction recipe for future verification.
