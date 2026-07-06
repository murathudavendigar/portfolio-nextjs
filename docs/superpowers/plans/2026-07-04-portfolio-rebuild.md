# Portfolio Rebuild (muratoncu.com) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio in-place as a Next.js 15 App Router site with a dark, motion-rich design, static markdown blog, curated projects, and full SEO for `https://www.muratoncu.com`.

**Architecture:** One-time export of MongoDB content (13 blog posts, 19 projects) into files committed to the repo; then the old Pages Router app is deleted and replaced by a fully static App Router app. All content is file-based (markdown + JSON + typed TS). No database, no API routes. Contact form is client-side EmailJS.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS 4, `motion` (framer-motion v12), gray-matter, react-markdown + remark-gfm + rehype-highlight, @emailjs/browser + react-hook-form, vitest (dev).

## Global Constraints

- Site URL is exactly `https://www.muratoncu.com` (canonical, sitemap, OG, JSON-LD).
- Dark theme ONLY. No theme toggle, no `next-themes`.
- Colors: bg `#0a0a0b`, surface `#121214`, border `#26262b`, text `#f4f4f5`, muted `#a1a1aa`, accent `#ff4d24`.
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (labels/meta) — all via `next/font/google`.
- Animations use `transform`/`opacity` only; every animation respects `prefers-reduced-motion`.
- No typewriter effects, no scroll-snap, no `react-simple-typewriter`, no MongoDB at runtime.
- Featured projects: "Event Manager" and "E-Price E-commerce Project". Tutorial clones (Amazon, Instagram, Netflix, ChatGPT) go in a demoted "Learning builds" strip.
- EmailJS: service id from `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, template id literal `"template_4mm0dyn"`, public key from `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (all already in `.env.local`).
- Socials: GitHub `https://github.com/murathudavendigar`, X `https://x.com/murathoncu`, LinkedIn `https://www.linkedin.com/in/murathudavendigaroncu/`, Medium `https://medium.com/@murathoncu`.
- `npm run build` must pass with zero TypeScript errors after every task.
- Note (spec deviations, same approved direction): page transitions use a `template.tsx` fade with `motion` instead of the experimental View Transitions API; contact form feedback is an inline status line instead of a toast library; navigation is a fixed translucent top bar (not a left rail) — simpler, works identically on mobile and desktop.

## File Structure (end state)

```
app/
  layout.tsx            root layout: fonts, nav, footer, metadata base, JSON-LD Person
  template.tsx          page-transition fade
  page.tsx              home: hero, selected work, experience snapshot, contact
  globals.css           Tailwind 4 theme + base styles
  sitemap.ts, robots.ts
  about/page.tsx
  projects/page.tsx
  projects/[slug]/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  blog/[slug]/opengraph-image.tsx
components/
  nav.tsx, footer.tsx, reveal.tsx, section-heading.tsx,
  hero.tsx, project-card.tsx, contact-form.tsx, markdown.tsx
lib/
  site.ts               site constants
  blog.ts               markdown blog loader
  projects.ts           projects loader + curation
data/
  projects-export.json  raw Mongo export (Task 1)
  experience.ts         ported experience data
content/blog/*.md       exported posts (Task 1)
scripts/export-content.mjs
```

Deleted at Task 2: `pages/`, old `components/*`, `lib/mongodb.ts`, `functions/`, `styles/`, `types/`, `data/techImageLinks.ts`, `data/companyImageLinks.ts`, `data/skillsData.ts`, `data/projectsData.ts`, `data/experiencesData.ts` (after porting), old configs (`next.config.js`, `postcss.config.js`, `tailwind.config.js`).

---

### Task 1: Export MongoDB content to files

**Files:**
- Create: `scripts/export-content.mjs`
- Create (generated): `content/blog/<slug>.md` × 13, `data/projects-export.json`

**Interfaces:**
- Produces: `content/blog/*.md` with frontmatter `{title, description, date (ISO), updated (ISO|null), tags (string[]), readTime (number), image (string)}`; `data/projects-export.json` as `Array<{title, description, technologies: string[], githubUrl, liveUrl, imageUrl, featured: boolean}>`.

- [ ] **Step 1: Write export script**

