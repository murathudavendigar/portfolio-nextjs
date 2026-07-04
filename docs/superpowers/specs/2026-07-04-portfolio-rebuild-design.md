# Portfolio Rebuild — www.muratoncu.com

**Date:** 2026-07-04
**Status:** Approved
**Owner:** Murat Hüdavendigâr Öncü

## Goal

Full rebuild of the portfolio in the same repository. The site must itself demonstrate frontend craft: modern stack, distinctive dark motion-rich design, strong SEO for the new domain `www.muratoncu.com`. Content (projects, experience, blog posts) is ported and curated, not rewritten from scratch.

## Decisions Made

| Decision | Choice |
|---|---|
| Scope | Full rebuild, same repo, old code deleted |
| Design direction | Dark, motion-rich, single committed theme (no light mode) |
| Structure | Multi-page (home, projects + case studies, blog, about) |
| Blog | Kept as static markdown; MongoDB comments/likes dropped |
| Projects | Curated: originals featured, tutorial clones demoted to compact "Learning builds" strip |
| Contact | EmailJS client-side form kept |

## Stack

- Next.js 15, App Router, React 19, TypeScript strict
- Tailwind CSS 4
- `motion` (framer-motion v12 successor) for animation
- Blog: markdown in `content/blog/`, `gray-matter` + `react-markdown` + `remark-gfm` + `rehype-highlight`, statically rendered
- Data: typed TS files in `data/` (ported and curated)
- Deploy: Vercel, domain `www.muratoncu.com`

**Removed:** MongoDB and all blog API routes (comments, likes), `dev-console-kit`, `react-simple-typewriter`, `next-themes` (no theme toggle), snap-scroll single-page layout.

## Pages & Routes

```
/                    Hero, selected work (3–4 best), experience snapshot, contact CTA
/projects            Full grid; featured originals first, "Learning builds" strip below
/projects/[slug]     Case study: problem, stack, key decisions, screenshots, live + GitHub links
/blog                Post list
/blog/[slug]         Post page (markdown render, code highlighting)
/about               Story, full experience timeline, skills, photo
```

- Featured projects: Event Manager and E-Price E-Commerce lead. Clones (Amazon, Instagram, Netflix, ChatGPT) appear only in the compact strip — visible, not headline.
- Redirects in Next config: `/blogs/:slug` → `/blog/:slug`, `/blogs` → `/blog`.

## Design System

- **Canvas:** near-black (`#0a0a0b` range). Single warm accent color in the electric orange-red family (exact value chosen during build; replaces template red `#CA3E47`). Subtle grain/noise texture. No gradient washes.
- **Typography:** variable display grotesk for headings (Clash Grotesk / Space Grotesk class), clean sans for body, monospace for labels and meta. Oversized hero type with tight tracking. No typewriter effect.
- **Motion:** scroll-triggered staggered reveals (fire once), hover micro-interactions on links and project cards, page transitions via View Transitions API, subtle cursor-aware element in hero. Animations use `transform`/`opacity` only. `prefers-reduced-motion` fully respected (reveals become instant, cursor effects off).
- **Layout:** asymmetric grids, oversized section numbers, sticky side navigation on desktop, mobile-first responsive. Avoid centered-everything template composition.
- **Theme:** dark only. No toggle.

## SEO & Domain

- App Router `metadata` API per route: title, description, canonical `https://www.muratoncu.com`.
- OG images via `next/og`: static for top-level pages, dynamic for blog posts and project case studies.
- `app/sitemap.ts` and `app/robots.ts`.
- JSON-LD: Person schema on home, Article schema on blog posts.
- Old blog URL redirects (above) preserve any existing indexing.

## Quality Bar

- Lighthouse ≥ 95 for Performance, Accessibility, SEO on home page.
- Full keyboard navigation, visible focus states, alt text on all images.
- `next build` passes clean, zero TypeScript errors.
- Contact form has explicit success/error states (toast).
- Manual verification of every route, plus reduced-motion mode.

## Out of Scope

- Light mode / theme switching
- Blog comments, likes, or any database
- CMS integration
- Internationalization
