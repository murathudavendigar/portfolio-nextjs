# Portfolio project scan

**Scope:** Read-only scan of 39 folders in `Desktop/my_projects`  
**Compared against:** Selected / Earlier lists in this site (`data/projects.json`)  
**Date:** 2026-09-06  
**Method:** Local filesystem — `package.json` / `app.json` / README / git last commit. No repos were modified.

Scores below are **portfolio-fit heuristics** (originality, shipped status, depth, recency, fit with “I ship Next.js / iOS products and teach the same stack”). They are not quality scores of the code in isolation.

---

## Headline

**Add Choose Game this week.** It is live at [choosegame.muratoncu.com](https://choosegame.muratoncu.com), original (pick the wrong answer), bilingual, updated 2 Sep 2026 — and it is not on the portfolio. That is the single highest-value site change.

After that, tighten Selected to six case studies and wait on Capoline until it is in the App Store.

| Metric | Value |
| --- | --- |
| Folders scanned | 39 |
| Worth a portfolio decision | 14 |
| Add now | 1 (Choose Game) |
| Demote from Selected | 2 (Event Manager, E-Price) |

---

## 1. Recommended Selected lineup

Hiring managers skim. Nine selected cards dilute Daily Skyline and Courai. Six case studies is enough; Earlier can hold the rest.

| Slot | Project | Why it earns the slot | Action |
| --- | --- | --- | --- |
| 1 | Daily Skyline | Shipped iOS original. Lead with this. | Keep |
| 2 | Courai | Shipped iOS original with a real problem. | Keep |
| 3 | Choose Game | Live original game on your domain. Missing today. | **Add** |
| 4 | Money Guardian | Production Next.js PWA you use yourself. | Keep |
| 5 | HaberAI | Production Next.js PWA with AI + push. | Keep |
| 6 | codebrief | Published CLI. Covers tooling + teaching. | Keep |

Optional seventh: AI Resume Doctor (AI web) or Dev Console Kit (teaching). Do not keep both plus Event Manager plus E-Price in Selected.

---

## 2. Add now: Choose Game

Reverse trivia PWA: wrong answer scores, right answer costs a life.

- **Live:** [choosegame.muratoncu.com](https://choosegame.muratoncu.com)
- **Folders:** `choose-game/choose-game-web` (44 commits) and `choose-game/choose-game-mobile` (13 commits)
- **Last activity:** 2026-09-02
- **Stack:** Next.js 16, React 19, Supabase, PWA, Expo
- **Note:** Older `choose/` and `choose-app/` folders are superseded prototypes. Do not list them as separate products.

Write a case study in the same shape as Daily Skyline (problem / approach / tradeoffs / outcome), plus a screenshot.

---

## 3. Add after App Store: Capoline

Guitar chord importer: in-app browser, site-specific extractors, transpose, setlists, local-first sync, Groq cleanup.

- **Folder:** `capoline`
- **Last activity:** 2026-08-10
- **Stack:** Expo / React Native, TypeScript, Supabase
- **Shipped:** Not in the App Store yet

Strong third iOS story next to Skyline and Courai — but a portfolio card without a store listing or public demo undercuts the “I ship” claim. Wait until it is installable.

---

## 4. What to do with each product

| Project | Folder | Kind | Score | On site now | Shipped | Last activity | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Daily Skyline | `daily-skyline-ios` + web | iOS + Next.js | 10 | Selected | App Store + dailyskyline.muratoncu.com | 2026-09-04 | Keep selected |
| Courai | `Courai` + `courai-website` | iOS + Next.js | 9 | Selected | App Store + courai.vercel.app | 2026-08-11 | Keep selected |
| Choose Game | `choose-game` (web + mobile) | PWA + Expo | 9 | Missing | choosegame.muratoncu.com | 2026-09-02 | **Add now** |
| Money Guardian | `money-guardian` | Next.js PWA | 8 | Selected | moneyguardian.muratoncu.com | 2026-07-17 | Keep selected |
| HaberAI | `ai-news-digest` | Next.js PWA | 8 | Selected | haberaii.vercel.app | 2026-07-30 | Keep selected |
| Capoline | `capoline` | Expo / RN | 8 | Missing | Not in App Store yet | 2026-08-10 | Add after ship |
| codebrief | `npm-packages/codebrief` | npm CLI | 8 | Selected | npmjs.com/package/codebrief | 2026-02-23 | Keep selected |
| AI Resume Doctor | `ai-resume-doctor` | React | 7 | Selected | ai-resume-doctor.vercel.app | 2026-07-04 | Keep (optional 7th) |
| Universal AI Gateway | `universal-ai-gateway` | TS monorepo / MCP | 7 | Missing | Local / GitHub only | 2026-07-17 | Add after live demo |
| AutoInvoice Pro | `autoinvoice-pro` | Electron | 7 | Missing | macOS/Windows builds (local) | no git | Add after public page |
| Dev Console Kit | `npm-packages/dev-console-kit` | npm | 7 | Selected | npmjs.com/package/dev-console-kit | 2026-01-22 | Keep (or fold into About) |
| Expat Assistant NL | `expat-assistant-nl` | Next.js | 6 | Missing | Unclear / not obviously live | 2025-11-06 | Wait |
| Event Manager | `calendar-app` | Next.js | 5 | Selected | event-manager-jp.vercel.app | 2025-08-10 | Move to Earlier |
| E-Price | `react-ecommerce` | React + Firebase | 5 | Selected | eprice-ecommerce.vercel.app | 2024-08-28 | Move to Earlier |

### Why (one line each)

- **Daily Skyline** — Strongest piece. Original daily puzzle, live listing, recent 1.16.0, 116 commits on the iOS app.
- **Courai** — Shipped CBT product with Supabase, RevenueCat, 179 commits. Keep as the social-anxiety case study.
- **Choose Game** — Biggest gap. Original inverted-quiz, live custom domain, bilingual, leaderboard, updated this week. Not on the site.
- **Money Guardian** — Original finance engine (safe-to-spend), Supabase RLS, i18n. You actually use it.
- **HaberAI** — Original news product: RSS, Groq/Gemini summaries, push, Upstash. `news-app/` is a leftover scaffold — ignore it.
- **Capoline** — Original chord-sheet importer with WebView extract, transpose, local-first Supabase sync, AI cleanup. Add the day it ships, not before.
- **codebrief** — Published tooling. Fits instructor + production-stack story. Keep one npm slot, not two if you tighten.
- **AI Resume Doctor** — Live Gemini/Groq CV tool. Worth keeping if you want an AI-web case; weaker than the shipped apps.
- **Universal AI Gateway** — Real systems work (routing, providers, MCP, operator UI). Strong for a tech-lead reader, weak as a public demo until there is a live console.
- **AutoInvoice Pro** — Shipped desktop utility with regex PDF rename and a license gate. Unique vs the rest of the site, but no repo/history and no public download page.
- **Dev Console Kit** — Teaching artifact. Keep if instructor work is a hiring target; otherwise fold into About instead of a project card.
- **Expat Assistant NL** — Original NL-expat idea (tasks, docs, map, i18n). 13 commits and deployment docs that read unfinished. Polish and deploy before featuring.
- **Event Manager** — Thin: 11 commits, stock create-next-app README. Fine in Earlier work, not in the hero row.
- **E-Price** — Complete shopper + admin demo. Honest as a course-era build. Move to Earlier so Selected stays product work.

---

## 5. Do not put on the site

### Legal / trust risk

`my-lead-scraper` is an Electron app that scrapes Google Maps (package copy also mentions LinkedIn Sales Navigator). Hiring managers will read that as ToS-hostile. Keep it private.

### Clones, tutorials, scaffolds

Amazon / Instagram / Netflix / ChatGPT clones are already Earlier — leave them there.

Skip: `lms-tutorial`, `mobile_movie_app`, `eurotech-store` (course `n09_performance`), `test-app`, `news-app`, `my-local-copilot`, `chrono-calc`, `day-calculator`, `ai-game`, `smart-daily-planner`, `love`.

### Company marketing sites

`temcraft-tech`, `new-website`, `website`, `temcraft-template` belong in Experience (TemCraft Tech), not as work cards. Same for `portfolio-nextjs` itself.

### Duplicate folders

Treat Daily Skyline, Courai, Choose, and HaberAI as **one product each**. Do not list iOS + web + engine as three cards.

---

## 6. Folder mix in `my_projects`

Count of top-level folders by detected stack. Source: `package.json` / `app.json` scan, 6 Sep 2026. “Other” includes Electron, Express, HTML, monorepos, and template kits.

| Stack | Folders |
| --- | ---: |
| Next.js | 18 |
| Expo / React Native | 7 |
| React SPA | 6 |
| Other / mixed | 8 |

---

## 7. All 39 folders

| Folder | Kind | Activity | What it is | Portfolio note |
| --- | --- | --- | --- | --- |
| `ai-game` | Expo toy | 5 files, no git | Neon Dash obstacle game | Skip |
| `ai-news-digest` | Next.js PWA | 58 commits, Jul 2026 | HaberAI — already on site | Keep as HaberAI |
| `ai-resume-doctor` | React | 57 commits, Jul 2026 | Live Gemini CV tool | Keep |
| `autoinvoice-pro` | Electron | No git, v1.3.0 | PDF invoice batch rename | Wait |
| `brawl-stars-api-react` | React | 42 commits, Feb 2026 | API demo — already Earlier | Skip |
| `calendar-app` | Next.js | 11 commits, Aug 2025 | Event Manager on site | Demote |
| `capoline` | Expo | 4 commits, Aug 2026 | Chord-sheet importer | Wait to ship |
| `choose` | Next.js | 2 commits, Apr 2025 | Old Choose prototype | Ignore — superseded |
| `choose-app` | Expo | 1 commit, Aug 2025 | Old Choose mobile | Ignore — superseded |
| `choose-game` | Web + Expo | Web 44 / iOS 13, Sep 2026 | Live inverted quiz | **Add now** |
| `chrono-calc` | Next.js | 1 commit, 2024 | TimeMaster date tools | Skip |
| `Courai` | Expo | 179 commits, Aug 2026 | App Store CBT app | Keep |
| `courai-website` | Next.js | 36 commits, May 2026 | Marketing + admin | Same product as Courai |
| `daily-skyline` | TS engine | 43 commits, Jul 2026 | Shared puzzle engine | Same product |
| `daily-skyline-ios` | Expo | 116 commits, Sep 2026 | App Store client | Keep |
| `daily-skyline-web` | Next.js | 30 commits, Aug 2026 | Marketing site | Same product |
| `day-calculator` | Next.js | 1 commit, 2024 | Date calculator | Skip |
| `e-commerce-project` | CRA | 29 commits, 2024 | Older shop sibling | Skip |
| `eshop-ecommerce` | React | 47 commits, 2022 | Very old shop | Skip |
| `eurotech-store` | Next.js | No git | Course folder `n09_performance` | Skip |
| `expat-assistant-nl` | Next.js | 13 commits, Nov 2025 | NL expat helper | Wait |
| `lms-tutorial` | Next.js | 2 commits, 2024 | Tutorial clone | Skip |
| `love` | HTML | No git | Personal page | Skip |
| `mobile_movie_app` | Expo | 3 commits, 2025 | Movie-app tutorial | Skip |
| `money-guardian` | Next.js | 80 commits, Jul 2026 | Finance PWA on site | Keep |
| `my-infos-backend` | Express | No git | Old portfolio REST API | Skip — site is static JSON now |
| `my-lead-scraper` | Electron | 41 commits, Apr 2026 | Maps lead scraper | Do not feature |
| `my-local-copilot` | Next.js | 1 commit, scaffold | create-next-app leftover | Skip |
| `new-website` | Next.js | 7 commits, 2024 | TemCraft site | Company site, not a case study |
| `news-app` | Next.js | 1 commit, scaffold | Unused HaberAI stub | Skip |
| `npm-packages` | folder | codebrief + dev-console-kit | Already on site | Keep those two |
| `portfolio-nextjs` | Next.js | 97 commits, today | This site | Not a work card |
| `react-ecommerce` | CRA | 46 commits, 2024 | E-Price on site | Demote |
| `smart-daily-planner` | Expo | 1 commit, Aug 2025 | Planner skeleton | Skip |
| `temcraft-tech` | Next.js | 7 commits, 2024 | Company marketing | Skip as a project card |
| `temcraft-template` | HTML kit | No git | Bought/template kit | Skip |
| `test-app` | Next.js | 1 commit, scaffold | create-next-app | Skip |
| `universal-ai-gateway` | Monorepo | 19 commits, Jul 2026 | MCP AI gateway | Wait for a live demo |
| `website` | Next.js | 2 commits, 2024 | TemCraft i18n site | Skip |

---

## 8. Suggested next step (when you want implementation)

1. Add Choose Game as selected with a four-part case study and a screenshot.
2. Move Event Manager and E-Price to Earlier.
3. Keep AI Resume Doctor or Dev Console Kit as a seventh card only if you still want an AI-web or teaching artifact.
4. Do not add Capoline, AutoInvoice, or the gateway until each has a public URL or store listing.