```js
// scripts/export-content.mjs
// One-time export of MongoDB content to repo files. Run: node scripts/export-content.mjs
import { MongoClient } from "mongodb";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const uri = readFileSync(".env.local", "utf8").match(/MONGODB_URI=(.*)/)[1].trim();
const client = new MongoClient(uri);
await client.connect();
const db = client.db("portfolio-db");

const yamlStr = (s) => JSON.stringify(String(s ?? ""));
const iso = (ms) => (ms ? new Date(ms).toISOString().slice(0, 10) : null);

mkdirSync("content/blog", { recursive: true });
const blogs = await db.collection("blogs").find({ published: true }).toArray();
for (const b of blogs) {
  const fm = [
    "---",
    `title: ${yamlStr(b.title)}`,
    `description: ${yamlStr(b.description)}`,
    `date: "${iso(b.createdAt ?? b.date)}"`,
    `updated: ${b.updatedAt ? `"${iso(b.updatedAt)}"` : "null"}`,
    `tags: ${JSON.stringify(b.tags ?? [])}`,
    `readTime: ${b.readTime ?? 5}`,
    `image: ${yamlStr(b.imageUrl)}`,
    "---",
    "",
  ].join("\n");
  writeFileSync(`content/blog/${b.slug}.md`, fm + (b.content ?? ""));
  console.log("wrote", b.slug);
}

const projects = await db.collection("projects").find({}).toArray();
const clean = projects.map(({ _id, ...p }) => p);
writeFileSync("data/projects-export.json", JSON.stringify(clean, null, 2) + "\n");
console.log("wrote", clean.length, "projects");
await client.close();
```

- [ ] **Step 2: Run it**

Run: `node scripts/export-content.mjs`
Expected: 13 `wrote <slug>` lines + `wrote 19 projects`. Verify: `ls content/blog | wc -l` → 13; spot-check one file has frontmatter + markdown body.

- [ ] **Step 3: Commit**

```bash
git add scripts/export-content.mjs content/blog data/projects-export.json
git commit -m "feat: export blog posts and projects from MongoDB to repo files"
```

---

### Task 2: Scaffold Next.js 15 App Router, delete old app

**Files:**
- Delete: `pages/`, `components/`, `lib/`, `functions/`, `types/`, `styles/`, `data/projectsData.ts`, `data/skillsData.ts`, `data/techImageLinks.ts`, `data/companyImageLinks.ts`, `next.config.js`, `postcss.config.js`, `tailwind.config.js` (keep `data/experiencesData.ts` until Task 3 ports it)
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/template.tsx`, `next.config.ts`, `postcss.config.mjs`
- Modify: `package.json`, `tsconfig.json`

- [ ] **Step 1: Replace dependencies**

```bash
npm uninstall @next/font @tailwindcss/typography date-fns dev-console-kit mongodb next-themes react-simple-typewriter react-social-icons react-toastify @heroicons/react tailwind-scrollbar
npm install next@15 react@19 react-dom@19 motion gray-matter react-markdown remark-gfm rehype-highlight
npm install -D tailwindcss@4 @tailwindcss/postcss typescript@5 @types/react@19 @types/react-dom@19 @types/node vitest
```

Note: `@emailjs/browser`, `react-hook-form`, `eslint`, `eslint-config-next` stay; bump `eslint-config-next` to 15: `npm install -D eslint-config-next@15`.

- [ ] **Step 2: Delete old app code**

```bash
git rm -r pages components lib functions types styles data/projectsData.ts data/skillsData.ts data/techImageLinks.ts data/companyImageLinks.ts next.config.js postcss.config.js tailwind.config.js public/next.svg public/thirteen.svg public/vercel.svg
```

- [ ] **Step 3: New configs**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async redirects() {
    return [
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
```

```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`tsconfig.json` — set `"strict": true`, `"target": "ES2022"`, keep `"paths": { "@/*": ["./*"] }`, and let `next build` auto-add the App Router plugin settings.

- [ ] **Step 4: Global styles (design tokens)**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-ink: #0a0a0b;
  --color-surface: #121214;
  --color-line: #26262b;
  --color-snow: #f4f4f5;
  --color-fog: #a1a1aa;
  --color-ember: #ff4d24;
  --font-display: var(--font-space-grotesk);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
}

@layer base {
  html { scroll-behavior: smooth; }
  body {
    background: var(--color-ink);
    color: var(--color-snow);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  /* film-grain overlay */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 50;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.02em; }
  ::selection { background: var(--color-ember); color: var(--color-ink); }
  :focus-visible { outline: 2px solid var(--color-ember); outline-offset: 3px; }
}

/* code blocks (rehype-highlight emits hljs classes) */
pre { background: var(--color-surface); border: 1px solid var(--color-line); border-radius: 8px; padding: 1rem; overflow-x: auto; font-size: 0.875rem; }
code { font-family: var(--font-mono); }
.hljs-keyword, .hljs-selector-tag, .hljs-literal { color: #ff7b5c; }
.hljs-string, .hljs-attr { color: #9ece6a; }
.hljs-title, .hljs-name { color: #7aa2f7; }
.hljs-comment { color: #565f89; font-style: italic; }
.hljs-number, .hljs-built_in { color: #e0af68; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: Root layout + placeholder home + transition template**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.muratoncu.com"),
  title: { default: "Murat Öncü — Frontend Developer", template: "%s — Murat Öncü" },
  description:
    "Frontend developer building fast, polished web apps with React, Next.js and TypeScript.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/template.tsx
"use client";
import { motion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
```

