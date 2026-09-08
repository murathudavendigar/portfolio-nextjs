---
name: styling-ui
description: "UI and styling in portfolio-nextjs using Tailwind CSS + shadcn/ui. Use when adding components, layout, or visual changes. Do not use for backend, schema, or API-only work."
metadata:
  generator: "skillbrief"
  kind: "ui"
---

# UI and styling (Tailwind CSS + shadcn/ui)

## When to use
New or changed components, layout, spacing, theming, or visual bugs.

## When not to use
Server logic, database, or API work with no UI.

## Rules
- Use Tailwind utilities. Avoid new CSS files and inline style objects unless neighbors already use them.
- Reuse components in `/components/ui` (or the existing UI kit folder) before creating a new primitive.

## Steps
1. Find a similar existing screen/component and copy its structure.
2. Do not introduce a second UI library.
3. Keep class/markup density similar to neighboring files.

## Verify
- Check the changed screen still renders (dev server or component test if present).
