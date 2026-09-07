# MCP UI Surgical Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire shadcn + Magic UI into this existing portfolio without a visual rewrite: device mockups on work case studies, Magic Card hover on work cards, accessible contact form + Sonner, sheet mobile nav, and a controlled theme toggler.

**Architecture:** Initialize shadcn on the current Next.js App Router + Tailwind v3 app, map CSS tokens onto the inverted ink/paper theme, then compose installed primitives into existing components. Hero, ProofStrip, and Skills stay untouched.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v3 (`tailwind.config.js`), next-themes, react-hook-form, Vitest, shadcn CLI, Magic UI registry.

## Global Constraints

- Owner reviews and commits manually — **do not run `git commit`, `git add -A`, or any git write** except reading diffs.
- Work in `/Users/murathudavendigaroncu/Desktop/my_projects/portfolio-nextjs` (this checkout). Do not create a git worktree.
- Single accent `#CA3E47`. No purple/pink Magic UI defaults. No rainbow, sparkles, neon, confetti, marquee logos, icon-cloud, number-ticker, typing-animation, orbiting-circles, or particles.
- Do not edit `components/Hero.tsx`, `components/ProofStrip.tsx`, or `components/Skills.tsx`.
- Do not upgrade Tailwind to v4. This repo stays on Tailwind v3 + `styles/globals.css` + `tailwind.config.js`.
- Theme inversion is load-bearing: next-themes `light` = no `.dark` class = visually charcoal (`bg-ink` / `#211d1a`). next-themes `dark` = `.dark` class = visually paper (`bg-paper` / `#f3ede4`). shadcn `:root` tokens must be charcoal; `.dark` tokens must be paper. Do not “fix” this by swapping body classes.
- Keep Nunito Sans + Geist Mono. Do not replace fonts.
- Keep existing copy. No new marketing sentences.
- Prefer `@heroicons/react` over lucide when swapping icons in Header.
- `SheetTitle` / overlay titles are required for accessibility (sr-only is fine).
- After every task: `npx vitest run` and `npx tsc --noEmit` must pass. Do not commit.

---

