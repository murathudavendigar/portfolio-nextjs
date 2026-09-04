# Portfolio Roadmap — muratoncu.com

**Owner:** Murat Hüdavendigâr Öncü  
**Site:** https://www.muratoncu.com  
**Last updated:** 2026-07-29  
**Status:** Post–SEO foundation. Focus shifts from technical SEO to discovery, differentiation, and conversion.

---

## 1. Purpose

This roadmap covers what to do **after** the July 2026 SEO audit and implementation pass. Technical crawlability, schema, content depth, and project URL surface are largely in place. The next goal is dual:

| Goal | Meaning |
|------|---------|
| **Be found** | Appear in search, LinkedIn, and peer discovery for the right intents |
| **Stand out** | Be memorable to hiring managers, clients, and students — not another template portfolio |

**Non-goals for this roadmap**

- More schema / FAQ / HowTo markup for its own sake
- Fabricated testimonials, metrics, or case-study numbers
- A full visual redesign unless called out as a scoped phase
- Mandatory Vercel Analytics while Google Search Console + Cloudflare are in use

---

## 2. Positioning (north star)

**Working one-liner (use until replaced):**

> I ship Next.js products and teach the same stack I use in production.

**Primary audiences (in priority order)**

1. **Hiring managers / tech leads** — React / Next.js roles (NL / EU / remote)
2. **Clients / founders** — product UI, MVPs, frontend ownership (TemCraft-adjacent)
3. **Students / learners** — instructor credibility, teaching artifacts

**Search / discovery intents to own**

| Intent cluster | Primary URL(s) |
|----------------|----------------|
| Frontend / Next.js developer in the Netherlands | `/`, About |
| Production case studies (specific products) | `/projects/[slug]` |
| Teaching / mentoring frontend | About + 1–2 dedicated posts |
| Tooling (codebrief, Dev Console Kit) | Project pages + npm |

Avoid spreading thin across “full-stack everything.” Backend (Django / .NET) stays supporting context, not the hero message.

---

## 3. What’s already done (baseline)

Completed in the July 2026 SEO pass (see `docs/superpowers/plans/2026-07-29-seo-audit-fixes.md`):

- [x] `ProfilePage` schema uses `mainEntity` (validate fix in GSC when crawl refreshes)
- [x] Homepage / layout OG + Twitter images
- [x] Dedicated 404 with proper metadata
- [x] Server-rendered projects; standalone `/projects/[slug]` routes + sitemap
- [x] Blog posts expanded on-site (canonical on muratoncu.com, not Medium abridged)
- [x] Experience bullets de-genericized (no invented facts)
- [x] Self-hosted Nunito Sans via `next/font`
- [x] Image loading / dimensions polish on motion images
- [x] IndexNow key + submission path
- [x] robots / llms.txt / security headers (CSP later removed when it broke client JS)
- [x] Persona-aware CTAs and dark-mode a11y improvements
- [x] Error boundaries / UX error pages

**Explicitly deferred earlier (still valid backlog)**

- Privacy policy
- Real testimonials (permission-based only)
- YouTube / video lessons
- Self-hosted blog cover images (needs real assets)

---

## 4. Phased roadmap

### Phase 0 — Stabilize & measure (Week 1)

**Outcome:** Trust the data you already have; close open Search Console loops.

| ID | Task | Why | Done when |
|----|------|-----|-----------|
| P0.1 | GSC → ProfilePage rich result → **Validate fix** / request indexing for `/` | Clears stale `mainEntity` warning from pre-fix crawl | Validation passes or new crawl shows `mainEntity` |
| P0.2 | Review GSC **Coverage / Pages**, **Experience → CWV** (if enough traffic) | Separates lab PageSpeed noise from field reality | Notes written: which URLs need work |
| P0.3 | Confirm Cloudflare Web Analytics on/off; decide: keep CF only vs add GA4 later | Avoid redundant tools; GSC ≠ product analytics | Written decision in this file’s changelog |
| P0.4 | Spot-check top project URLs in GSC URL Inspection | New `/projects/*` surface must be indexed | At least featured projects “URL is on Google” or submitted |

**Skip unless needed:** Vercel Analytics — optional later for deploy-correlated CWV, not required for SEO ops.

---

### Phase 1 — Core Web Vitals & first impression (Week 1–2)

**Outcome:** Reliable LCP in lab + lower CLS; hero communicates instantly.

| ID | Task | Why | Done when |
|----|------|-----|-----------|
| P1.1 | Stop LCP breakage from Hero typewriter | PageSpeed `NO_LCP` / unstable LCP candidate when `h1` loops | Lab run shows a real LCP element (image or static headline) |
| P1.2 | Static hero headline = positioning one-liner; typewriter optional below fold or delayed | Stand-out + performance | First viewport readable without JS animation |
| P1.3 | Strengthen LCP candidate: larger profile image and/or `fetchPriority="high"` | Clear contentful paint target on mobile | Lighthouse LCP no longer `NO_LCP` |
| P1.4 | Reduce CLS (target **&lt; 0.1**) — header slide-in, font, typewriter width jumps | Current lab CLS ~0.167 | Lab CLS ≤ 0.1 on mobile emulation |
| P1.5 | Soften or remove heavy `BackgroundCircles` work on low-end mobile if TBT/INP suffers | Lab Slow 4G is noisy; still worth checking | No regression in FCP; motion still acceptable |

