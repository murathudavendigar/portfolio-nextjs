# Portfolio Redesign — muratoncu.com

**Owner:** Murat Hüdavendigâr Öncü
**Site:** https://www.muratoncu.com
**Date:** 2026-09-04
**Status:** Approved design, pre-implementation-plan
**Supersedes:** `docs/roadmap.md` §7 constraint 3 ("preserve visual system unless Phase 7 explicitly scopes a redesign") — this spec is that explicit scope. All other roadmap constraints (no fabricated proof, no i18n, owner commits, GSC/Cloudflare as default analytics) remain in force.

---

## 1. Why

An external AI-generated audit assessed the current site as generic and "junior" — a template-feeling single-page scroll with stock portfolio patterns (centered avatar hero, typewriter headline, pill-button anchor nav, uniform project cards, FAQ-accordion bio). The goal of this redesign is to make the site read as the work of a senior frontend engineer: content-led, specific, technically credible, and structured to support SEO/GEO discovery rather than working against it.

## 2. Positioning & voice

Lead narrative stays hiring-manager-first (per existing roadmap priority: hiring managers/tech leads → clients/founders → students), unchanged from `docs/roadmap.md` §2.

Working headline direction: *"I ship production Next.js apps — and teach the same stack I use to build them."* Replaces the generic "I build fast, modern web apps" line. Static, not looping — the typewriter effect is either removed or demoted to a secondary, non-LCP element. This also resolves the roadmap's outstanding P1.1/P1.2 items (typewriter breaking LCP) as a side effect of the redesign.

Voice rules across all rewritten copy:
- No unsupported adjectives ("fast," "modern," "scalable," "cutting-edge") without a concrete artifact backing the claim.
- Every claim traces to something real: a shipped product, a taught cohort, a published package, a specific technical decision.
- No fabricated metrics, testimonials, or user counts (roadmap constraint, unchanged).

## 3. Visual system — Editorial-technical

- **Accent:** keep `#CA3E47` as the single accent color, used sparingly (CTAs, active states, meta highlights) rather than decoratively.
- **Neutrals:** replace flat `#313131`/gray-200 pairing with a warmer near-black/near-white pair for better contrast and to shed the "default Tailwind dark" look.
- **Type:** larger scale contrast on display headings; body face stays Nunito Sans or is swapped during implementation if a better-licensed alternative fits; a monospace face (e.g. Geist Mono / JetBrains Mono) added for meta detail — stack tags, dates, case-study labels — to signal technical credibility without going full terminal aesthetic.
- **Motion:** Framer Motion retained but scoped down to purposeful entrance/hover motion. `BackgroundCircles` gets redesigned as a subtler texture or removed if it conflicts with CWV (ties into roadmap P1.5).
- **Layout:** move off centered-hero-with-pill-buttons and uniform card grids toward asymmetric layouts, real whitespace, and case-study-style preview cards. Each identifiable "template portfolio" tell gets individually redesigned, not just recolored.

## 4. Information architecture

Move from single-page anchor-scroll to a multi-page App Router structure:

| Route | Purpose |
|---|---|
| `/` | Lean landing: headline, proof strip, 2–3 featured case studies, one primary CTA. Not a dump of every section. |
| `/about` | Full bio/career narrative with teaching philosophy folded in (not a separate teaching route). |
| `/work` | Case study index. |
| `/work/[slug]` | Deep case studies (reframed from current `/projects/[slug]`). |
| `/writing` | Flagship blog posts (React/Next.js/production topics). |
| `/writing/archive` | Beginner Python/Django series — kept live, clearly labeled, deprioritized out of main nav flow. Preserves existing indexed SEO equity; no deletions. |
| `/contact` | Dedicated contact page (not just an anchor). |

Old `/projects/[slug]` URLs get 301 redirects to `/work/[slug]` in `next.config.js` to protect existing indexed equity. Old in-page anchors (`#about`, `#experience`, etc.) redirect or degrade gracefully to their new routes.

