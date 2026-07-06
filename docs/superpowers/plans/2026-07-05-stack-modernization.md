# Stack Modernization (Keep Design) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio to Next.js 15 App Router + React 19 with a file-based blog (markdown) and no MongoDB, while keeping the current design 100% pixel-identical.

**Architecture:** One-time export of MongoDB content (13 blog posts → `content/blog/*.md`, 19 projects → `data/projects.json` in the exact shape `components/Projects.tsx` consumes). Then upgrade dependencies with the Pages Router still running (Next 15 supports it), then cut routes over to the App Router one at a time: home first, blogs second. Comments and likes are dropped (user-approved). URLs do not change: `/`, `/blogs`, `/blogs/[slug]`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 3 (unchanged config), framer-motion 12, next-themes 0.4, react-toastify 11, gray-matter, react-markdown + remark-gfm + rehype-highlight (kept), vitest (dev).

## Global Constraints

- **ZERO visual changes.** Every className, animation, layout, and the theme toggle stay exactly as they are. The only approved UI deltas: like/comment counters and the comment section disappear from blog pages.
- URLs stay identical: `/`, `/blogs`, `/blogs/[slug]`. No redirects needed.
- Site URL: `https://www.muratoncu.com` (canonical, sitemap, OG, JSON-LD — port existing values from `lib/site.ts`, which already exists and stays).
- Tailwind stays at v3 with the existing `tailwind.config.js` (only `content` globs change to include `app/`).
- `styles/globals.css` content unchanged (Nunito Sans via CSS @import stays).
- Dark/light theme toggle via next-themes stays (`attribute="class"`, `enableSystem`).
- All components keep framer-motion animations → they become `"use client"` components.
- Existing SEO from the patch is preserved in App Router form: metadata API, canonical per route, OG/Twitter (default image `/img/og.jpg`), Person JSON-LD on home, Article JSON-LD on posts, sitemap, robots.
- After every task: `npx tsc --noEmit` passes and `npm run build` passes (except Task 1, which precedes the upgrade).
- **DO NOT git commit.** User commits manually. End each task by reporting what changed; wait for user between tasks if running interactively.
- `MONGODB_URI` lives in `.env.local`; needed only for Task 1's export script.

## File Structure (end state)

```
app/
  layout.tsx            html/body, fonts css import, Providers, metadata base, viewport
  providers.tsx         "use client": ThemeProvider + ToastContainer
  page.tsx              home (ported from pages/index.tsx) + Person JSON-LD
  blogs/page.tsx        blog index (ported, minus likes/comments)
  blogs/[slug]/page.tsx post page (ported, minus comments/likes) + Article JSON-LD
  sitemap.ts            static, from markdown posts
  robots.ts
components/             existing components, edited in place (see tasks)
lib/site.ts             unchanged
lib/blog.ts             markdown loader returning BlogPost-shaped objects
content/blog/*.md       13 exported posts
data/projects.json      19 exported projects (component shape)
scripts/export-content.mjs
```

Deleted by the end: `pages/` (entire dir), `lib/mongodb.ts`, `components/CommentSection.tsx`, `components/LikeButton.tsx`, `components/Seo.tsx`, `public/robots.txt`, empty dirs `app/about`, `app/blog`, `app/projects`, deps `mongodb`, `dev-console-kit`, `@next/font`, `react-simple-typewriter` stays (Hero uses it).

---

### Task 1: Export MongoDB content to repo files

**Files:**
- Create: `scripts/export-content.mjs`
- Create (generated): `content/blog/<slug>.md` × 13, `data/projects.json`

**Interfaces:**
- Produces: `content/blog/*.md` with frontmatter `{title, description, date (ISO), updated (ISO|null), tags (string[]), readTime (number), image (string), author (string)}`; `data/projects.json` as `Array<{img, name, description, url, language, github, featured}>` — exactly the shape `pages/api/projects.ts` returns today and `types/index.ts` `Projects` describes.

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
const iso = (v) => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return d.toISOString().slice(0, 10);
};

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
    `author: ${yamlStr(b.author ?? "Murat Hüdavendigâr Öncü")}`,
    "---",
    "",
  ].join("\n");
  const slug = b.slug || b._id.toString();
  writeFileSync(`content/blog/${slug}.md`, fm + (b.content ?? ""));
  console.log("wrote", slug);
}