**Acceptance:** Re-run [PageSpeed Insights](https://pagespeed.web.dev/) on `/` (mobile). LCP reports a value; CLS improved.

---

### Phase 2 — Conversion & clarity (Week 2–3)

**Outcome:** A visitor knows who you are for and what to do next in &lt;10 seconds.

| ID | Task | Why | Done when |
|----|------|-----|-----------|
| P2.1 | Hero CTA group: primary **Contact / Hire me**, secondary **View work** or **Teaching** | Template portfolios bury the ask | One primary CTA above the fold |
| P2.2 | Explicit “open to” line (e.g. freelance · full-time NL/EU · teaching) | Reduces ambiguity for recruiters | Visible on `/` or About |
| P2.3 | Optional **Cal.com** (or similar) 15-min intro link next to contact form | Lower friction than form-only | Link live; form still works |
| P2.4 | Contact section: short copy per persona (hire / project / students) | Matches prior CTA work; keep honest | Copy reviewed, no fake scarcity |
| P2.5 | Ensure mailto + form failure modes are clear (EmailJS env missing, etc.) | Trust | Toast / fallback to email always possible |

---

### Phase 3 — Case studies that stand out (Week 3–5)

**Outcome:** `/projects/[slug]` pages sell judgment, not just screenshots.

**Priority projects (suggested order)**

1. **codebrief** — npm tooling, clear developer audience  
2. **AI Resume Doctor** — live product, “try it” CTA  
3. **HaberAI** or **Money Guardian** — product depth  
4. **Dev Console Kit** — teaching + tooling crossover  

| ID | Task | Why | Done when |
|----|------|-----|-----------|
| P3.1 | Case study template: Problem → Approach → Stack → Tradeoffs → Outcome → Links | Differentiates from carousel blurbs | Template used on ≥2 pages |
| P3.2 | Host key screenshots on `muratoncu.com` (reduce hotlinked OG/GitHub images) | Reliability + CWV + brand | Priority projects use local `/img/projects/...` |
| P3.3 | “Live demo” / npm / GitHub CTAs above the fold on each case study | Discovery → action | Primary CTA works on mobile |
| P3.4 | Internal links: About ↔ relevant projects ↔ 1 related blog post | Crawl paths + topical strength | Each featured project has ≥1 contextual internal link |
| P3.5 | Do **not** invent metrics; use qualitative outcomes and real constraints | Integrity (owner constraint) | No fake % / revenue / user counts |

---

### Phase 4 — Be found outside Google (ongoing, start Week 2)

**Outcome:** Distribution system, not one-off posts.

| ID | Task | Cadence | Done when |
|----|------|---------|-----------|
| P4.1 | LinkedIn: short post → problem + 1 visual → link to case study or blog | 1× / week | 4 weeks logged |
| P4.2 | Cross-link **TemCraft** ↔ personal site (footer or About, consistent name/title) | Once + keep updated | Both sites reference each other |
| P4.3 | GitHub profile README: one-liner + featured repos + site URL | Once | README live |
| P4.4 | X / Medium: point canonical long-form to muratoncu.com | When publishing | Bios + post footers consistent |
| P4.5 | Selective niche lists (NL/EU freelancers, educator directories) — no spam farms | As found | 2–3 quality listings max initially |

**Rule:** Ship a case study or post *before* amplifying it. Distribution without a sharp URL wastes reach.

---

### Phase 5 — Content strategy (Month 2)

**Outcome:** Blog serves hiring and teaching intents, not only beginner SEO volume.

| ID | Task | Why | Done when |
|----|------|-----|-----------|
| P5.1 | Publish 4–6 “money” posts aligned to your work (examples below) | Matches audience 1–2 | 4 posts live with internal links |
| P5.2 | Hub or clear nav treatment for older Python/Django beginner series | Avoid competing with primary positioning | Hub page or tagged section + honest framing |
| P5.3 | Add RSS (`/feed.xml` or Atom) | Subscribers + secondary discovery | Feed validates; linked in footer/`llms.txt` if useful |
| P5.4 | Refresh titles/meta for queries with impressions but low CTR (from GSC) | Free wins | 3+ titles improved after GSC review |

**Suggested post themes (write from real experience)**

- How you structure a Next.js App Router product
- What you look for when reviewing student PRs
- Lessons from shipping codebrief / Dev Console Kit
- Teaching frontend the way you ship in production
- Migrating or simplifying a real UI performance issue (tie to Phase 1)

---

### Phase 6 — Proof & trust (Month 2–3)

**Outcome:** Believable authority without fabricated social proof.

| ID | Task | Why | Done when |
|----|------|-----|-----------|
| P6.1 | Privacy policy (EmailJS / contact form / analytics if any) | Deferred; needed for trust & compliance posture | `/privacy` live, linked in footer |
| P6.2 | 1–2 real testimonials or LinkedIn recommendations (written permission) | Stand-out; deferred until real | Quoted with name/role/link |
| P6.3 | Instructor proof block: curriculum themes, PR-review style, anonymized student outcomes | Unique vs typical portfolios | Section on About or dedicated `/teaching` |
| P6.4 | Optional: short loom/YouTube only if you will maintain it | Deferred; don’t force empty video SEO | At least 1 durable video or skip |

---

### Phase 7 — Polish & optional growth (Month 3+)

| ID | Task | Notes |
|----|------|-------|
| P7.1 | Light visual differentiation (typography / hero composition) without full redesign | Avoid “generic JS portfolio” feel; keep brand colors |
| P7.2 | GA4 or Plausible **only if** you need conversion events (form submit, Cal click) | Not a substitute for GSC |
| P7.3 | Vercel Analytics **optional** for RUM CWV tied to deploys | Skip if CF + GSC CWV enough |
| P7.4 | Self-host blog cover images | Needs real artwork per post |
| P7.5 | Revisit CSP carefully (previously removed) | Security without breaking EmailJS / theme / motion |
| P7.6 | Quarterly SEO hygiene: sitemap lastmod, broken links, IndexNow on major publishes | Ops, not a project |

---

## 5. Priority matrix (this month)

Do in this order unless a blocker appears:

```
P0 GSC validate + index check
 → P1 LCP/CLS + static hero message
 → P2 Primary CTA + “open to”
 → P3 Two deep case studies (codebrief, AI Resume Doctor)
 → P4 LinkedIn weekly loop
 → P5 First “money” blog post
 → P6 Privacy + first real testimonial when available
```

---

## 6. Success metrics

Evaluate after **6–8 weeks**, not after one deploy.

| Signal | Source | Target (directional) |
|--------|--------|----------------------|
| Branded + role queries rising | GSC | Upward trend on impressions for name + “Next.js” / “frontend” |
| Project URLs indexed | GSC | Featured `/projects/*` indexed |
| ProfilePage rich result clean | GSC | No `mainEntity` critical issue |
| Lab LCP present; CLS &lt; 0.1 | PageSpeed (mobile) | No `NO_LCP`; CLS improved |
| Inbound conversations | Email / Cal / LinkedIn | Qualitative: more relevant inbound |
| Case study engagement | LinkedIn + Cloudflare (if on) | Posts linking to case studies get meaningful profile clicks |

Do not optimize for vanity PageSpeed score alone.

---

## 7. Constraints & principles

1. **No fabricated proof** — no fake testimonials, user counts, or revenue.
2. **Site is canonical** — long-form lives on muratoncu.com; Medium/X are distribution.
3. **Preserve visual system** unless Phase 7 explicitly scopes a redesign — colors `#CA3E47` / `#313131`, motion stack stays unless it hurts CWV.
4. **Owner commits** — agents/docs should not assume auto-commit/push.
5. **Tools** — Google Search Console + Cloudflare are the default stack; add analytics only with a clear question to answer.
6. **One sharp position** beats five diluted ones.

---

## 8. Suggested weekly rhythm

| Day | Focus |
|-----|--------|
| Mon | Ship or update one case-study section / fix one CWV item |
| Wed | LinkedIn post → link to a live URL on the site |
| Fri | GSC 15-minute review (queries, pages, enhancements) |
| Monthly | One substantial blog post or major case-study upgrade |

---

## 9. Open decisions (fill in as you go)

| Decision | Options | Choice | Date |
|----------|---------|--------|------|
| Product analytics | Cloudflare only / +GA4 / +Plausible / +Vercel | _TBD_ | |
| Booking link | Cal.com / other / form-only | _TBD_ | |
| Teaching URL | About section vs `/teaching` | _TBD_ | |
| Hero one-liner final copy | Draft in §2 vs rewrite | _TBD_ | |
| First two case studies | codebrief + AI Resume Doctor vs other | _TBD_ | |

---

## 10. Changelog

| Date | Change |
|------|--------|
| 2026-07-29 | Initial roadmap after SEO foundation + PageSpeed `NO_LCP` discussion |

---

## Related docs

- `docs/superpowers/plans/2026-07-29-seo-audit-fixes.md` — completed SEO implementation plan  
- `docs/superpowers/specs/2026-07-05-seo-patch-design.md` — earlier SEO design notes  
- `lib/site.ts` — canonical site metadata  
- `lib/schema.ts` — JSON-LD graphs  
