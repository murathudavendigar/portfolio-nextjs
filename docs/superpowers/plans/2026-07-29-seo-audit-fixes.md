# SEO Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix every actionable finding from the 2026-07-29 `/seo audit` of www.muratoncu.com (schema, crawlability, performance, content depth, entity authority) without fabricating data (no invented testimonials, metrics, or legal text — those were explicitly deferred by the site owner).

**Architecture:** This is a static Next.js 15 App Router portfolio + Markdown blog (no CMS/DB). Fixes are mostly small, independent edits across `lib/`, `components/`, `data/`, `app/`, and `content/blog/*.md`. No new runtime dependencies except `next/font/google` (already ships with Next.js).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Vitest, Framer Motion, gray-matter (Markdown frontmatter).

## Global Constraints

- No fabricated testimonials, client quotes, or outcome metrics (site owner explicitly deferred — use concrete/specific language instead, never invented numbers).
- No YouTube content and no privacy policy in this pass (deferred by owner).
- Medium duplicate-content decision: **site is canonical** — the 8 posts that say "read the full version on Medium" get expanded to be the complete, non-abridged version on-site; remove the Medium-abridged framing.
- Do **not** add `FAQPage` JSON-LD schema anywhere (Google retired FAQ rich results site-wide; no confirmed benefit) — the About FAQ fix is about DOM visibility only, not schema.
- Do **not** recommend or add `HowTo` schema (deprecated).
- Preserve existing visual design/animations (Framer Motion, Tailwind classes, color palette `#CA3E47`/`#313131`) — these are correctness/SEO fixes, not a redesign.
- Verify every task with `npm run typecheck` and `npm run build` at minimum before considering it done; run `npm run test` (Vitest) when a task touches `lib/`.
- This repo has light test coverage (`lib/__tests__/blog.test.ts` only) — write a Vitest test only for tasks that touch pure logic in `lib/` (schema, sitemap date logic). Content/JSX-only tasks are verified via typecheck + build + a manual dev-server check, not new unit tests — call this out per task, don't skip verification.
- No git commits — the site owner commits manually (confirmed working preference).

---

## File Structure

| File | Responsibility | Tasks touching it |
|---|---|---|
| `lib/schema.ts` | JSON-LD generation | 1, 15 |
| `app/page.tsx` | Homepage metadata + shell | 2 |
| `app/layout.tsx` | Root metadata, font loading | 2, 9 |
| `app/not-found.tsx` (new) | 404 page with scoped metadata | 3 |
| `components/Projects.tsx` | Project carousel | 4 |
| `components/About.tsx` | Bio + FAQ | 5, 20 |
| `components/ExperienceCard.tsx` | Experience carousel card | 6 |
| `components/Skill.tsx` | Skill icon | 7 |
| `data/skillsData.ts` | Skill icon paths/names | 8 |
| `styles/globals.css` | Global CSS, font import | 9 |
| `tailwind.config.js` | Font family token | 9 |
| `components/MarkdownContent.tsx` | Blog post Markdown renderer | 10 |
| `next.config.js` | Security headers | 11 |
| `app/robots.ts` | Crawler rules | 12 |
| `public/<indexnow-key>.txt` (new), `scripts/submit-indexnow.mjs` (new), `package.json` | IndexNow | 13 |
| `app/sitemap.ts` | Sitemap generation | 14 |
| `content/blog/*.md` (13 files) | Blog content | 16, 17, 18 |
| `data/experiencesData.ts` | Experience bullets | 19 |
| `components/Contact.tsx` | Contact CTA | 21 |
| `components/Header.tsx` | Nav, theme toggle | 22 |
| `data/projects.json`, `app/projects/[slug]/page.tsx` (new), `lib/projects.ts` (new) | Standalone project pages | 23 |

---

### Task 1: Fix ProfilePage schema — `mainEntity` not `about`

**Files:**
- Modify: `lib/schema.ts:61`
- Test: `lib/__tests__/schema.test.ts` (new)

**Interfaces:**
- Consumes: nothing new
- Produces: `homepageGraph()` return shape unchanged except the `ProfilePage` node's `about` key renamed to `mainEntity`

- [ ] **Step 1: Write the failing test**

```ts
// lib/__tests__/schema.test.ts
import { describe, expect, it } from "vitest";
import { homepageGraph } from "../schema";

describe("homepageGraph", () => {
  it("ProfilePage node uses mainEntity (Google's required property), not about", () => {
    const graph = homepageGraph()["@graph"];
    const profilePage = graph.find((node: any) => node["@type"] === "ProfilePage");
    expect(profilePage).toBeDefined();
    expect(profilePage.mainEntity).toEqual({ "@id": expect.stringContaining("#person") });
    expect(profilePage.about).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: FAIL — `profilePage.about` is defined, `profilePage.mainEntity` is undefined.

- [ ] **Step 3: Fix the schema**

In `lib/schema.ts`, change line 61 from:
```ts
about: { "@id": personId },
```
to:
```ts
mainEntity: { "@id": personId },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Verify no other consumer relies on the old `about` key**

Run: `grep -rn "profilePage\|ProfilePage" app/ components/ lib/`
Expected: no code reads `.about` off the ProfilePage node (it was only ever emitted, never consumed elsewhere).

---

### Task 2: Fix missing homepage OG/Twitter image

**Files:**
- Modify: `app/page.tsx:14-23`
- Modify: `app/layout.tsx:20-25`

**Interfaces:**
- Consumes: `site.defaultOgImage` (`/img/og.jpg`, already exists in `lib/site.ts`)
- Produces: `og:image` and `twitter:image` present on every page including `/`