```tsx
// app/page.tsx (placeholder, replaced in Task 5)
export default function Home() {
  return <main className="p-10 font-display text-4xl">muratoncu.com — rebuild in progress</main>;
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: compiles clean, zero TS errors, routes `/`, `/blogs` redirects registered.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat!: scaffold Next.js 15 App Router, remove Pages Router app and MongoDB runtime"
```

---

### Task 3: Data layer — site constants, blog loader, projects curation, experience (with tests)

**Files:**
- Create: `lib/site.ts`, `lib/blog.ts`, `lib/projects.ts`, `data/experience.ts`, `vitest.config.ts`
- Test: `lib/__tests__/blog.test.ts`, `lib/__tests__/projects.test.ts`
- Delete: `data/experiencesData.ts` (after porting)
- Modify: `package.json` (add `"test": "vitest run"`)

**Interfaces:**
- Produces:
  - `site: { name, shortName, url, description, email, socials: {github, x, linkedin, medium} }`
  - `type Post = { slug, title, description, date, updated: string|null, tags: string[], readTime: number, image: string, content: string }`; `getPosts(): Post[]` (sorted desc by date); `getPost(slug): Post | undefined`
  - `type Project = { slug, title, description, technologies: string[], githubUrl, liveUrl, imageUrl, featured: boolean, group: "featured" | "work" | "learning" }`; `getProjects(): Project[]`; `getProject(slug): Project | undefined`; `featuredProjects(): Project[]` (Event Manager + E-Price first)
  - `type Job = { company, title, description, startDate, endDate, points: string[], technologies: string[] }`; `experience: Job[]`

- [ ] **Step 1: Site constants**

```ts
// lib/site.ts
export const site = {
  name: "Murat Hüdavendigâr Öncü",
  shortName: "Murat Öncü",
  url: "https://www.muratoncu.com",
  description:
    "Frontend developer building fast, polished web apps with React, Next.js and TypeScript.",
  email: "contact@muratoncu.com",
  socials: {
    github: "https://github.com/murathudavendigar",
    x: "https://x.com/murathoncu",
    linkedin: "https://www.linkedin.com/in/murathudavendigaroncu/",
    medium: "https://medium.com/@murathoncu",
  },
} as const;
```

- [ ] **Step 2: Write failing tests**

```ts
// lib/__tests__/blog.test.ts
import { describe, expect, it } from "vitest";
import { getPost, getPosts } from "../blog";

describe("blog loader", () => {
  it("loads all 13 exported posts sorted newest first", () => {
    const posts = getPosts();
    expect(posts.length).toBe(13);
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
  it("parses frontmatter and content", () => {
    const post = getPost("what-is-a-list-in-python");
    expect(post?.title).toBe("What Is a List in Python?");
    expect(post?.content.length).toBeGreaterThan(100);
    expect(post?.tags.length).toBeGreaterThan(0);
  });
  it("returns undefined for unknown slug", () => {
    expect(getPost("nope")).toBeUndefined();
  });
});
```

```ts
// lib/__tests__/projects.test.ts
import { describe, expect, it } from "vitest";
import { featuredProjects, getProject, getProjects } from "../projects";

describe("projects", () => {
  it("loads all exported projects with slugs", () => {
    const all = getProjects();
    expect(all.length).toBe(19);
    expect(all.every((p) => /^[a-z0-9-]+$/.test(p.slug))).toBe(true);
  });
  it("features Event Manager first", () => {
    const featured = featuredProjects();
    expect(featured[0].title).toBe("Event Manager");
    expect(featured.length).toBeLessThanOrEqual(4);
  });
  it("demotes tutorial clones to learning group", () => {
    expect(getProject("nextjs-amazon-clone")?.group).toBe("learning");
  });
});
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["lib/__tests__/**/*.test.ts"] } });
```

- [ ] **Step 3: Run tests, verify they fail**

Run: `npx vitest run`
Expected: FAIL — cannot resolve `../blog`, `../projects`.

- [ ] **Step 4: Implement loaders**

```ts
// lib/blog.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string | null;
  tags: string[];
  readTime: number;
  image: string;
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getPosts(): Post[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        updated: (data.updated as string | null) ?? null,
        tags: (data.tags as string[]) ?? [],
        readTime: (data.readTime as number) ?? 5,
        image: (data.image as string) ?? "",
        content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
```