## 5. Content strategy

- **Case studies:** rebuilt on the roadmap's own template (Problem → Approach → Stack → Tradeoffs → Outcome), currently defined but unused. Priority order per roadmap §4 Phase 3: codebrief, AI Resume Doctor, then 1–2 more. Content for each gathered via a structured interview pass during implementation — no invented detail.
- **About:** rewritten as a real narrative, teaching positioned as a differentiator rather than FAQ trivia. Current `faqs` accordion content either folds into prose or is cut.
- **Blog split:** flagship posts (Phase 5 themes from roadmap: App Router architecture, reviewing student PRs, shipping codebrief/Dev Console Kit, teaching frontend in production style, a performance case study) live in `/writing` main nav. Existing beginner Python/Django/JS-fundamentals posts move to `/writing/archive`, honestly framed ("early learning notes"), still indexed.
- **Future backlog (not in this spec's active scope):** two existing iOS apps to be added to `/work` as case studies after this redesign ships. Follows the same case-study template and interview-gathering approach once initiated.

## 6. Technical approach

- Framework stays Next.js App Router — no framework change.
- Reuse existing data/schema plumbing: `lib/projects.ts`, `lib/blog.ts`, `lib/schema.ts`, `lib/site.ts` — extend for new routes rather than rewrite, since July's SEO pass already made this solid.
- Current scroll-section components (`Hero`, `About`, `Experience`, `Projects`, `Contact`) get rebuilt as page-level sections per their new route rather than anchor-linked blocks on one page.
- `data/projects.json` gains fields needed for the case-study template (problem/approach/tradeoffs/outcome) where not already present.
- Redirects for old project URLs and anchor patterns added to `next.config.js`.
- Metadata/JSON-LD extended per new route: `ProfilePage` schema stays on `/`, `Article` schema stays per post, breadcrumb schema added for the deeper nav (`/work/[slug]`, `/writing/[slug]`).

## 7. SEO / GEO carry-forward

Multi-page structure is a net SEO/GEO improvement over the current single crowded homepage: per-page metadata targeting, deeper crawlable case-study content (more citable passages for AI answer engines), breadcrumb navigation, sitemap and IndexNow submission updated for new URLs, `llms.txt` updated to reflect the new structure. 301 redirects preserve existing indexed equity — this is additive, not a start-from-zero re-launch.

## 8. Non-goals

- No fabricated testimonials, metrics, or user counts.
- No i18n (prior decision stands — see project memory `seo-patch-over-rebuild`).
- No CMS or backend/database migration — content stays as markdown (blog) and structured data files (projects, experience).
- No auto-commit/push — owner commits manually (existing constraint).
- Roadmap Phase 0 (GSC hygiene) and Phase 4 (LinkedIn distribution) are unaffected by this spec and continue in parallel.

## 9. Open items for the implementation plan

- Structured interview to gather real case-study content (problem/approach/tradeoffs/outcome) per featured project, before `/work/[slug]` pages can be finalized.
- Final call on body/display font pairing (keep Nunito Sans vs swap) — can be decided visually during implementation.
- Decide fate of `BackgroundCircles` (redesign vs remove) based on CWV impact once measured.
- iOS apps case studies — separate follow-up scope after this redesign ships.

## Related docs

- `docs/roadmap.md` — phased roadmap this spec supersedes §7.3 on
- `docs/superpowers/plans/2026-07-29-seo-audit-fixes.md` — completed SEO implementation
- `docs/superpowers/specs/2026-07-05-seo-patch-design.md` — prior SEO design notes
- `docs/superpowers/specs/2026-07-04-portfolio-rebuild-design.md` — prior rebuild design notes
- `lib/site.ts`, `lib/schema.ts`, `lib/projects.ts`, `lib/blog.ts` — data/schema plumbing this spec extends