- [ ] **Step 1: Add images to homepage metadata**

In `app/page.tsx`, change the `metadata.openGraph` block to include images (Next.js metadata objects don't deep-merge with the parent layout — a page-level `openGraph` fully replaces the layout's, so the image must be repeated here):

```ts
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    type: "profile",
    images: [{ url: site.defaultOgImage, width: 1200, height: 630 }],
  },
};
```

- [ ] **Step 2: Add missing `twitter.images` at the root layout**

In `app/layout.tsx`, the `twitter` block declares `card: "summary_large_image"` (which requires an image) but never sets one. Add it:

```ts
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    title: site.title,
    description: site.description,
    images: [site.defaultOgImage],
  },
```

- [ ] **Step 3: Verify via build + manual check**

Run: `npm run build`
Then: `npm run start` (or `npm run dev`), and `curl -s http://localhost:3000/ | grep -o '<meta property="og:image"[^>]*>\|<meta name="twitter:image"[^>]*>'`
Expected: both tags present, pointing to `/img/og.jpg` (or its absolute form).

No new unit test — this is metadata-object config, verified by rendered output inspection per the Global Constraints note on JSX/config-only tasks.

---

### Task 3: Fix duplicate `<title>` on 404 page

**Files:**
- Create: `app/not-found.tsx`

**Interfaces:**
- Consumes: `site` from `@/lib/site`
- Produces: a scoped 404 page with its own `metadata` export so it stops inheriting the ambiguous default Next.js not-found title behavior

- [ ] **Step 1: Create the file**