```ts
// lib/projects.ts
import raw from "@/data/projects-export.json";

type RawProject = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
};

export type Project = RawProject & { slug: string; group: "featured" | "work" | "learning" };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Curation: originals headline; tutorial clones demoted.
const FEATURED = ["event-manager", "e-price-e-commerce-project"];
const LEARNING = /clone|chatgpt|netflix/i;

export function getProjects(): Project[] {
  const projects = (raw as RawProject[]).map((p) => {
    const slug = slugify(p.title);
    const group: Project["group"] = FEATURED.includes(slug)
      ? "featured"
      : LEARNING.test(p.title)
        ? "learning"
        : "work";
    return { ...p, slug, group };
  });
  const order = { featured: 0, work: 1, learning: 2 };
  return projects.sort((a, b) => order[a.group] - order[b.group]);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function featuredProjects(): Project[] {
  const all = getProjects();
  const named = FEATURED.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Project[];
  const rest = all.filter((p) => p.group === "work" && !named.includes(p));
  return [...named, ...rest].slice(0, 4);
}
```

Port `data/experiencesData.ts` → `data/experience.ts`: copy every entry, mapping `usedTechnologiesImages` image imports to plain tech-name strings (e.g. `"React"`, `"Next.js"`, `"TypeScript"`) and dropping `companyImage`:

```ts
// data/experience.ts — shape (fill ALL entries from data/experiencesData.ts before deleting it)
export type Job = {
  company: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  points: string[];
  technologies: string[];
};

export const experience: Job[] = [
  {
    company: "euroTech Study GmbH",
    title: "Frontend Instructor",
    description: "Delivering comprehensive frontend training programs to aspiring developers.",
    startDate: "May 2025",
    endDate: "Feb 2026",
    points: [
      "Instructed students on HTML, CSS, JavaScript, React.js, and Next.js fundamentals.",
      "Provided real-world examples and coding exercises to reinforce learning.",
      "Mentored students through project-based learning and one-on-one guidance.",
      "Prepared assessments and hands-on tasks to track learning progress.",
      "Fostered a collaborative and inclusive remote learning environment.",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  // ...port the remaining entries the same way (Tem Craft Tech, NAGE, Wise Quarter, Eypes, Freelance, Assa Teknoloji)
];
```

Then `git rm data/experiencesData.ts`.

- [ ] **Step 5: Run tests, verify pass**

Run: `npx vitest run`
Expected: all tests PASS. If the Amazon clone slug differs from `nextjs-amazon-clone`, check `data/projects-export.json` titles and fix the TEST expectation to the real slug (slugify is the source of truth).

- [ ] **Step 6: Verify build, commit**

Run: `npm run build` → clean.

```bash
git add -A
git commit -m "feat: add file-based data layer with blog loader, project curation, experience data"
```

---

### Task 4: Site shell — nav, footer, reveal primitive, metadata + JSON-LD

**Files:**
- Create: `components/nav.tsx`, `components/footer.tsx`, `components/reveal.tsx`, `components/section-heading.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `site` from `lib/site.ts`.
- Produces: `<Nav />`, `<Footer />`, `<Reveal delay?: number>` (scroll-triggered fade-up wrapper, fires once), `<SectionHeading index: string, title: string>` (mono accent number + display heading).

- [ ] **Step 1: Reveal primitive**

```tsx
// components/reveal.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Section heading**

```tsx
// components/section-heading.tsx
export default function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="font-mono text-sm text-ember">{index}</span>
      <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
      <span className="hidden h-px flex-1 bg-line md:block" aria-hidden />
    </div>
  );
}
```

- [ ] **Step 3: Nav (fixed top bar, mono links, active accent)**

