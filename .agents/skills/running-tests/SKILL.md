---
name: running-tests
description: "How to run and add Vitest tests in portfolio-nextjs. Use when writing tests, fixing CI failures, or checking a change. Do not use for production-only feature work that does not need a test."
metadata:
  generator: "skillbrief"
  kind: "test"
---

# Tests (Vitest)

## When to use
Adding tests, debugging a failing suite, or verifying a behavior change.

## When not to use
The task is unrelated to tests and you are not being asked to verify behavior.

## How
1. Put new tests next to existing ones (same folder naming: `*.test.*`, `*.spec.*`, or `__tests__`).
2. Copy the nearest similar test for imports, setup, and assertions.
3. Run `npm run test`. Prefer the file-level filter if the full suite is slow.
4. Do not snapshot giant UI trees unless the repo already does.

## Verify
- `npm run test` passes for the files you touched.