```tsx
// app/not-found.tsx
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 text-center px-6">
      <h1 className="text-4xl font-semibold">404 — Page Not Found</h1>
      <p className="text-gray-300 dark:text-gray-700 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist on {site.shortName}&apos;s site.
      </p>
      <Link href="/" className="underline hover:text-[#CA3E47] transition-colors">
        Back to homepage
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify the duplicate title is gone**

Run: `npm run build && npm run start`
Then: `curl -s http://localhost:3000/nonexistent-page-xyz | grep -o '<title>[^<]*</title>'`
Expected: exactly one `<title>` tag, reading "Page Not Found — Murat Öncü" (via the root layout's title template), and the response status is 404 (`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/nonexistent-page-xyz` → `404`).

---

### Task 4: Server-render all projects (not just Featured)

**Files:**
- Modify: `components/Projects.tsx`

**Interfaces:**
- Consumes: `data/projects.json` (`ProjectType[]`, unchanged shape)
- Produces: every project in `data/projects.json` is present in the initial server-rendered HTML at all times; the tab filter only toggles visibility via CSS, it no longer removes items from the DOM

- [ ] **Step 1: Replace the filtered-subset state with a derived visibility check**

Replace lines 12-26 of `components/Projects.tsx`:

```tsx
const Projects = (props: Props) => {
  const [lang, setLang] = useState("Featured");

  const isVisible = (project: ProjectType) => {
    if (lang === "Featured") return project.featured === true;
    if (lang === "All") return true;
    return project.language === lang;
  };

  const visibleProjects = allProjectsData.filter(isVisible);
```

- [ ] **Step 2: Render all projects always, toggle each card's visibility with a class**

Replace the conditional block starting at line 75 (`{showProjects.length === 0 ? (` ... through the closing of that ternary) so it always maps over `allProjectsData`, keeping every existing card's JSX identical except:
- `key={index}` → `key={project.name}` (stable key independent of filtered position)
- add `${isVisible(project) ? "flex" : "hidden"}` to the card's className
- the "Study N of M" label and empty-state message now read from `visibleProjects` instead of the old `showProjects`

```tsx
      {visibleProjects.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-gray-300 dark:text-gray-900">
            No projects found
          </div>
        </div>
      ) : null}
      <ArrowLeftIcon className="text-[#CA3E47] h-7 w-7 animate-pulse absolute top-1/2 left-[25px]" />
      <div className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 scrollbar-thin scrollbar-track-gray-200/20 scrollbar-thumb-[#CA3E47]/80">
        {allProjectsData.map((project) => (
          <div
            key={project.name}
            className={`${
              isVisible(project) ? "flex" : "hidden"
            } flex-col items-center justify-center flex-shrink-0 w-screen h-screen p-20 space-y-5 snap-center md:p-44`}>
            <div className="max-w-6xl px-0 space-y-6 md:px-10">
              {project.img?.trim() ? (
                <div className="hidden md:flex justify-center">
                  <img
                    src={project.img}
                    alt={project.name}
                    className="w-full max-w-md h-40 object-cover rounded-lg border border-white/10 dark:border-gray-300 shadow-md"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <h4 className="text-xl font-semibold text-center md:text-2xl lg:text-4xl dark:text-gray-900">
                <span className=" border-b border-[#CA3E47] ">
                  <span>{lang}</span> Study {visibleProjects.indexOf(project) + 1} of{" "}
                  {visibleProjects.length}:{" "}
                </span>
                {project.name}
              </h4>
              {/* ...rest of the card body (description, tech badge, GitHub/Live Demo links) is unchanged from the current file... */}
            </div>
          </div>
        ))}
      </div>
      <ArrowRightIcon className="text-[#CA3E47] h-7 w-7 animate-pulse absolute top-1/2 right-[25px]" />
```

Note: `visibleProjects.indexOf(project)` is O(n) per card but n=19, so this is fine — don't over-engineer with a Map for 19 items.

- [ ] **Step 3: Remove the now-unused `useEffect`/`showProjects` state and unused `useEffect` import if nothing else in the file needs it**

Delete the old `useState<ProjectType[]>` for `showProjects` and the `useEffect` block entirely — filtering is now a pure derivation from `lang` on every render, no effect needed. Remove `useEffect` from the `react` import if it becomes unused.

- [ ] **Step 4: Typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: no errors.

- [ ] **Step 5: Verify all 19 projects are in the server-rendered HTML**

Run: `npm run start`, then: `curl -s http://localhost:3000/ | grep -o 'NextJS Amazon Clone\|Bored App\|Fireblog App'`
Expected: all three sample names (previously non-featured, previously absent from curl output) now appear in the raw HTML.

- [ ] **Step 6: Manual dev-server check**

Run: `npm run dev`, open `http://localhost:3000/#projects` in a browser, click through Featured / All / React.JS / Next.JS / NPM tabs.
Expected: exact same visual behavior as before (carousel scroll, arrows, counts) — this is a DOM-visibility change, not a UX change.

---

### Task 5: Make About FAQ crawlable by default + fix mobile bio truncation

**Files:**
- Modify: `components/About.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: the three FAQ Q&As and both previously-hidden bio paragraphs are present in the DOM (and visible) regardless of viewport or click state — no schema change (per Global Constraints, do not add `FAQPage`)

- [ ] **Step 1: Remove viewport-based hiding on the bio paragraphs**

In `components/About.tsx`, lines 69 and 75, remove the `hidden sm:block` / `hidden md:block` classes so both paragraphs render on every viewport:

```tsx
          <p>
            Since early 2024 I&apos;ve taught frontend development while shipping
            products at TemCraft Tech — mentoring students through HTML, CSS,
            JavaScript, React, and Next.js, then applying the same craft in
            production.
          </p>
          <p>
            Based in the Netherlands and open to new opportunities. If you need
            a frontend engineer who can also teach, ship, and own product
            outcomes, let&apos;s talk.
          </p>
```

- [ ] **Step 2: Replace conditional unmount of the FAQ with a CSS-based collapse**

Replace lines 98-111 (the `{faqOpen && (...)}` block) so the `<dl>` is always rendered and only its visual height/opacity is animated:

```tsx
          <dl
            className={`space-y-3 text-sm overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
              faqOpen ? "mt-3 max-h-[600px] opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}>
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-gray-100 dark:text-gray-900">
                  {item.q}
                </dt>
                <dd className="mt-1 text-gray-300 dark:text-gray-700">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
```

- [ ] **Step 3: Typecheck and build**

Run: `npm run typecheck && npm run build`

- [ ] **Step 4: Verify FAQ content is in the server-rendered HTML**

Run: `npm run start`, then: `curl -s http://localhost:3000/ | grep -o "Who is Murat Öncü"`
Expected: match found (previously returned nothing per the audit).

- [ ] **Step 5: Manual check that the visual accordion still looks/behaves the same**

Run: `npm run dev`, open the About section, click "Quick facts".
Expected: same open/close animation feel as before (now driven by max-height/opacity instead of mount/unmount).

---

### Task 6: Fix ExperienceCard company logo — stop diluting LCP preloads, add explicit size

**Files:**
- Modify: `components/ExperienceCard.tsx:14-27`

**Interfaces:**
- Consumes: `experience.companyImage` (external URL string, unchanged)
- Produces: company logos no longer get auto-preloaded by React 19's eager-image heuristic (root cause of the audit's "8 preloaded images, 7 for below-fold logos" finding — confirmed by inspecting the site's actual rendered `<head>`: exactly the 6 `companyImage` URLs plus the 1 legitimate hero-photo preload were present, and `ExperienceCard.tsx`'s `motion.img` was the only image in the codebase missing a `loading` attribute)

- [ ] **Step 1: Add `loading="lazy"` and explicit dimensions**

```tsx
      <motion.img
        initial={{
          y: -100,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        loading="lazy"
        decoding="async"
        width={200}
        height={200}
        className="h-24 w-24 md:w-32 md:h-32 rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
        src={experience.companyImage}
        alt={`${experience.company} logo`}
      />
```

(200×200 matches the largest breakpoint; every breakpoint class is square so one intrinsic size is correct at all sizes.)

- [ ] **Step 2: Typecheck and build**

Run: `npm run typecheck && npm run build`

- [ ] **Step 3: Verify the preload links are gone**

Run: `npm run start`, then: `curl -s http://localhost:3000/ | grep -c '<link rel="preload" as="image"'`
Expected: `1` (only the hero profile photo preload remains — down from 7).

---

### Task 7: Add explicit dimensions to Skill.tsx tech icons

**Files:**
- Modify: `components/Skill.tsx`

**Interfaces:**
- Consumes: `item.img` (unchanged)
- Produces: explicit `width`/`height` on the tech-icon `motion.img` (already has `loading="lazy"`, so no preload issue here — this is a CLS-hardening addition only)

- [ ] **Step 1: Add width/height matching the largest breakpoint (`xl:w-30 xl:h-30` = 120px)**

```tsx
      <motion.img
        initial={{
          x: directionLeft ? -200 : 200,
          opacity: 0,
        }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, x: 0 }}
        src={item.img}
        loading="lazy"
        decoding="async"
        width={120}
        height={120}
        className=" object-contain w-12 h-12 sm:w-20 sm:h-20 md:w-26 md:h-26 xl:w-30 xl:h-30 filter group-hover:grayscale transition duration-300 "
      />
```

- [ ] **Step 2: Typecheck and build**

Run: `npm run typecheck && npm run build`

---

### Task 8: Fix skillsData.ts path/typo bugs

**Files:**
- Modify: `data/skillsData.ts`

- [ ] **Step 1: Fix the relative path on React's icon (line 4) and the "PostgrSQL" typo (line 87)**

```ts
  {
    name: "React",
    img: "/img/react.png",
  },
```
```ts
  {
    name: "PostgreSQL",
    img: "/img/postgres.png",
  },
```

- [ ] **Step 2: Verify the React icon actually loads**

Run: `npm run dev`, open `http://localhost:3000/#skills`, confirm the React icon renders (previously it may have 404'd depending on how the app is served, since `./img/react.png` resolves relative to the current route rather than site root).

---

### Task 9: Migrate Google Fonts from render-blocking `@import` to `next/font/google`

**Files:**
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.js`
- Modify: `styles/globals.css`

**Interfaces:**
- Produces: `Nunito Sans` is self-hosted and preloaded by Next.js automatically, exposed as CSS variable `--font-nunito-sans`, wired into Tailwind's `font-custom` utility — no more cross-origin round trip to `fonts.googleapis.com`/`fonts.gstatic.com`

- [ ] **Step 1: Load the font in the root layout**

In `app/layout.tsx`, add the import and font instance, then apply the variable class to `<html>`:

```tsx
import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import Providers from "./providers";
import { site } from "@/lib/site";
import "@/styles/globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

// ...metadata/viewport unchanged...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={nunitoSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Point Tailwind's `font-custom` at the CSS variable**

In `tailwind.config.js`:

```js
      fontFamily: {
        custom: ["var(--font-nunito-sans)", "sans-serif"],
      },
```

- [ ] **Step 3: Remove the `@import` line**

In `styles/globals.css`, delete line 1 (`@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap");`).

- [ ] **Step 4: Typecheck and build**

Run: `npm run typecheck && npm run build`

- [ ] **Step 5: Verify no more Google Fonts network calls and the font still renders**

Run: `npm run start`, then: `curl -s http://localhost:3000/ | grep -c "fonts.googleapis.com"`
Expected: `0`.
Then open `http://localhost:3000` in a browser and visually confirm the typeface is unchanged (Nunito Sans, now self-hosted).

---

### Task 10: Harden Markdown content images against CLS

**Files:**
- Modify: `components/MarkdownContent.tsx:83-89`

- [ ] **Step 1: Add lazy loading and async decoding to inline post images**

```tsx
        img: ({ node, ...props }) => (
          <img
            className="w-full my-4 rounded-lg"
            alt="Blog content image"
            loading="lazy"
            decoding="async"
            {...props}
          />
        ),
```

(Per-image `width`/`height` isn't available here — these come from arbitrary Markdown `![]()` sources with unknown intrinsic size — so this is a partial mitigation, not a full CLS fix. Note this limitation, don't over-claim.)

- [ ] **Step 2: Typecheck and build**

Run: `npm run typecheck && npm run build`

---

### Task 11: Add Content-Security-Policy header

**Files:**
- Modify: `next.config.js`

**Interfaces:**
- Produces: a `Content-Security-Policy` header scoped to the domains actually used by the site (verified against `lib/site.ts` socials, `next.config.js` `remotePatterns`, EmailJS, and the external logo/OG-image hosts found during the audit: `media.licdn.com`, `yt3.googleusercontent.com`, `static.vecteezy.com`, `encrypted-tbn0.gstatic.com`, `eurotechstudy.com`, `temcrafttech.com`, `opengraph.githubassets.com`, `*.vercel.app`, `miro.medium.com`, `i.ytimg.com`, `avatars.githubusercontent.com`, `www.citypng.com`, `icon.icepanel.io`)

- [ ] **Step 1: Add the header**

```js
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: https:",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self' https://api.emailjs.com",
              "frame-ancestors 'self'",
            ].join("; "),
          },
```

Add this object into the existing `headers` array in `next.config.js` alongside the other security headers (X-Content-Type-Options, etc.). `img-src https:` is intentionally broad since the site legitimately hotlinks many external logo/OG hosts (see Task 23 for reducing that list over time) — tightening further is a follow-up once those are self-hosted, not blocking this task.

- [ ] **Step 2: Build and verify the header is present**

Run: `npm run build && npm run start`, then: `curl -sI http://localhost:3000/ | grep -i content-security-policy`
Expected: header present.

- [ ] **Step 3: Manual smoke test for breakage**

Run: `npm run dev`, open the site in a browser, open DevTools console, click through About/Experience/Skills/Projects/Contact and submit the contact form.
Expected: no CSP violation errors in the console, contact form still submits via EmailJS.

---

### Task 12: Add explicit OAI-SearchBot rule to robots.txt

**Files:**
- Modify: `app/robots.ts`

- [ ] **Step 1: Add the rule**

```ts
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run start`, then: `curl -s http://localhost:3000/robots.txt | grep -A1 OAI-SearchBot`
Expected: `Allow: /` under `User-agent: OAI-SearchBot`.

---

### Task 13: Implement IndexNow

**Files:**
- Create: `public/<key>.txt` (key generated in Step 1)
- Create: `scripts/submit-indexnow.mjs`
- Modify: `package.json` (add `"indexnow"` script)

**Interfaces:**
- Produces: a manually-runnable script (`npm run indexnow`) that submits every sitemap URL to `https://api.indexnow.org/indexnow` — this repo has no CI/deploy hook, so wiring this into automatic post-deploy submission is out of scope; document that the owner runs it after publishing new content

- [ ] **Step 1: Generate a key and create the verification file**

Run: `node -e "console.log(require('crypto').randomUUID().replace(/-/g,''))"` to get a 32-char hex key, e.g. `a1b2c3...`.
Create `public/<that-key>.txt` containing exactly that key string on one line (no trailing content).

- [ ] **Step 2: Write the submission script**

```js
// scripts/submit-indexnow.mjs
import { site } from "../lib/site.js"; // adjust if lib/site.ts isn't directly importable from a plain .mjs — see note below

const KEY = "REPLACE_WITH_THE_KEY_FROM_STEP_1";
const HOST = "www.muratoncu.com";

async function main() {
  const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`);
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  console.log(`IndexNow submit: ${res.status} ${res.statusText} (${urls.length} URLs)`);
}