```tsx
// components/nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "index" },
  { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/about", label: "about" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          murat<span className="text-ember">öncü</span>
        </Link>
        <ul className="flex items-center gap-6 font-mono text-sm">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`transition-colors hover:text-ember ${active ? "text-ember" : "text-fog"}`}
                >
                  /{l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Footer**

```tsx
// components/footer.tsx
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 font-mono text-sm text-fog md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {site.shortName}</p>
        <ul className="flex gap-5">
          {Object.entries(site.socials).map(([name, url]) => (
            <li key={name}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ember">
                {name}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-ember">email</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Wire into layout + JSON-LD Person**

In `app/layout.tsx` body, replace `{children}` with:

```tsx
<body>
  <Nav />
  <main className="pt-16">{children}</main>
  <Footer />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name,
        url: site.url,
        jobTitle: "Frontend Developer",
        email: `mailto:${site.email}`,
        sameAs: Object.values(site.socials),
      }),
    }}
  />
</body>
```

(add imports for `Nav`, `Footer`, `site`).

- [ ] **Step 6: Verify + commit**

Run: `npm run build` → clean. `npm run dev`, check nav/footer render, keyboard-tab through links, focus rings visible.

```bash
git add -A
git commit -m "feat: add site shell with nav, footer, reveal primitive, and Person JSON-LD"
```

---

### Task 5: Home page — hero, selected work, experience snapshot, contact

**Files:**
- Create: `components/hero.tsx`, `components/project-card.tsx`, `components/contact-form.tsx`
- Modify: `app/page.tsx` (replace placeholder)

**Interfaces:**
- Consumes: `featuredProjects()`, `experience`, `site`, `<Reveal>`, `<SectionHeading>`.
- Produces: `<ProjectCard project: Project, index: number>` (reused on /projects).

- [ ] **Step 1: Hero with cursor-aware glow**

```tsx
// components/hero.tsx
"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";

export default function Hero() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <section
      aria-label="Intro"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden px-6"
      onPointerMove={(e) => {
        if (reduce) return;
        x.set(e.clientX - window.innerWidth / 2);
        y.set(e.clientY - window.innerHeight / 2);
      }}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ x: sx, y: sy }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[120px]"
        />
      )}
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-6 font-mono text-sm text-ember">frontend developer — react · next.js · typescript</p>
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] md:text-8xl">
          Building fast, polished interfaces for the modern web.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-fog">
          I&apos;m Murat Hüdavendigâr Öncü — I design and ship web apps end to end,
          and teach others to do the same.
        </p>
        <div className="mt-10 flex gap-4 font-mono text-sm">
          <Link href="/projects" className="border border-ember bg-ember px-6 py-3 text-ink transition-colors hover:bg-transparent hover:text-ember">
            view work
          </Link>
          <Link href="#contact" className="border border-line px-6 py-3 text-snow transition-colors hover:border-ember hover:text-ember">
            get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Project card**

```tsx
// components/project-card.tsx
import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-line bg-surface p-8 transition-colors hover:border-ember"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-sm text-ember">{String(index + 1).padStart(2, "0")}</span>
        <span className="font-mono text-xs text-fog">{project.technologies.join(" · ")}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold transition-colors group-hover:text-ember">{project.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fog">{project.description}</p>
      <span className="mt-6 inline-block font-mono text-xs text-fog transition-transform group-hover:translate-x-1 group-hover:text-ember">
        case study →
      </span>
    </Link>
  );
}
```

- [ ] **Step 3: Contact form (EmailJS, inline status)**

```tsx
// components/contact-form.tsx
"use client";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type Inputs = { name: string; email: string; message: string };

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();

  const onSubmit = async () => {
    if (!form.current) return;
    setStatus("sending");
    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        "template_4mm0dyn",
        form.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const field = "w-full border border-line bg-surface px-4 py-3 text-sm text-snow placeholder:text-fog/60 focus:border-ember focus:outline-none";

  return (
    <form ref={form} onSubmit={handleSubmit(onSubmit)} className="grid max-w-xl gap-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="sr-only">Name</span>
          <input placeholder="name" className={field} {...register("name", { required: true })} />
        </label>
        <label className="grid gap-1">
          <span className="sr-only">Email</span>
          <input type="email" placeholder="email" className={field} {...register("email", { required: true, pattern: /.+@.+\..+/ })} />
        </label>
      </div>
      <label className="grid gap-1">
        <span className="sr-only">Message</span>
        <textarea placeholder="message" rows={5} className={field} {...register("message", { required: true })} />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start border border-ember bg-ember px-6 py-3 font-mono text-sm text-ink transition-colors hover:bg-transparent hover:text-ember disabled:opacity-50"
      >
        {status === "sending" ? "sending…" : "send message"}
      </button>
      <p role="status" className="font-mono text-xs">
        {status === "sent" && <span className="text-ember">message sent — thank you.</span>}
        {status === "error" && <span className="text-red-400">failed to send. try email instead.</span>}
        {(errors.name || errors.email || errors.message) && <span className="text-red-400">all fields required (valid email).</span>}
      </p>
    </form>
  );
}
```

- [ ] **Step 4: Compose home page**

```tsx
// app/page.tsx
import ContactForm from "@/components/contact-form";
import Hero from "@/components/hero";
import ProjectCard from "@/components/project-card";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { experience } from "@/data/experience";
import { featuredProjects } from "@/lib/projects";
import { site } from "@/lib/site";
import Link from "next/link";

export default function Home() {
  const projects = featuredProjects();
  const jobs = experience.slice(0, 3);
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="work">
        <Reveal><SectionHeading index="01" title="Selected work" /></Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}><ProjectCard project={p} index={i} /></Reveal>
          ))}
        </div>
        <Reveal>
          <Link href="/projects" className="mt-10 inline-block font-mono text-sm text-fog transition-colors hover:text-ember">
            all projects →
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="experience">
        <Reveal><SectionHeading index="02" title="Experience" /></Reveal>
        <ol className="grid gap-px bg-line">
          {jobs.map((job) => (
            <Reveal key={job.company}>
              <li className="grid gap-2 bg-ink py-6 md:grid-cols-[12rem_1fr] md:gap-8">
                <span className="font-mono text-xs text-fog">{job.startDate} — {job.endDate}</span>
                <div>
                  <h3 className="font-semibold">{job.title} · <span className="text-fog">{job.company}</span></h3>
                  <p className="mt-1 text-sm text-fog">{job.description}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <Link href="/about" className="mt-10 inline-block font-mono text-sm text-fog transition-colors hover:text-ember">
            full story →
          </Link>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="contact-heading">
        <Reveal><SectionHeading index="03" title="Get in touch" /></Reveal>
        <Reveal>
          <p className="mb-8 max-w-xl text-fog">
            Open to frontend roles and freelance projects. Reach me through the form or at{" "}
            <a href={`mailto:${site.email}`} className="text-snow underline decoration-ember underline-offset-4">{site.email}</a>.
          </p>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Verify + commit**

Run: `npm run build` → clean. `npm run dev`: hero glow follows cursor (and is absent with macOS "Reduce motion" on), reveals stagger, form validates empty submit, card hover states work.

```bash
git add -A
git commit -m "feat: build home page with hero, selected work, experience snapshot, contact form"
```

---

### Task 6: Projects index + case-study pages

**Files:**
- Create: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProjects()`, `getProject(slug)`, `<ProjectCard>`, `<Reveal>`, `<SectionHeading>`.

- [ ] **Step 1: Projects index (featured/work grid + demoted learning strip)**

```tsx
// app/projects/page.tsx
import ProjectCard from "@/components/project-card";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { getProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work and case studies by Murat Öncü — React, Next.js, TypeScript.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const all = getProjects();
  const main = all.filter((p) => p.group !== "learning");
  const learning = all.filter((p) => p.group === "learning");
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal><SectionHeading index="01" title="Projects" /></Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {main.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.08}><ProjectCard project={p} index={i} /></Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="mb-6 mt-24 font-mono text-sm text-fog">learning builds — tutorial-based, kept for the record</h2>
      </Reveal>
      <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {learning.map((p) => (
          <li key={p.slug} className="bg-ink py-4 pr-4">
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="group font-mono text-sm text-fog transition-colors hover:text-ember">
              {p.title} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Case-study page**

```tsx
// app/projects/[slug]/page.tsx
import Reveal from "@/components/reveal";
import { getProject, getProjects } from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description.slice(0, 160),
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <Link href="/projects" className="font-mono text-sm text-fog transition-colors hover:text-ember">← projects</Link>
        <h1 className="mt-6 text-4xl font-bold md:text-6xl">{project.title}</h1>
        <p className="mt-4 font-mono text-sm text-ember">{project.technologies.join(" · ")}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-10 text-lg leading-relaxed text-fog">{project.description}</p>
        <div className="mt-10 flex gap-4 font-mono text-sm">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="border border-ember bg-ember px-6 py-3 text-ink transition-colors hover:bg-transparent hover:text-ember">
              live site ↗
            </a>
          )}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="border border-line px-6 py-3 transition-colors hover:border-ember hover:text-ember">
            github ↗
          </a>
        </div>
      </Reveal>
    </article>
  );
}
```

- [ ] **Step 3: Verify + commit**

Run: `npm run build` → clean; static params generate a page per project. Dev-check: `/projects` shows grid + learning strip; a clone slug URL renders case study; unknown slug 404s.

```bash
git add -A
git commit -m "feat: add projects index with curated groups and per-project case-study pages"
```

---

### Task 7: Blog index + post pages with markdown rendering and OG images

**Files:**
- Create: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/blog/[slug]/opengraph-image.tsx`, `components/markdown.tsx`

**Interfaces:**
- Consumes: `getPosts()`, `getPost(slug)`, `<Reveal>`, `<SectionHeading>`.
- Produces: `<Markdown content: string>`.

- [ ] **Step 1: Markdown renderer**

```tsx
// components/markdown.tsx
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

Add to `app/globals.css` (typography for post bodies, no @tailwindcss/typography dep):

```css
.prose-custom { max-width: 65ch; color: var(--color-snow); line-height: 1.75; }
.prose-custom h2 { margin: 2.5rem 0 1rem; font-size: 1.5rem; font-weight: 600; }
.prose-custom h3 { margin: 2rem 0 0.75rem; font-size: 1.25rem; font-weight: 600; }
.prose-custom p { margin: 1rem 0; color: var(--color-fog); }
.prose-custom li { color: var(--color-fog); margin: 0.35rem 0; }
.prose-custom ul { list-style: disc; padding-left: 1.5rem; }
.prose-custom ol { list-style: decimal; padding-left: 1.5rem; }
.prose-custom a { color: var(--color-snow); text-decoration: underline; text-decoration-color: var(--color-ember); text-underline-offset: 4px; }
.prose-custom strong { color: var(--color-snow); }
.prose-custom blockquote { border-left: 2px solid var(--color-ember); padding-left: 1rem; font-style: italic; }
.prose-custom :not(pre) > code { background: var(--color-surface); border: 1px solid var(--color-line); border-radius: 4px; padding: 0.1rem 0.35rem; font-size: 0.85em; }
.prose-custom pre { margin: 1.25rem 0; }
.prose-custom table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.9rem; }
.prose-custom th, .prose-custom td { border: 1px solid var(--color-line); padding: 0.5rem 0.75rem; text-align: left; }
```

- [ ] **Step 2: Blog index**

```tsx
// app/blog/page.tsx
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { getPosts } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on React, Next.js, TypeScript, Python and the frontend craft.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getPosts();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal><SectionHeading index="01" title="Blog" /></Reveal>
      <ol className="grid gap-px bg-line">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={Math.min(i * 0.04, 0.3)}>
            <li className="bg-ink">
              <Link href={`/blog/${post.slug}`} className="group grid gap-2 py-6 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8">
                <time dateTime={post.date} className="font-mono text-xs text-fog">{post.date}</time>
                <div>
                  <h2 className="text-xl font-semibold transition-colors group-hover:text-ember">{post.title}</h2>
                  <p className="mt-1 text-sm text-fog">{post.description}</p>
                </div>
                <span className="font-mono text-xs text-fog">{post.readTime} min</span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 3: Post page with Article JSON-LD**

```tsx
// app/blog/[slug]/page.tsx
import Markdown from "@/components/markdown";
import { getPost, getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.date, tags: post.tags },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <Link href="/blog" className="font-mono text-sm text-fog transition-colors hover:text-ember">← blog</Link>
      <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-4 font-mono text-xs text-fog">
        <time dateTime={post.date}>{post.date}</time> · {post.readTime} min · {post.tags.join(", ")}
      </p>
      <div className="mt-12">
        <Markdown content={post.content} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            ...(post.updated && { dateModified: post.updated }),
            author: { "@type": "Person", name: site.name, url: site.url },
          }),
        }}
      />
    </article>
  );
}
```

- [ ] **Step 4: Dynamic OG image**

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { getPost } from "@/lib/blog";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0a0b", color: "#f4f4f5", padding: 64 }}>
        <div style={{ fontSize: 24, color: "#ff4d24", fontFamily: "monospace" }}>muratoncu.com/blog</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>{post?.title ?? "Blog"}</div>
        <div style={{ fontSize: 24, color: "#a1a1aa" }}>Murat Öncü — Frontend Developer</div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 5: Verify + commit**

Run: `npm run build` → clean, 13 static blog pages. Dev-check: index lists 13 posts; a post renders headings/lists/code with highlight colors; `/blog/<slug>/opengraph-image` returns PNG; `/blogs/<slug>` redirects.

```bash
git add -A
git commit -m "feat: add static markdown blog with article pages, JSON-LD, dynamic OG images"
```

---

### Task 8: About page

**Files:**
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: `experience`, `site`, `<Reveal>`, `<SectionHeading>`; photo `public/img/MHO.jpg`.

- [ ] **Step 1: Build page**

```tsx
// app/about/page.tsx
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { experience } from "@/data/experience";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Murat Hüdavendigâr Öncü — frontend developer and instructor. Story, experience, skills.",
  alternates: { canonical: "/about" },
};

