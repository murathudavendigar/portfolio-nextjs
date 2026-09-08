---
name: working-in-portfolio-nextjs
description: "How to make changes in portfolio-nextjs: package manager, scripts, folder conventions, and verification. Use when editing this repo, adding files, choosing commands, or deciding where code belongs. Do not use for unrelated libraries or generic language questions."
metadata:
  generator: "skillbrief"
  kind: "core"
---

# Working in portfolio-nextjs

## When to use
Use this skill for implementation work inside this repository: new files, refactors, bug fixes, and command choice.

## When not to use
- The question is about a different codebase or a generic language topic.
- You only need to read one file and the change is a one-line typo.
- A more specific skill in this folder already covers the task (tests, database, UI, Next.js).

## Defaults
- Package manager: `npm`. Do not suggest a different one.
- Language: TypeScript.
- App type: Next.js.

## Commands
- `npm run dev` — `next dev`
- `npm run build` — `next build`
- `npm run start` — `next start`
- `npm run lint` — `next lint`
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` — `vitest run`

## Where code goes
- UI components → /components
- Shared utilities → /lib
- TypeScript types → /types
- Static assets → /public

## Project rules
- Always use TypeScript. Never use `any` type.
- Use Tailwind utility classes for all styling. No inline styles.
- Use shadcn/ui components from /components/ui before creating new ones.
- Theme inversion is load-bearing: next-themes `light` is charcoal (`bg-ink`); `dark` is paper (`bg-paper`). Do not “fix” it by swapping body classes.
- Work catalog and case studies live in `data/projects.json`. Do not add a second source of truth.

## Verify before finishing
- Run tests: `npm run test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Build: `npm run build`

## Do not
- Do not add dependencies unless the task requires them, and ask first if it is unclear.
- Do not edit `node_modules`, build output, or lockfiles without a reason.
- Do not copy-paste a new architecture next to an existing one. Extend what is already here.

For the detected stack list, read [references/stack.md](references/stack.md).
