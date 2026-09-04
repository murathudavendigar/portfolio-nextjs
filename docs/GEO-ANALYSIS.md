# GEO-ANALYSIS.md

**Site:** https://www.muratoncu.com  
**Scope:** Live production vs local redesign (uncommitted)  
**Date:** 2026-09-04  
**Primary source:** [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (Search Central, updated 2026-06-29)

Scores below are **heuristics**, not Google-internal ranking data. Google’s position: optimizing for AI Overviews and AI Mode is still SEO. `llms.txt`, “chunking for AI,” and mention-farming are **not** ranking levers for Google Search.

---

## 1. GEO Readiness Score: 72/100

Weighted using the seo-geo criteria (citability 25, structure 20, multi-modal 15, authority 20, technical 20).

| Pillar | Score | Notes |
|---|---|---|
| Citability | 19/25 | About now has a 143-word “Who is Murat Öncü?” block in the 134–167 word citation band, in the first third of `/about`. Daily Skyline and Courai leads use “X is…”. Homepage hero is still a name lockup, not a definition. |
| Structural readability | 16/20 | About uses question H2s. Flagship writing already has H2s, tables, lists. Work case studies use labeled Problem / Approach / Tradeoffs / Outcome (first-hand, not numbered fluff). |
| Multi-modal | 8/15 | Real screenshots on work and writing. No product video, charts, or interactive tools on-domain. |
| Authority & brand | 12/20 | Person JSON-LD with `sameAs`, bylines linking to `/about`, dates on posts. No Wikipedia. LinkedIn still reads “aspiring Frontend Developer.” No meaningful Reddit/YouTube citation footprint. |
| Technical accessibility | 17/20 | Next.js App Router SSR for main copy. AI search crawlers allowed. `llms.txt` present (Google Search **ignores** it). Production is still the old `/blogs` IA — that gap is the real index problem. |

**After this pass (local):** AboutPage + ContactPage schema, richer Person (`knowsLanguage`, `hasOccupation`, `homeLocation`), Applebot + anthropic-ai in robots, writing byline → `/about`, product “X is…” copy, updated `llms.txt`.

---

## 2. Platform breakdown

| Surface | Score | Why |
|---|---|---|
| **Google AI Overviews** | 74 | Grounded in classic ranking. Unique case studies (Daily Skyline, Courai) beat commodity “7 tips” posts. Needs the new URLs indexed (`/work`, `/writing`). 308s from `/blogs` → `/writing` already exist locally. |
| **Google AI Mode** | 70 | Broader citation pool; freshness and entity clarity matter more than position. About Q&A + Person entity help. Do not fake `lastmod`. |
| **ChatGPT** | 58 | Wikipedia is ~48% of ChatGPT citations in published studies — this person is not on Wikipedia (correct; do not sockpuppet an article). GitHub + LinkedIn + Medium exist. |
| **Perplexity** | 55 | Heavy Reddit/Wikipedia. No genuine thread footprint to manufacture. App Store listings and the canonical site are the honest sources. |

AI Overviews and AI Mode cite the same URLs only ~14% of the time in published Ahrefs data — treat them as separate surfaces. Ranking well still feeds Overviews; Mode wants a clear entity and fresh, first-hand pages.

---

## 3. AI crawler access status

Live and local `robots.txt` allow `/` for `*`. Explicit allows (local, after this pass):

| Crawler | Status |
|---|---|
| GPTBot | allow |
| OAI-SearchBot | allow |
| ClaudeBot | allow |
| PerplexityBot | allow |
| Applebot | allow (added) |
| anthropic-ai | allow (added) |
| Google-Extended | allow (Gemini training/grounding opt-**in**) |
| CCBot | allowed via `*` (not blocked) |

User-triggered fetchers (ChatGPT-User, Google-Agent, NotebookLM) ignore robots.txt by design.

No AI-specific opt-out file is required for Search appearance. Snippet eligibility is the floor for AI features.

---

## 4. llms.txt status

| File | Live | Local |
|---|---|---|
| `/llms.txt` | Present, **stale** (`/blogs`, no iOS apps) | Updated: `/work`, `/writing`, Daily Skyline, Courai |
| `/llms-full.txt` | Absent | Absent (not added) |

**Google Search ignores `llms.txt`.** Mueller/Illyes and Google’s own AI optimization guide: it does not help or hurt Google rankings or AI-feature eligibility. Kept as low-cost optionality for coding agents and non-Google systems. No citation-ranking weight assigned.

---

## 5. Brand mention analysis

| Source | Presence | Confidence |
|---|---|---|
| Own site | Strong (name, TemCraft, Netherlands, stack) | High |
| LinkedIn | Profile exists; headline still “aspiring Frontend Developer” — **entity mismatch** vs the site | High |
| GitHub | `murathudavendigar`, 30 public repos | High |
| Medium / X | sameAs targets exist | High |
| App Store | Daily Skyline (`id6791111716`), Courai (`id6766915688`) | High |
| Wikipedia / Wikidata | None | High |
| YouTube | No meaningful mention graph | Medium |
| Reddit | No meaningful mention graph | Medium |

Ahrefs (Dec 2025) found brand mentions correlate ~3× more with AI citations than backlinks. **Do not** farm inauthentic mentions — Google’s guide rejects that. Legitimate moves: ship a real Daily Skyline / Courai walkthrough on YouTube if you actually want one; fix the LinkedIn headline so crawlers see the same person.

---

## 6. Passage-level citability

**Best block (local `/about`, 143 words — inside 134–167):**

> Murat Hüdavendigâr Öncü is a frontend developer, co-founder of TemCraft Tech, and a frontend instructor based in the Netherlands. He builds production interfaces in React, Next.js, and TypeScript, and he ships iOS apps with React Native and Expo — including Daily Skyline… 

Front-loaded on About (question H2). Homepage H1 remains “Hi, I am…” — that is a design choice, not a citation paragraph. Work pages now open with “Daily Skyline is…” / “Courai is…”.

Flagship writing (e.g. *Getting Started with Responsive Web Design*) already has a “What is …?” H2, a comparison table, and an updated date — good for AIO, do **not** rewrite for long-tail keyword lists (Google rejects that).

Python/Django archive posts are beginner notes; they should stay archived so they do not compete with the frontend entity.

---

## 7. Server-side rendering check

Main content is React Server Components (App Router). About, work, writing posts, sitemap, and JSON-LD render as HTML without client JS. Client islands: header, contact form, theme toggle, hero rings. AI crawlers that do not execute JS still see identity, case studies, and articles.

---

## 8. Top 5 highest-impact changes

**Done in this pass (local):**

1. Citable About Q&A (Who / What / Where) + extractable first paragraph.  
2. AboutPage + ContactPage JSON-LD; Person `knowsLanguage` / occupation / homeLocation; BlogPosting author `jobTitle`.  
3. Writing byline links to `/about` with a role label (Who created it).  
4. Robots: Applebot + anthropic-ai.  
5. `llms.txt` aligned to `/work` and `/writing` (optionality only).

**Still the real bottlenecks (you, not more on-page markup):**

1. **Deploy.** Live sitemap and `llms.txt` still advertise `/blogs`. Search is citing the old homepage FAQ. Until this branch is live, GEO work is invisible.  
2. **LinkedIn headline** — change “aspiring” to the same role as the site.  
3. **Do not create a Wikipedia page** for yourself. If one appears later from independent notability, fine.  
4. **Optional, honest:** a real product video for Daily Skyline or Courai (YouTube mentions correlate strongly; a fake mention campaign does not).  
5. Refresh writing only when the material actually changes — do not bump dates for freshness theatre.

---

## 9. Schema recommendations

Already in place or added:

- `ProfilePage` + `Person` + `Organization` (TemCraft) + `WebSite` on home  
- `SoftwareApplication` for iOS work; `CreativeWork` otherwise  
- `BlogPosting` with inline Person stub, dates, breadcrumbs  
- `AboutPage` / `ContactPage` (this pass)

**Do not add:** FAQPage schema for rich results (restricted; Google also says not to over-invest in structured data *for AI features*). Visible Q&A on About is enough. No RSL 1.0 — you want to be cited, not fenced.

---

## 10. Content reformatting suggestions

| Page | Action |
|---|---|
| `/about` | Done: “X is…” + question H2s. |
| `/work/daily-skyline`, `/work/courai` | Done: definition-first description. Keep Problem/Approach as first-hand case study, not a “10 tips” rewrite. |
| `/` | Leave the centered hero. Putting the old FAQ back on home would fight the design you restored. |
| Flagship writing | Keep “What is …?” H2s and tables. Link the byline (done). |
| Archive Python posts | Stay in `/writing/archive`. Thin beginner notes should not be the entity. |
| LinkedIn | Off-site: match job title and TemCraft / iOS facts to the site. |

RSL, WebMCP, and UCP are irrelevant for a personal portfolio.

---

## Live vs local (important)

| Asset | Production (2026-09-04) | Local redesign |
|---|---|---|
| IA | Single-page + `/blogs` | `/`, `/about`, `/work`, `/writing`, `/contact` |
| Sitemap | `/blogs/...` | `/work/...`, `/writing/...` |
| llms.txt | `/blogs`, no iOS | `/work`, Daily Skyline, Courai |
| Citable FAQ | On the **homepage** (“Who is Murat Öncü?”) | Moved to **About** (same job, without changing the hero) |

Google can only cite what is indexed. Ship this branch, then use Search Console URL inspection on `/about`, `/work/daily-skyline`, and `/writing`.