const skills = {
  frontend: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "HTML", "CSS", "Redux"],
  backend: ["Python", "Django", "C#", ".NET", "Firebase", "PostgreSQL"],
  tools: ["Git", "Jira", "Postman", "Vercel"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="grid items-start gap-10 md:grid-cols-[1fr_16rem]">
          <div>
            <SectionHeading index="01" title="About" />
            <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-fog">
              <p>
                I&apos;m {site.name} — a frontend developer focused on React, Next.js and TypeScript,
                with backend experience in Django and .NET.
              </p>
              <p>
                I&apos;ve shipped production apps for companies and clients, and taught frontend
                development to new developers as an instructor. I care about interfaces that are
                fast, accessible, and feel considered.
              </p>
            </div>
          </div>
          <Image src="/img/MHO.jpg" alt={`Portrait of ${site.name}`} width={256} height={256} className="border border-line grayscale transition-all hover:grayscale-0" />
        </div>
      </Reveal>

      <section className="mt-24" aria-labelledby="experience">
        <Reveal><SectionHeading index="02" title="Experience" /></Reveal>
        <ol className="grid gap-px bg-line">
          {experience.map((job) => (
            <Reveal key={`${job.company}-${job.startDate}`}>
              <li className="grid gap-3 bg-ink py-8 md:grid-cols-[12rem_1fr] md:gap-8">
                <span className="font-mono text-xs text-fog">{job.startDate} — {job.endDate}</span>
                <div>
                  <h3 className="text-lg font-semibold">{job.title} · <span className="text-fog">{job.company}</span></h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-fog">
                    {job.points.map((point) => <li key={point}>— {point}</li>)}
                  </ul>
                  <p className="mt-3 font-mono text-xs text-ember">{job.technologies.join(" · ")}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mt-24" aria-labelledby="skills">
        <Reveal><SectionHeading index="03" title="Skills" /></Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {Object.entries(skills).map(([group, items]) => (
            <Reveal key={group}>
              <h3 className="mb-4 font-mono text-sm text-ember">{group}</h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <li key={skill} className="border border-line bg-surface px-3 py-1.5 text-sm text-fog">{skill}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run build` → clean. Dev-check `/about`: photo, full timeline (all ported jobs), skills groups.

```bash
git add -A
git commit -m "feat: add about page with story, full experience timeline, skills"
```

---

### Task 9: SEO finish — sitemap, robots, home OG image

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`

- [ ] **Step 1: Sitemap**

```ts
// app/sitemap.ts
import { getPosts } from "@/lib/blog";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/projects", "/blog", "/about"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const projects = getProjects().map((p) => ({ url: `${site.url}/projects/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 }));
  const posts = getPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updated ?? p.date, changeFrequency: "yearly" as const, priority: 0.7 }));
  return [...staticPages, ...projects, ...posts];
}
```

- [ ] **Step 2: Robots**

```ts
// app/robots.ts
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
```

- [ ] **Step 3: Home OG image**

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0a0b", color: "#f4f4f5", padding: 64 }}>
        <div style={{ fontSize: 24, color: "#ff4d24", fontFamily: "monospace" }}>www.muratoncu.com</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>Murat Öncü</div>
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>Frontend Developer — React · Next.js · TypeScript</div>
      </div>
    ),
    size,
  );
}
```