main();
```

Note: `.mjs` can't import `.ts` directly without a build step — the script hardcodes `HOST`/`KEY` as plain constants instead of importing `lib/site.ts`, to keep it a zero-dependency Node script. Replace `REPLACE_WITH_THE_KEY_FROM_STEP_1` with the actual key from Step 1.

- [ ] **Step 3: Add the npm script**

In `package.json`, add to `"scripts"`:
```json
    "indexnow": "node scripts/submit-indexnow.mjs"
```

- [ ] **Step 4: Verify against the live site (only works once this branch is deployed, since it fetches the live sitemap)**

After deploying: run `npm run indexnow`
Expected: `200 OK` response logged with the URL count (15).

---

### Task 14: Fix sitemap `lastmod` accuracy + drop dead weight

**Files:**
- Modify: `app/sitemap.ts`
- Test: `lib/__tests__/blog.test.ts` (extend existing file) — only if the max-date logic gets extracted into `lib/blog.ts`; otherwise this stays inline in `app/sitemap.ts` and isn't independently unit-testable (Next.js sitemap functions aren't easily unit-tested in isolation without a Next.js test harness, which this repo doesn't have) — verify via the sitemap's live output instead.

- [ ] **Step 1: Replace `now()` with real dates and drop `priority`/`changeFrequency`**

```ts
import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