// Same mapping pages/api/projects.ts uses today, so Projects.tsx renders identically.
const rawProjects = await db.collection("projects").find({}).toArray();
const projects = rawProjects.map((p) => ({
  img: p.imageUrl || "",
  name: p.title,
  description: p.description,
  url: p.liveUrl,
  language: p.technologies?.[0] || "Other",
  github: p.githubUrl,
  featured: p.featured || false,
}));
writeFileSync("data/projects.json", JSON.stringify(projects, null, 2) + "\n");
console.log("wrote", projects.length, "projects");
await client.close();
```

- [ ] **Step 2: Run it**

Run: `node scripts/export-content.mjs`
Expected: 13 `wrote <slug>` lines + `wrote 19 projects`.
Verify: `ls content/blog | wc -l` → 13. Spot-check one `.md` has frontmatter + markdown body. `head -20 data/projects.json` shows `img/name/description/url/language/github/featured` keys.

- [ ] **Step 3: Report to user** — content exported; user commits.

---

### Task 2: Upgrade to Next 15 / React 19 (Pages Router still running)

**Files:**
- Create: `.npmrc`
- Modify: `package.json`, `tsconfig.json` (`target`), `tailwind.config.js` (`content` globs), `components/Contact.tsx` (toastify v11 css), `pages/_app.tsx` (toastify v11 css)

**Interfaces:**
- Produces: a repo that builds on Next 15 + React 19 with the old Pages Router untouched. Later tasks rely on `npm run typecheck` and `npm run test` scripts existing.

- [ ] **Step 1: Add `.npmrc`** (react-simple-typewriter and react-social-icons declare old React peer ranges; they work fine on React 19)

```
legacy-peer-deps=true
```

- [ ] **Step 2: Upgrade dependencies**

```bash
npm uninstall @next/font
npm install next@15 react@19 react-dom@19 framer-motion@12 next-themes@0.4 react-toastify@11 gray-matter
npm install -D typescript@5 @types/react@19 @types/react-dom@19 eslint-config-next@15 vitest
```

- [ ] **Step 3: Add npm scripts** — in `package.json` `scripts`, add:

```json
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

- [ ] **Step 4: react-toastify v11 CSS** — v11 injects its own styles. In `pages/_app.tsx` delete the line `import "react-toastify/dist/ReactToastify.css";`. Check `components/Contact.tsx` for the same import; delete if present. Everything else in both files stays.

- [ ] **Step 5: tsconfig + tailwind globs**