Also add canonical for home in `app/layout.tsx` metadata: `alternates: { canonical: "/" }`.

- [ ] **Step 4: Verify + commit**

Run: `npm run build`; then `npm run start` and check `curl -s localhost:3000/sitemap.xml | grep -c "<url>"` → 36 (4 static + 19 projects + 13 posts) and `curl -s localhost:3000/robots.txt` shows the sitemap line.

```bash
git add -A
git commit -m "feat: add sitemap, robots, and OG images for muratoncu.com"
```

---

### Task 10: Final cleanup + verification

**Files:**
- Modify: `README.md`, `package.json`
- Verify everything.

- [ ] **Step 1: Prune leftovers**

```bash
git rm -r --ignore-unmatch data/projectsData.ts data/experiencesData.ts scripts 2>/dev/null || true
npm prune
```

Keep `scripts/export-content.mjs` deleted only if content is committed (it is, Task 1). Check `package.json` has no `mongodb`; if `dev-console-kit` or others linger, uninstall.

- [ ] **Step 2: README rewrite**

Replace `README.md` content with: project title (`muratoncu.com`), one-paragraph description, stack list (Next.js 15, React 19, Tailwind 4, motion), `npm install && npm run dev` quickstart, note on `content/blog` markdown and `data/projects-export.json` as content sources, env vars needed (`NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`).

- [ ] **Step 3: Full verification pass**

Run and confirm:
- `npx vitest run` → all pass
- `npm run build` → zero errors, all routes static
- `npm run start`, then manually verify: `/`, `/projects`, one case study, `/blog`, one post, `/about`, `/blogs/<slug>` redirect, 404 page for junk slug
- Keyboard-only pass on home: all interactive elements reachable, focus visible
- macOS Reduce Motion on: no reveals/glow, content fully visible
- Lighthouse (Chrome DevTools, incognito) on `/`: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95. Fix regressions before committing.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final cleanup, README, verification for muratoncu.com rebuild"
```

---

## Post-plan (not tasks, user actions)

- Vercel: add `www.muratoncu.com` + apex redirect in project domains; env vars already set locally must exist in Vercel project settings.
- Google Search Console: add property, submit sitemap.