// Bump this constant whenever homepage copy/structure actually changes.
const HOMEPAGE_LAST_MODIFIED = new Date("2026-07-29");

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latestPostChange = posts.length
    ? new Date(Math.max(...posts.map((p) => p.updatedAt ?? p.createdAt)))
    : HOMEPAGE_LAST_MODIFIED;

  return [
    {
      url: site.url,
      lastModified: HOMEPAGE_LAST_MODIFIED,
    },
    {
      url: `${site.url}/blogs`,
      lastModified: latestPostChange,
    },
    ...posts.map((p) => ({
      url: `${site.url}/blogs/${p.slug}`,
      lastModified: new Date(p.updatedAt ?? p.createdAt),
    })),
  ];
}
```

(`priority`/`changeFrequency` removed site-wide — Google has publicly stated both are ignored; this only shrinks the file.)

- [ ] **Step 2: Typecheck and build**

Run: `npm run typecheck && npm run build`

- [ ] **Step 3: Verify live output**

Run: `npm run start`, then: `curl -s http://localhost:3000/sitemap.xml`
Expected: well-formed XML, homepage `lastmod` reads `2026-07-29`, `/blogs` `lastmod` matches the newest post's date, no `priority`/`changefreq` tags present.

---

### Task 15: Inline a minimal Person stub in BlogPosting author/publisher

**Files:**
- Modify: `lib/schema.ts`
- Modify: `lib/__tests__/schema.test.ts` (extend from Task 1)