### Task 1: shadcn init, Magic UI registry, token mapping, install primitives

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts` (`cn`)
- Create: `components/ui/*` for installed items
- Modify: `styles/globals.css`
- Modify: `tailwind.config.js`
- Modify: `package.json` / `package-lock.json` as the CLI requires
- Do not modify Hero, ProofStrip, Skills, WorkCard, WorkDetail, Contact, Header yet

**Interfaces:**
- Consumes: existing Tailwind v3 setup, inverted next-themes class strategy
- Produces: `components.json` with `@magicui` registry; `cn` from `@/lib/utils`; installed UI at `@/components/ui/...`; CSS variables so `bg-background`, `text-foreground`, `border-border`, `--color-background`, `--color-border` resolve on both themes

- [ ] **Step 1: Initialize shadcn on this existing app**

From the repo root, non-interactive. Prefer something equivalent to:

```bash
npx shadcn@latest init --template next --base radix --yes --force --no-reinstall
```

If the CLI prompts for paths: CSS = `styles/globals.css`, Tailwind config = `tailwind.config.js`, aliases `@/components` and `@/lib/utils`, RSC yes.

If init tries to migrate to Tailwind v4 or rewrite `app/` into a new template, **stop** with `NEEDS_CONTEXT`. Do not upgrade Tailwind.

- [ ] **Step 2: Register Magic UI**

`components.json` must include:

```json
"registries": {
  "@magicui": "https://magicui.design/r/{name}.json"
}
```

Keep `tailwind.config.js` as the Tailwind file. `aliases.utils` = `@/lib/utils`. `aliases.ui` = `@/components/ui`.

- [ ] **Step 3: Map tokens onto ink/paper (inverted)**

Preserve existing `globals.css` rules: `--accent-text`, `.heroButton`, `.btn-primary`, `.btn-secondary`, `.contactInput`, `.line-clamp-2/3`, `html { scroll-padding-top }`.

Add shadcn variables **inverted** relative to typical shadcn docs:

`:root` (charcoal / next-themes light):
- background ≈ `#211d1a` (ink)
- foreground ≈ `#ffffff`
- card ≈ `#211d1a`
- primary ≈ `#CA3E47`
- primary-foreground ≈ `#ffffff`
- border / input ≈ `rgba(255,255,255,0.12)` or equivalent HSL
- muted-foreground ≈ `#9ca3af`
- `--color-background` and `--color-border` aliases for Magic Card (Tailwind v4-style names on v3)

`.dark` (paper / next-themes dark):
- background ≈ `#f3ede4` (paper)
- foreground ≈ `#374151` (`gray-700`)
- card ≈ `#f3ede4`
- primary still `#CA3E47`
- border ≈ gray-300 equivalent
- muted-foreground ≈ `#4b5563`

Extend `tailwind.config.js` `theme.extend.colors` with shadcn semantic colors **without removing** `ink`, `inkDeep`, `paper`, `paperDeep`, `font-custom`, `font-mono-ui`.

- [ ] **Step 4: Install only these items**

```bash
npx shadcn@latest add button badge breadcrumb sheet field input textarea label sonner @magicui/magic-card @magicui/iphone @magicui/safari @magicui/animated-theme-toggler
```

Add `form` only if Field + react-hook-form still need the Form helper; otherwise skip Form to avoid extra abstraction. Do not add Card, Sidebar, Marquee, or unused Magic UI.

After add: read every new file under `components/ui/`. Fix import aliases. Do not leave `@/registry/...` imports.

Magic Card `gradientFrom` / `gradientTo` defaults are purple/pink — later tasks override them; do not change the installed default file unless it hardcodes those on the wrapper we will not control.

- [ ] **Step 5: Verify**

```bash
npx vitest run
npx tsc --noEmit
```

Expected: existing tests pass. Typecheck clean.

Do **not** commit.

Write the report to `.superpowers/sdd/task-1-report.md`.

---

### Task 2: WorkCard — Magic Card hover + Badge tags

**Files:**
- Modify: `components/WorkCard.tsx`
- Test: none new (existing `lib/__tests__/projects.test.ts` still pass)

**Interfaces:**
- Consumes: `MagicCard` from `@/components/ui/magic-card`, `Badge` from `@/components/ui/badge`, existing `WorkCardProps`
- Produces: same public `WorkCard` export and props; homepage and `/work` keep working as server pages importing it

- [ ] **Step 1: Make WorkCard a client component and wrap with MagicCard**

Add `"use client"`. Wrap the existing `<Link>` in `MagicCard` when `useReducedMotion()` from `framer-motion` is not true. If reduced motion, render the current Link-only card (no spotlight).

MagicCard props (verbatim):
- `gradientFrom="#CA3E47"`
- `gradientTo="#CA3E47"`
- `gradientColor` charcoal-tinted on the default theme, paper-tinted on `.dark` — keep subtle. Do not use `#9E7AFF` / `#FE8BBB`.
- `className` includes `h-full rounded-lg` so the lead/compact stretch layout still works

Move `rounded-lg overflow-hidden border ...` so the border is not doubled: MagicCard owns the animated border; Link inside keeps flex column layout, hover lift (`hover:-translate-y-0.5`), focus-visible outline `#CA3E47`.

- [ ] **Step 2: Replace stack chips with Badge**

The compact=false stack list currently uses custom `<li>` chips. Use `Badge variant="outline"` (or equivalent) for each of `project.stack.slice(0, 3)`. Keep the 3-item cap. Do not restyle the language mono label.

- [ ] **Step 3: Verify**

```bash
npx vitest run
npx tsc --noEmit
```

Do not commit. Report: `.superpowers/sdd/task-2-report.md`.

---

### Task 3: Work detail mockups + breadcrumbs

**Files:**
- Modify: `lib/projects.ts`
- Modify: `lib/__tests__/projects.test.ts`
- Modify: `components/WorkDetail.tsx`
- Modify: `app/writing/[slug]/page.tsx`
- Optional create: `components/WorkDeviceFrame.tsx` if WorkDetail would otherwise grow awkwardly

**Interfaces:**
- Consumes: `getWorkMockupKind(project)` (new), `Iphone`, `Safari`, `Breadcrumb*` primitives, existing `WorkCover`
- Produces:

```ts
export type WorkMockupKind = "iphone" | "safari" | "none";
export function getWorkMockupKind(project: ProjectType): WorkMockupKind;
```

Rules (verbatim):
- empty/`""` `img` → `"none"`
- `language === "iOS"` and has img → `"iphone"`
- `language === "NPM"` → `"none"`
- otherwise has img → `"safari"`

- [ ] **Step 1: Write failing tests**

Append to `lib/__tests__/projects.test.ts`:

```ts
import { getWorkMockupKind } from "../projects";

describe("getWorkMockupKind", () => {
  it("uses iPhone frames for iOS screenshots", () => {
    expect(getWorkMockupKind(getProject("daily-skyline")!)).toBe("iphone");
    expect(getWorkMockupKind(getProject("courai")!)).toBe("iphone");
  });

  it("uses Safari frames for web product screenshots", () => {
    expect(getWorkMockupKind(getProject("choose-game")!)).toBe("safari");
    expect(getWorkMockupKind(getProject("haberai")!)).toBe("safari");
  });

  it("skips device frames for npm packages and empty covers", () => {
    expect(getWorkMockupKind(getProject("codebrief")!)).toBe("none");
    expect(getWorkMockupKind(getProject("fireblog-app")!)).toBe("none");
  });
});
```

Run: `npx vitest run lib/__tests__/projects.test.ts`
Expected: FAIL because `getWorkMockupKind` is not exported.

- [ ] **Step 2: Implement `getWorkMockupKind`**

In `lib/projects.ts`, add the type and function per the rules above.

Run the same vitest command. Expected: PASS.

- [ ] **Step 3: Render mockups in WorkDetail**

Replace the current `<figure>` + `WorkCover` block when kind is iphone or safari:

- `iphone`: `<Iphone src={project.img} className="mx-auto w-full max-w-[280px] sm:max-w-[320px]" />` (decorative img alt is empty inside Iphone — keep an outer `<figure>` with `<figcaption className="sr-only">{project.name} screenshot</figcaption>`).
- `safari`: `<Safari imageSrc={project.img} url={hostname from project.url without protocol} className="w-full" />`.
- `none`: keep existing `WorkCover` figure (including typographic fallback when img is empty).

Do not pass Next/Image into Iphone/Safari — they take URL strings. Local paths like `/img/projects/courai.png` are valid `src`/`imageSrc`.

Replace the “← Work” text link with shadcn Breadcrumb: Home or Work → current project name (`aria-current="page"`). Keep it visually quiet (mono / small), accent on hover. Do not add a huge trail.

Stack pills on the detail header may stay as-is or use Badge — Badge is preferred for consistency with Task 2.

- [ ] **Step 4: Writing post breadcrumb**

In `app/writing/[slug]/page.tsx`, replace the large “back” pill with the same Breadcrumb pattern: Writing → post title. Do not restyle the article body.

- [ ] **Step 5: Verify**

```bash
npx vitest run
npx tsc --noEmit
```

Do not commit. Report: `.superpowers/sdd/task-3-report.md`.

---

### Task 4: Contact form Field primitives + Sonner

**Files:**
- Modify: `components/Contact.tsx`
- Modify: `app/providers.tsx`
- Leave EmailJS IDs and `onSubmit` behavior unchanged

**Interfaces:**
- Consumes: `Field`, `FieldGroup`, `FieldLabel`, `Input`, `Textarea`, `Button`, `toast` from `sonner`, existing `useForm`
- Produces: same EmailJS send payload; success toast “Sent. I will get back to you.”; error toast “Something went wrong. Please try again.”

- [ ] **Step 1: Swap toasts**

In `app/providers.tsx`, remove `ToastContainer` / `react-toastify`. Add shadcn `Toaster` from `@/components/ui/sonner` inside `ThemeProvider`. If `react-toastify` is unused afterward, remove it from `package.json` with npm uninstall.

- [ ] **Step 2: Rebuild the form with Field**

Keep `react-hook-form` + EmailJS. Layout with `FieldGroup` + `Field` (no `space-y-*`). Visible labels (not sr-only-only placeholders). Validation: `data-invalid` on `Field`, `aria-invalid` on the control, error text via `FieldDescription` or `FieldError` if the installed primitive has it.

Submit control: shadcn `Button` with existing `#CA3E47` primary token (should already be primary). Compose disabled + “Sending…” text; do not invent `isLoading` on Button. Keep `noValidate` on the form.

Do not change the left-column copy (email, location, résumé, social).

- [ ] **Step 3: Verify**

```bash
npx vitest run
npx tsc --noEmit
```

Do not commit. Report: `.superpowers/sdd/task-4-report.md`.

---

### Task 5: Header — Sheet menu + controlled theme toggler

**Files:**
- Modify: `components/Header.tsx`

**Interfaces:**
- Consumes: `Sheet`, `SheetContent`, `SheetTitle`, `SheetTrigger` (or Button trigger), `AnimatedThemeToggler` **controlled** via next-themes
- Produces: same `NAV_LINKS` / `SOCIAL_LINKS`; Escape still closes; body scroll lock can be Sheet’s; theme still uses next-themes

- [ ] **Step 1: Replace the custom mobile overlay with Sheet**

Desktop nav unchanged. On `md:hidden`, hamburger opens a `Sheet` (side right or left — pick right). Required: `SheetTitle` (sr-only “Menu” is fine). Render `NAV_LINKS` plus Appearance row. Close on navigate (pathname effect can call sheet onOpenChange). Keep skip-to-content link.

Do not set manual `z-index` on the sheet overlay.

- [ ] **Step 2: Replace ThemeToggle with controlled AnimatedThemeToggler**

```tsx
<AnimatedThemeToggler
  theme={resolvedTheme === "dark" ? "dark" : "light"}
  onThemeChange={setTheme}
  variant="circle"
  className="..."
/>
```

Do **not** use the uncontrolled mode (it writes localStorage itself and fights next-themes).

If `prefers-reduced-motion: reduce`, skip the view-transition duration (pass `duration={0}` or do not use VT — the installed component falls back when `startViewTransition` is missing; also pass `duration={0}` when `window.matchMedia("(prefers-reduced-motion: reduce)")` is true).

Swap lucide Moon/Sun inside the installed toggler **or** wrap so Header icons stay Heroicons — prefer editing the Header usage className rather than forking a huge file; if lucide remains only inside the installed UI file, that is acceptable.

Keep `aria-label` for the toggle.

- [ ] **Step 3: Verify**

```bash
npx vitest run
npx tsc --noEmit
```

Do not commit. Report: `.superpowers/sdd/task-5-report.md`.

---