In `tsconfig.json`: change `"target": "es5"` → `"target": "ES2022"`.
In `tailwind.config.js` `content`, add `"./app/**/*.{js,ts,jsx,tsx}"` alongside the existing two globs (needed by Tasks 4–5).

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` → 0 errors (fix any React-19 type fallout: e.g. `JSX.Element` → `React.JSX.Element` if it appears; components here use inferred returns so expect none).
Run: `npm run build` → compiles; all existing routes present. Toasts, theme toggle, typewriter verified by user in dev later.

- [ ] **Step 7: Report to user** — stack upgraded, old site still functional; user commits + can eyeball `npm run dev`.

---

### Task 3: Blog data layer (markdown loader) + tests

**Files:**
- Create: `lib/blog.ts`, `vitest.config.ts`
- Test: `lib/__tests__/blog.test.ts`

**Interfaces:**
- Consumes: `content/blog/*.md` from Task 1; `BlogPost` type from `types/index.ts`.
- Produces: `getPosts(): BlogPost[]` (sorted newest first), `getPost(slug: string): BlogPost | undefined`. Returned objects match the existing `BlogPost` type exactly (ms timestamps), so the page JSX ported in Task 5 works unchanged. `likes`/`commentCount` are omitted (optional in the type).

- [ ] **Step 1: Write failing tests**

```ts
// lib/__tests__/blog.test.ts
import { describe, expect, it } from "vitest";
import { getPost, getPosts } from "../blog";

describe("blog loader", () => {
  it("loads all 13 exported posts sorted newest first", () => {
    const posts = getPosts();
    expect(posts.length).toBe(13);
    const times = posts.map((p) => p.createdAt);
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });
  it("returns BlogPost-shaped objects with ms timestamps", () => {
    const post = getPosts()[0];
    expect(typeof post.createdAt).toBe("number");
    expect(post.createdAt).toBeGreaterThan(1_500_000_000_000);
    expect(typeof post.title).toBe("string");
    expect(Array.isArray(post.tags)).toBe(true);
    expect(post.published).toBe(true);
  });
  it("getPost finds by slug and returns content", () => {
    const first = getPosts()[0];
    const post = getPost(first.slug);
    expect(post?.content.length).toBeGreaterThan(100);
  });
  it("returns undefined for unknown slug", () => {
    expect(getPost("nope-nope")).toBeUndefined();
  });
});
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["lib/__tests__/**/*.test.ts"] } });
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm run test`
Expected: FAIL — cannot resolve `../blog`.

- [ ] **Step 3: Implement loader**

```ts
// lib/blog.ts
import type { BlogPost } from "@/types";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getPosts(): BlogPost[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(BLOG_DIR, f), "utf8"),
      );
      const createdAt = new Date(data.date as string).getTime();
      return {
        id: slug,
        title: (data.title as string) ?? "",
        description: (data.description as string) ?? "",
        content,
        imageUrl: (data.image as string) ?? "",
        date: createdAt,
        createdAt,
        updatedAt: data.updated ? new Date(data.updated as string).getTime() : null,
        author: (data.author as string) ?? "Murat Hüdavendigâr Öncü",
        slug,
        tags: (data.tags as string[]) ?? [],
        published: true,
        readTime: (data.readTime as number) ?? 5,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test` → all PASS.
Run: `npx tsc --noEmit` → clean.

- [ ] **Step 5: Report to user.**

---

### Task 4: App Router shell + home page cutover

**Files:**
- Create: `app/layout.tsx`, `app/providers.tsx`, `app/page.tsx`
- Modify: `components/Header.tsx` (router import), `components/Projects.tsx` (local JSON instead of fetch), add `"use client"` to interactive components
- Delete: `pages/index.tsx`, empty dirs `app/about`, `app/blog`, `app/projects`
- Keep for now: `pages/_app.tsx`, `pages/_document.tsx`, `pages/blogs/*`, `pages/api/*` (blogs cut over in Task 5; Pages and App Router coexist because no route collides once `pages/index.tsx` is gone)

**Interfaces:**
- Consumes: `site` from `lib/site.ts`.
- Produces: `<Providers>` client wrapper; App Router `/` route rendering the identical home page.

- [ ] **Step 1: Add `"use client"` directives** — add as the first line of each of these files (they use hooks and/or framer-motion): `components/Header.tsx`, `components/Hero.tsx`, `components/About.tsx`, `components/Experience.tsx`, `components/ExperienceCard.tsx`, `components/Skills.tsx`, `components/Skill.tsx`, `components/Projects.tsx`, `components/Contact.tsx`, `components/BackgroundCircles.tsx`. (`BlogCard.tsx` has no hooks — leave it without the directive.)

- [ ] **Step 2: Fix Header for App Router** — in `components/Header.tsx`:

Replace:
```ts
import { useRouter } from "next/router";
```
with:
```ts
import { usePathname } from "next/navigation";
```
Replace:
```ts
  const router = useRouter();
  ...
  const isOnBlogsPage = router.pathname.startsWith("/blogs");
```
with:
```ts
  const pathname = usePathname();
  ...
  const isOnBlogsPage = pathname?.startsWith("/blogs") ?? false;
```
Everything else in the file stays byte-identical.

- [ ] **Step 3: Projects from local JSON** — in `components/Projects.tsx`:

Delete the imports of `Logger` (`dev-console-kit`) and remove the whole first `useEffect` (the `fetchProjects` block, lines with `fetch("/api/projects")`). Delete the `loading` and `error` state. Replace the state initialization at the top of the component with:

```tsx
import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";
// ... existing imports minus Logger ...

const allProjectsData = projectsData as ProjectType[];

const Projects = (props: Props) => {
  const [showProjects, setShowProjects] = useState<ProjectType[]>(
    allProjectsData.filter((p) => p.featured === true),
  );
  const [lang, setLang] = useState("Featured");
```

Rewrite the filtering `useEffect` to use the constant:

```tsx
  useEffect(() => {
    if (lang === "Featured") {
      setShowProjects(allProjectsData.filter((project) => project.featured === true));
    } else if (lang === "All") {
      setShowProjects(allProjectsData);
    } else {
      setShowProjects(allProjectsData.filter((project) => project.language === lang));
    }
  }, [lang]);
```

In the JSX, delete the `loading ? (...) : error ? (...) :` branches — keep only the `showProjects.length === 0` empty-state branch and the main render. All classNames and markup stay identical. `tsconfig.json` already has `"resolveJsonModule": true`? If not, add it to `compilerOptions`.

- [ ] **Step 4: Providers + layout**

```tsx
// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
      <ToastContainer />
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.muratoncu.com"),
  title: {
    default: "Murat Hüdavendigâr Öncü — Frontend Developer",
    template: "%s — Murat Öncü",
  },
  description:
    "Frontend developer building fast, polished web apps with React, Next.js and TypeScript.",
  openGraph: {
    type: "website",
    siteName: "Murat Öncü",
    images: [{ url: "/img/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@murathoncu",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#313131",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

(`suppressHydrationWarning` is required by next-themes on the `html` element.)

- [ ] **Step 5: Home page** — create `app/page.tsx` by copying the JSX from `pages/index.tsx` exactly, with these changes only:
  - No `Head` import/usage (layout metadata covers it); no `Seo` import.
  - Add metadata + Person JSON-LD:

```tsx
// app/page.tsx (structure — JSX inside the root div copied verbatim from pages/index.tsx)
import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80 font-custom transition-all duration-500 scroll-smooth">
      {/* … sections copied verbatim from pages/index.tsx: Header, hero, about,
          experience, skills, projects, contact, footer Link/Image … */}
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
            image: `${site.url}/img/MHO.jpg`,
            sameAs: Object.values(site.socials),
          }),
        }}
      />
    </div>
  );
}
```

  Then delete `pages/index.tsx` and the empty dirs `app/about`, `app/blog`, `app/projects` (`rmdir`).

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` → clean. `npm run build` → `/` served by App Router, `/blogs/*` still by Pages Router, no route conflicts.
Dev-check list for user: theme toggle works, typewriter runs, projects carousel filters (Featured/All/React.JS/Next.JS/NPM), contact form toast fires, snap scroll behaves — all identical to before.