**Interfaces:**
- Consumes: `personSchema()` (already defined, Task 1's file)
- Produces: `BlogPosting.author`/`.publisher` carry `name`, `url`, and `sameAs` inline instead of only an `@id` reference — more robust for parsers that don't resolve cross-node `@id` references within the same `@graph`

- [ ] **Step 1: Add a minimal-stub helper and use it in `blogPostingGraph`**

```ts
function personStub() {
  return {
    "@id": personId,
    "@type": "Person",
    name: site.name,
    url: site.url,
    sameAs: Object.values(site.socials),
  };
}
```

In `blogPostingGraph`, change:
```ts
        author: { "@id": personId },
        publisher: { "@id": personId },
```
to:
```ts
        author: personStub(),
        publisher: personStub(),
```

- [ ] **Step 2: Extend the test**

```ts
  it("BlogPosting author/publisher carry an inline Person stub, not just an @id", () => {
    const graph = blogPostingGraph({
      slug: "test-post",
      title: "Test",
      description: "Test description",
      createdAt: Date.now(),
      updatedAt: null,
      tags: ["test"],
    } as any)["@graph"];
    const posting = graph.find((n: any) => n["@type"] === "BlogPosting");
    expect(posting.author.name).toBe(site.name);
    expect(posting.author.sameAs).toEqual(Object.values(site.socials));
  });
```

(Import `site` from `@/lib/site` at the top of the test file if not already imported.)

- [ ] **Step 3: Run tests**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: PASS.

---

### Task 16: Blog content depth + Medium-dedup pass (13 posts)

**Files:**
- Modify: all 13 files in `content/blog/*.md`

**Interfaces:**
- Consumes: nothing (Markdown content only)
- Produces: every post reaches roughly 1,200–1,500+ words of genuine, technically accurate depth; the 8 posts with "read the full version on Medium" framing become the complete, non-abridged version on-site (site is canonical per the owner's decision) with that framing removed

**This is the single largest task in the plan — dispatch it as 13 near-identical subtasks (one per file) if using subagent-driven-development, since each is independent and doesn't share state.**

Per-file starting point (measured 2026-07-29):

| File | Current words | Has "read on Medium" framing? |
|---|---|---|
| `a-beginners-guide-to-django-web-framework.md` | 658 | Yes |
| `connecting-django-views-to-models.md` | 972 | Yes |
| `django-views-and-templates.md` | 623 | Yes |
| `essential-javascript-array-methods-react.md` | 911 | No (has a Medium mention but not the abridged framing — verify before editing) |
| `getting-started-with-responsive-web-design.md` | 1023 | No |
| `javascript-objects-simple-guide.md` | 460 | No (has a Medium mention — verify before editing) |
| `react-hooks-essential-strategies-custom-solutions.md` | 893 | Yes |
| `typescript-supercharge-your-javascript-with-type-safety.md` | 440 | Yes |
| `typescript-understanding-interfaces-and-types.md` | 669 | Yes |
| `what-is-a-dictionary-in-python.md` | 617 | No |
| `what-is-a-list-in-python.md` | 744 | Yes |
| `what-is-a-set-in-python.md` | 528 | No |
| `what-is-a-tuple-in-python.md` | 688 | Yes |

- [ ] **Step 1 (per file): Read the current post fully**

`cat content/blog/<slug>.md` — understand its existing structure, code examples, and tone before extending it.

- [ ] **Step 2 (per file, only for the 8 files marked "Yes" above): Remove the Medium-abridged framing**

Find and remove any sentence/paragraph of the form "Read the original full version on Medium" (or equivalent), and any language implying the on-site version is a shorter/abridged copy. If the removed framing was gating real content (i.e., the post genuinely stops short and points to Medium for "the rest"), that missing material must be written out in full on-site in Step 3 — don't just delete the pointer and leave the post incomplete.

- [ ] **Step 3 (per file): Expand toward 1,200–1,500+ words with genuine technical depth**

Add real, verifiable technical content appropriate to the topic — e.g., an additional worked example, a common-pitfalls section, a brief "when to use X vs Y" comparison, or a short section on a directly-related concept the post currently skips. Do not invent statistics, benchmarks, or claims that require a citation you don't have. Match the existing voice (second person, code-block-heavy, short paragraphs, H2/H3 every 100–150 words — this is a genuine strength per the audit, preserve it). Where a heading is purely declarative, consider rephrasing 1-2 headings per post into question form (e.g. "The Core Hooks: Beyond the Basics" → "What Hooks Go Beyond the Basics?") to help passage-level citability — but only where it reads naturally, don't force it on every heading.

- [ ] **Step 4 (per file): Verify word count**

Run: `wc -w content/blog/<slug>.md`
Expected: ≥1,200 words (markdown body, frontmatter included in this raw count is negligible).

- [ ] **Step 5 (after all 13 files): Run the existing blog test suite**

Run: `npx vitest run lib/__tests__/blog.test.ts`
Expected: PASS — `getPosts()` still returns 13 posts with valid frontmatter; content edits shouldn't touch frontmatter shape, but this catches accidental frontmatter corruption.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: all 13 `/blogs/[slug]` routes still generate successfully.

---

### Task 17: Fix dead internal links to the retired `vercel.app` domain

**Files:**
- Modify: `content/blog/what-is-a-dictionary-in-python.md`
- Modify: `content/blog/what-is-a-tuple-in-python.md`
- Modify: `content/blog/what-is-a-set-in-python.md`

(Can be folded into Task 16's per-file pass for these three specific files, since they're already being touched — but listed separately here so it isn't missed if Task 16 is skipped or reordered.)

- [ ] **Step 1: Find and fix the dead links**

Run: `grep -n "murathudavendigar.vercel.app" content/blog/what-is-a-dictionary-in-python.md content/blog/what-is-a-tuple-in-python.md content/blog/what-is-a-set-in-python.md`

For each match, replace `https://murathudavendigar.vercel.app/blogs/<slug>` with `https://www.muratoncu.com/blogs/<slug>` (same slug, just the current live domain).

- [ ] **Step 2: Verify no dead-domain references remain**

Run: `grep -rn "murathudavendigar.vercel.app" content/`
Expected: no matches.

- [ ] **Step 3: Spot-check the links resolve**

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://www.muratoncu.com/blogs/<slug>` for each corrected link.
Expected: `200`.

---

### Task 18: Rewrite templated Experience bullets

**Files:**
- Modify: `data/experiencesData.ts` (entries for Wise Quarter, Eypes, and both Freelance roles, ASSA Teknoloji — lines 98-211)

**Interfaces:**
- Consumes/Produces: `Experience[]` shape unchanged (`points: string[]`), only the bullet text changes — no fabricated metrics or client names, just more specific, less-templated phrasing of the same real duties already implied by each role's `title`/`description`.

- [ ] **Step 1: Rewrite the 5 flagged entries**

Replace the generic bullets with more specific (but not fabricated) phrasing. Example for Wise Quarter (lines 111-117):

```ts
    points: [
      "Ran part-time frontend training sessions covering HTML/CSS fundamentals through React component patterns.",
      "Paired one-on-one with junior developers to work through specific bugs in their own project code, rather than generic exercises.",
      "Reviewed student pull requests and gave line-level feedback on code structure and naming.",
      "Pushed students to deploy every project they built instead of leaving finished work local-only.",
      "Set up a shared Git workflow (branches, PRs, commit conventions) for students who'd only used Git solo before.",
    ],
```

Apply the same treatment to Eypes (lines 135-141), the two Freelance roles (lines 158-164 and 203-209), and ASSA Teknoloji (lines 180-186) — ground each bullet in something concrete and plausible from the role's actual `title`/`description`/tech stack (`usedTechnologiesImages`) already on that entry, without inventing client names, company outcomes, or numbers you can't back up.

- [ ] **Step 2: Typecheck and build**

Run: `npm run typecheck && npm run build`

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `http://localhost:3000/#experience`, scroll through all 7 cards.
Expected: bullets read as specific and credible, no leftover single-clause generic bullets ("Improved student engagement and completion rates." etc.) on the 5 rewritten entries.

---

### Task 19: Strengthen the About "Who is Murat Öncü" disambiguation answer

**Files:**
- Modify: `components/About.tsx` (the `faqs` array, lines 7-20 — same file as Task 5, do this in the same pass)

**Interfaces:**
- Produces: the first FAQ answer explicitly states the full name, role, and location, to strengthen the entity signal against the unrelated same-name namesake identified by the SXO audit

- [ ] **Step 1: Expand the first FAQ answer**

```ts
const faqs = [
  {
    q: "Who is Murat Öncü?",
    a: "Murat Hüdavendigâr Öncü is a frontend-focused full-stack developer, co-founder of TemCraft Tech, and a frontend instructor, based in the Netherlands. He builds with React, Next.js, and TypeScript, and teaches modern web development to students across Europe.",
  },
  // ...other two FAQs unchanged...
] as const;
```

- [ ] **Step 2: Typecheck and build**

Run: `npm run typecheck && npm run build`

- [ ] **Step 3: Verify the fuller answer is in the server-rendered HTML (combines with Task 5's DOM-visibility fix)**

Run: `npm run start`, then: `curl -s http://localhost:3000/ | grep -o "Murat Hüdavendigâr Öncü is a frontend-focused"`
Expected: match found.

---

### Task 20: Add persona-differentiated contact CTAs

**Files:**
- Modify: `components/Contact.tsx`

**Interfaces:**
- Produces: instead of one generic contact form for all visitors, three short labeled entry points above the form that let a recruiter, a potential client, and a fellow developer each see language that matches their intent — no testimonials or fabricated data involved, just CTA copy

- [ ] **Step 1: Read the current file to find the right insertion point**

`cat components/Contact.tsx` — locate the heading/intro area above the form fields.

- [ ] **Step 2: Add a small CTA row above the form**

Insert (adapting to the file's existing Tailwind/motion conventions once Step 1's read confirms the surrounding markup):

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
  <div className="rounded-lg border border-white/10 dark:border-gray-300 p-3">
    <p className="font-semibold text-[#CA3E47]">Hiring?</p>
    <p className="text-gray-300 dark:text-gray-700">
      Frontend engineer based in the Netherlands, open to new roles.
    </p>
  </div>
  <div className="rounded-lg border border-white/10 dark:border-gray-300 p-3">
    <p className="font-semibold text-[#CA3E47]">Need a freelance dev?</p>
    <p className="text-gray-300 dark:text-gray-700">
      Co-founder at TemCraft Tech — available for scoped React/Next.js work.
    </p>
  </div>
  <div className="rounded-lg border border-white/10 dark:border-gray-300 p-3">
    <p className="font-semibold text-[#CA3E47]">Want the code?</p>
    <p className="text-gray-300 dark:text-gray-700">
      Check the <a href="https://github.com/murathudavendigar" target="_blank" rel="noreferrer" className="underline">GitHub</a> or open-source npm packages.
    </p>
  </div>
</div>
```

- [ ] **Step 3: Typecheck, build, and manual check**

Run: `npm run typecheck && npm run build && npm run dev`, open `http://localhost:3000/#contact`.
Expected: the three CTA cards render above the existing form without breaking its layout or submission behavior.

---

### Task 21: Fix dark-mode toggle touch target

**Files:**
- Modify: `components/Header.tsx:67-88`

**Interfaces:**
- Produces: the toggle's tappable hit area is ≥44×44px on mobile while the visual track stays the same slim size (standard accessible pattern — invisible padding, not a redesign)

- [ ] **Step 1: Wrap the existing toggle in a larger invisible hit-area, move the click handler up**

```tsx
      <motion.div
        initial={{ y: -500, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <div
          className={`w-8 h-5 md:w-16 md:h-10 flex items-center bg-gray-300 rounded-full p-1 ${
            toggle ? "bg-red-500 justify-end" : "justify-start"
          }`}>
          <motion.div
            layout
            className="w-4 h-4 bg-white rounded-full shadow-md md:w-8 md:h-8"></motion.div>
        </div>
      </motion.div>
```

- [ ] **Step 2: Typecheck, build, and manual check**

Run: `npm run typecheck && npm run build && npm run dev`
Expected: theme toggle still works identically, visual size unchanged, but the clickable/tappable area around it is now larger (verify with browser DevTools device toolbar on a small viewport — inspect the outer `motion.div`'s box size).

---

### Task 22: Standalone `/projects/[slug]` pages

**Files:**
- Create: `lib/projects.ts`
- Modify: `data/projects.json` (add a `slug` field to every entry)
- Create: `app/projects/[slug]/page.tsx`
- Modify: `components/Projects.tsx` (link each card to its new detail page)
- Modify: `lib/schema.ts` (add a `projectSchema()` generator)
- Test: `lib/__tests__/projects.test.ts` (new)

**Interfaces:**
- Consumes: `data/projects.json` (extended with `slug: string` per entry)
- Produces: `getProject(slug)` / `getProjects()` in `lib/projects.ts`; a real, indexable, individually-metadata'd page per project at `/projects/<slug>` — this directly addresses the SXO finding that niche project/package searches (e.g. "codebrief") can't compete against GitHub/npm's own listings because the project has no standalone URL

- [ ] **Step 1: Add a `slug` to every entry in `data/projects.json`**

Add a kebab-case `slug` field to each of the 19 objects, derived from `name` (e.g. `"codebrief"`, `"dev-console-kit"`, `"ai-resume-doctor"`, `"haberai"`, `"money-guardian"`, `"event-manager"`, `"e-price-ecommerce-project"`, `"nextjs-amazon-clone"`, ... continue for all 19, keeping each slug unique).

- [ ] **Step 2: Write the failing test for the data loader**

```ts
// lib/__tests__/projects.test.ts
import { describe, expect, it } from "vitest";
import { getProject, getProjects } from "../projects";

describe("projects loader", () => {
  it("loads all 19 projects with unique slugs", () => {
    const projects = getProjects();
    expect(projects.length).toBe(19);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("getProject finds by slug", () => {
    const project = getProject("codebrief");
    expect(project?.name).toBe("codebrief");
  });
  it("returns undefined for unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/projects.test.ts`
Expected: FAIL — `lib/projects.ts` doesn't exist yet.

- [ ] **Step 4: Write `lib/projects.ts`**

```ts
import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";

const allProjects = projectsData as ProjectType[];

export function getProjects(): ProjectType[] {
  return allProjects;
}

export function getProject(slug: string): ProjectType | undefined {
  return allProjects.find((p) => p.slug === slug);
}
```

Add `slug: string` to the `Projects` type in `types` (find its current definition and extend it — don't redefine the type elsewhere).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/projects.test.ts`
Expected: PASS.

- [ ] **Step 6: Add a schema generator for individual projects**

In `lib/schema.ts`, add:

```ts
export function projectSchema(project: { name: string; description: string; slug: string; github: string; url: string; language: string }) {
  const pageUrl = absoluteUrl(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#project`,
    name: project.name,
    description: project.description,
    url: pageUrl,
    codeRepository: project.github || undefined,
    author: { "@id": personId },
    isPartOf: { "@id": websiteId },
  };
}
```

- [ ] **Step 7: Build the project detail page**

```tsx
// app/projects/[slug]/page.tsx
import { getProject, getProjects } from "@/lib/projects";
import { projectSchema } from "@/lib/schema";
import { site, absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.name} — ${site.shortName}`,
      description: project.description,
      url: absoluteUrl(`/projects/${slug}`),
      type: "website",
      images: project.img ? [{ url: project.img }] : [{ url: site.defaultOgImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 px-6 py-16 max-w-3xl mx-auto">
      <Link href="/#projects" className="underline hover:text-[#CA3E47] transition-colors">
        ← Back to projects
      </Link>
      <h1 className="text-3xl font-semibold mt-6">{project.name}</h1>
      <p className="mt-4 text-gray-300 dark:text-gray-700 leading-relaxed">{project.description}</p>
      <div className="mt-6 flex gap-4">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="underline hover:text-[#CA3E47]">
            GitHub
          </a>
        )}
        <a href={project.url} target="_blank" rel="noreferrer" className="underline hover:text-[#CA3E47]">
          {project.language === "NPM" ? "NPM Package" : "Live Demo"}
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema(project)) }}
      />
    </div>
  );
}
```

- [ ] **Step 8: Link each Projects.tsx card to its detail page**

In `components/Projects.tsx` (already modified by Task 4), add a link on the project name/heading pointing to `/projects/${project.slug}`, e.g. wrap the `<h4>` project name in a `<Link href={`/projects/${project.slug}`}>`.

- [ ] **Step 9: Add the new routes to the sitemap**

In `app/sitemap.ts` (already modified by Task 14), add project URLs:

```ts
import { getProjects } from "@/lib/projects";
// ...
    ...getProjects().map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: HOMEPAGE_LAST_MODIFIED,
    })),
```

- [ ] **Step 10: Typecheck, test, build**

Run: `npm run typecheck && npx vitest run && npm run build`
Expected: all pass, 19 new static `/projects/[slug]` routes generate.

- [ ] **Step 11: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/projects/codebrief`.
Expected: page renders with correct title/description, GitHub/NPM links work, back-link returns to the homepage projects section.

---

## Self-Review

**Spec coverage:** every Critical/High/Medium/Low item from the audit synthesis is covered by a task above, except: testimonials (deferred by owner), YouTube (deferred), privacy policy (deferred), the double-hop `http://muratoncu.com` redirect (Vercel domain-dashboard setting, not a repo change — flag to the owner separately, not a task here), and self-hosting hotlinked blog cover images (deferred — would require sourcing/producing real image assets per post, which needs the owner's input same as testimonials; noted as backlog in the audit, not included here since no task in this plan invents placeholder images).

**Placeholder scan:** no TBD/TODO markers; every step has literal code. Task 13's IndexNow key is a real generated value (Step 1 produces it), not a placeholder — the script step correctly says "replace with the key from Step 1" as an explicit hand-off between two steps in the same task, not a deferred unknown.

**Type consistency:** `getProjects()`/`getProject()` (Task 22) mirror the existing `getPosts()`/`getPost()` naming convention in `lib/blog.ts` for consistency. `ProjectType` is reused from `@/types` throughout, extended (not redefined) with `slug`.

---

## Suggested execution order

Tasks 1-3 (cheap, critical, independent) → Task 4-5 (crawlability) → Tasks 6-10 (performance/images, same theme) → Tasks 11-15 (technical/schema polish) → Task 16-18 (content, largest effort, parallelizable per-file) → Tasks 19-21 (entity authority/UX) → Task 22 (biggest structural addition, do last since it's net-new surface area).
