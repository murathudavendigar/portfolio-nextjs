---
name: nextjs-in-this-repo
description: "Next.js App Router workflows for portfolio-nextjs: new pages, server vs client components, and local verify. Use when adding routes, layouts, server actions, or \"use client\" boundaries. Do not use for plain React SPAs or backend-only changes."
metadata:
  generator: "skillbrief"
  kind: "next"
---

# Next.js in portfolio-nextjs

## When to use
Adding or changing routes, layouts, server components, client components, or Next.js data loading.

## When not to use
- The change is unrelated to routing or Next.js APIs (pure lib/utils, database-only, CSS-only).
- The project is not actually Next.js.

## Router
This repo looks like **App Router**.

## Adding a page
1. Put the route under `app/` (or `src/app/`) as `page.tsx` / `page.js`.
2. Default to a Server Component. Add `"use client"` only for state, effects, or browser APIs.
3. Colocate loading/error UI as `loading.tsx` / `error.tsx` when the route needs them.
4. Reuse existing layouts instead of wrapping a new root layout.

## Server vs client
- Keep data fetching and secrets on the server.
- Do not mark a whole tree as client to fix a single interactive leaf. Split the interactive piece.


## Verify
- Run tests: `npm run test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Build: `npm run build`
- Dev server: `npm run dev`.