- [ ] **Step 7: Report to user.**

---

### Task 5: Blogs cutover + MongoDB removal

**Files:**
- Create: `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`
- Modify: `components/BlogCard.tsx` (drop likes/commentCount), `types/index.ts` (drop `Comment` type and `likes`/`commentCount` fields)
- Delete: `pages/` (entire remaining dir: `_app.tsx`, `_document.tsx`, `blogs/`, `api/`, `sitemap.xml.ts`), `lib/mongodb.ts`, `components/CommentSection.tsx`, `components/LikeButton.tsx`, `components/Seo.tsx`
- Modify: `package.json` (uninstall `mongodb`, `dev-console-kit`)

**Interfaces:**
- Consumes: `getPosts()`, `getPost(slug)` from `lib/blog.ts` (Task 3); `BlogCard`.
- Produces: static `/blogs` and `/blogs/[slug]` App Router routes.

- [ ] **Step 1: Blog index** — create `app/blogs/page.tsx`. Copy the component JSX from `pages/blogs/index.tsx` `BlogIndex` return block verbatim, with these changes only: no `Head`/`Seo` (metadata export instead), no `likes`/`commentCount` props on `BlogCard`, data from `getPosts()`:

```tsx
// app/blogs/page.tsx (structure — wrapper/list JSX copied verbatim from pages/blogs/index.tsx)
import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import { getPosts } from "@/lib/blog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on React, Next.js, TypeScript, Python and the frontend craft by Murat Hüdavendigâr Öncü.",
  alternates: { canonical: "/blogs" },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    /* copied JSX; inside the map: */
    /* <BlogCard key={post.id} title={post.title}
         date={new Date(post.date).toLocaleDateString()} slug={post.slug}
         description={post.description} imageUrl={post.imageUrl}
         readTime={post.readTime} tags={post.tags} author={post.author} /> */
    null /* replaced by real copied JSX */
  );
}
```

- [ ] **Step 2: Post page** — create `app/blogs/[slug]/page.tsx`. Copy the `BlogPost` component JSX from `pages/blogs/[slug]/index.tsx` verbatim, with these changes only:
  - Remove `CommentSection` and `LikeButton` imports and their two JSX usages (the `<LikeButton …/>` div in the header row and `<CommentSection postId={post.id} />` before the footer).
  - Remove `Head`/`Seo` usage; keep the Article JSON-LD `<script>` (already in the file) as-is.
  - Replace `getStaticPaths`/`getStaticProps` with:

```tsx
import { getPost, getPosts } from "@/lib/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      ...(post.updatedAt && {
        modifiedTime: new Date(post.updatedAt).toISOString(),
      }),
      tags: post.tags,
      images: [{ url: post.imageUrl || "/img/og.jpg" }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  // ... copied JSX from the old BlogPost component, using `post` ...
}
```

  Note: the markdown rendering block (`ReactMarkdown` with all the `components={{…}}` overrides and `highlight.js` CSS import) is copied unchanged. `react-markdown`'s `components` prop uses render callbacks → this page imports client-side pieces; if the build complains about `ReactMarkdown` in a server component, extract the entire `<ReactMarkdown …>` block into `components/MarkdownContent.tsx` with `"use client"` and props `{ content: string }`, moving the `highlight.js/styles/github-dark.css` import there too.

- [ ] **Step 3: BlogCard cleanup** — in `components/BlogCard.tsx`: delete `likes` and `commentCount` from the interface and destructuring, and delete the entire "stats" div (the two `<div className="flex items-center gap-1.5 …">` blocks showing heart/likes and bubble/commentCount inside the footer `div`). Keep the "Read more" side of the footer.

- [ ] **Step 4: Types cleanup** — in `types/index.ts`: delete the `Comment` type; delete `likes?` and `commentCount?` from `BlogPost`.

- [ ] **Step 5: Delete old code + deps**

```bash
rm -rf pages lib/mongodb.ts components/CommentSection.tsx components/LikeButton.tsx components/Seo.tsx
npm uninstall mongodb dev-console-kit
```

- [ ] **Step 6: Verify**

Run: `npm run test` → loader tests still pass. `npx tsc --noEmit` → clean.
Run: `npm run build` → `/blogs` + 13 static post pages, zero `λ` API routes, no MongoDB anywhere (`grep -r mongodb package.json` → nothing).
Dev-check for user: `/blogs` grid identical minus like/comment counters; a post renders markdown + code highlighting identically minus comments.

- [ ] **Step 7: Report to user.**

---

### Task 6: SEO finish — sitemap, robots

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Delete: `public/robots.txt` (replaced by `app/robots.ts`; keeping both breaks the build)

- [ ] **Step 1: Sitemap**

```ts
// app/sitemap.ts
import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().map((p) => ({
    url: `${site.url}/blogs/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.createdAt),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/blogs`, changeFrequency: "weekly", priority: 0.8 },
    ...posts,
  ];
}
```

- [ ] **Step 2: Robots**

```ts
// app/robots.ts
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Delete `public/robots.txt`**, then verify:

Run: `npm run build && npm run start` then:
`curl -s localhost:3000/sitemap.xml | grep -c "<url>"` → 15.
`curl -s localhost:3000/robots.txt` → shows sitemap line.
`curl -s localhost:3000/ | grep -o 'rel="canonical"[^>]*'` → `https://www.muratoncu.com/`.

- [ ] **Step 4: Report to user.**

---

### Task 7: Final cleanup + verification

**Files:**
- Modify: `README.md`, `next.config.js`

- [ ] **Step 1: next.config.js** — migrate deprecated `images.domains` to `remotePatterns` (same three hosts):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "www.citypng.com" },
      { protocol: "https", hostname: "icon.icepanel.io" },
    ],
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: README** — update stack section: Next.js 15 (App Router), React 19, Tailwind 3, markdown blog in `content/blog/` (add a post = add a `.md` file with the frontmatter keys `title, description, date, updated, tags, readTime, image, author` + push), projects in `data/projects.json`. Env vars: only the two `NEXT_PUBLIC_EMAILJS_*` keys; `MONGODB_URI` no longer needed at runtime.

- [ ] **Step 3: Full verification pass**

- `npm run test` → pass
- `npx tsc --noEmit` → clean
- `npm run build` → all routes static (`○`/`●`), no `λ` pages
- `npm run start` + manual check of `/`, `/blogs`, one post, junk slug → 404
- Lighthouse (incognito) on `/`: expect Performance improvement over the old build; SEO ≥ 95
- User eyeballs: pixel-identical home (toggle, typewriter, snap scroll, projects carousel, contact toast), blogs identical minus likes/comments

- [ ] **Step 4: Report final summary to user** — including the new blog workflow: **new post = new `content/blog/<slug>.md` + git push** (no more Mongo, no ISR delay; deploy publishes it).
