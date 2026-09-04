# Site Redesign — Foundation & Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure muratoncu.com from a single-page anchor-scroll site into a multi-page Next.js App Router site (`/`, `/about`, `/work` + `/work/[slug]`, `/writing` + `/writing/archive` + `/writing/[slug]`, `/contact`), migrating all existing content as-is (no copy rewrite), with redirects preserving indexed SEO equity.

**Architecture:** Existing components (`About`, `Experience`, `Skills`, `Projects`, `Contact`) are un-pinned from the old single-viewport snap-scroll shell and mounted on dedicated routes. `Header` becomes a real multi-page nav instead of anchor links. `lib/schema.ts` and `lib/blog.ts` are extended (not rewritten) to support the new routes. This is **Plan 1 of a multi-plan redesign** — it is deliberately mechanical: existing copy is migrated verbatim except where a technical/CWV fix requires a change (static hero headline instead of looping typewriter — same words, no longer animated). New copy, case studies, and visual polish are separate follow-up plans written after this one ships and after the case-study interview happens.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-04-site-redesign-design.md`

## Global Constraints

- Single accent color `#CA3E47` stays; no new brand color changes in this plan (font/palette polish is deferred per spec §9).
- No fabricated content — every migrated task uses existing real data (`data/projects.json`, `data/experiencesData.ts`, `data/skillsData.ts`, `content/blog/*.md`).
- No i18n.
- No CMS or backend/database migration — content stays as markdown + data files.
- **Owner commits manually — do not run `git commit` as part of executing this plan.** Each task ends with a verification step, not a commit step. Leave changes unstaged/staged for the owner to review and commit themselves.
- Old indexed URLs (`/projects/[slug]`, `/blogs`, `/blogs/[slug]`) must keep resolving via redirect, not 404.

---

### Task 1: Visual foundation — mono type token

**Files:**
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: Tailwind `font-mono-ui` utility class and CSS variable `--font-geist-mono`, available to all later tasks for meta/label text (dates, tags, stack badges).

- [ ] **Step 1: Add the mono font to the root layout**

In `app/layout.tsx`, add the import and font instance alongside the existing `Nunito_Sans` one:

```tsx
import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import { site } from "@/lib/site";
import "@/styles/globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
```

Update the `<html>` tag's `className` to include both font variables:

```tsx
<html
  lang="en"
  suppressHydrationWarning
  className={`${nunitoSans.variable} ${geistMono.variable}`}>
```

- [ ] **Step 2: Register the Tailwind font family**

In `tailwind.config.js`, add `mono-ui` next to the existing `custom` entry:

```js
theme: {
  extend: {
    fontFamily: {
      custom: ["var(--font-nunito-sans)", "sans-serif"],
      "mono-ui": ["var(--font-geist-mono)", "monospace"],
    },
  },
},
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed with no errors. The `font-mono-ui` utility class is now available for use in later tasks (case-study meta, tags, dates).

---

### Task 2: `lib/schema.ts` — point writing schema at `/writing`

**Files:**
- Modify: `lib/schema.ts`
- Modify: `lib/__tests__/schema.test.ts`

**Interfaces:**
- Consumes: `absoluteUrl`, `site` from `@/lib/site`; `personId`, `websiteId` already defined in this file.
- Produces: `blogPostingGraph` and `blogIndexSchema` keep their existing names/signatures but now emit `/writing/...` URLs instead of `/blogs/...`. (The `projectSchema` → `workSchema` rename happens later, in Task 6, atomically with updating its one call site — see that task for why.)

- [ ] **Step 1: Point `blogPostingGraph` at `/writing`**

In `lib/schema.ts`, in `blogPostingGraph`, change:

```ts
const url = absoluteUrl(`/blogs/${post.slug}`);
```

to:

```ts
const url = absoluteUrl(`/writing/${post.slug}`);
```

and in the `BreadcrumbList.itemListElement`, change the position-2 entry from:

```ts
{
  "@type": "ListItem",
  position: 2,
  name: "Blog",
  item: absoluteUrl("/blogs"),
},
```

to:

```ts
{
  "@type": "ListItem",
  position: 2,
  name: "Writing",
  item: absoluteUrl("/writing"),
},
```

- [ ] **Step 2: Point `blogIndexSchema` at `/writing`**

In `lib/schema.ts`, replace the body of `blogIndexSchema` so every `/blogs` reference becomes `/writing`:

```ts
export function blogIndexSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/writing")}#webpage`,
    url: absoluteUrl("/writing"),
    name: "Writing — Murat Hüdavendigâr Öncü",
    description:
      "Writing on React, Next.js, TypeScript and the frontend craft by Murat Hüdavendigâr Öncü.",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/writing/${post.slug}`),
        name: post.title,
      })),
    },
  };
}
```

- [ ] **Step 3: Write the tests**

In `lib/__tests__/schema.test.ts`, add:

```ts
describe("blogPostingGraph — writing URLs", () => {
  it("points at /writing/ instead of /blogs/", () => {
    const graph = blogPostingGraph({
      slug: "test-post",
      title: "Test",
      description: "Test description",
      createdAt: Date.now(),
      updatedAt: null,
      tags: ["test"],
    } as any)["@graph"];
    const posting = graph.find((n: any) => n["@type"] === "BlogPosting") as any;
    expect(posting.url).toBe("https://www.muratoncu.com/writing/test-post");
    const breadcrumb = graph.find((n: any) => n["@type"] === "BreadcrumbList") as any;
    expect(breadcrumb.itemListElement[1].name).toBe("Writing");
  });
});
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: all tests pass. (`npm run typecheck`/`npm run build` also still pass at this point — this task doesn't remove or rename any existing export, so nothing else in the codebase can be broken by it.)

---

### Task 3: `lib/blog.ts` — flagship vs. archive split

**Files:**
- Modify: `lib/blog.ts`
- Modify: `lib/__tests__/blog.test.ts`

**Interfaces:**
- Consumes: existing `getPosts()` from this file.
- Produces: `getFlagshipPosts(): BlogPost[]`, `getArchivedPosts(): BlogPost[]`, `isArchivedPost(post: BlogPost): boolean` — all exported. Task 7 depends on `getFlagshipPosts` and `getArchivedPosts`.

- [ ] **Step 1: Write the failing tests**

In `lib/__tests__/blog.test.ts`, add:

```ts
import { getArchivedPosts, getFlagshipPosts, getPost, getPosts } from "../blog";

describe("flagship/archive split", () => {
  it("splits all 13 posts into flagship and archived with no overlap", () => {
    const flagship = getFlagshipPosts();
    const archived = getArchivedPosts();
    expect(flagship.length + archived.length).toBe(13);
    const archivedSlugs = new Set(archived.map((p) => p.slug));
    for (const post of flagship) {
      expect(archivedSlugs.has(post.slug)).toBe(false);
    }
  });

  it("archives Python/Django tagged posts", () => {
    const archivedSlugs = getArchivedPosts().map((p) => p.slug);
    expect(archivedSlugs).toContain("a-beginners-guide-to-django-web-framework");
    expect(archivedSlugs).toContain("what-is-a-tuple-in-python");
    expect(archivedSlugs).toContain("what-is-a-list-in-python");
    expect(archivedSlugs).toContain("what-is-a-set-in-python");
    expect(archivedSlugs).toContain("what-is-a-dictionary-in-python");
    expect(archivedSlugs).toContain("connecting-django-views-to-models");
    expect(archivedSlugs).toContain("django-views-and-templates");
  });

  it("keeps React/TypeScript posts in flagship", () => {
    const flagshipSlugs = getFlagshipPosts().map((p) => p.slug);
    expect(flagshipSlugs).toContain(
      "react-hooks-essential-strategies-custom-solutions",
    );
    expect(flagshipSlugs).toContain(
      "typescript-supercharge-your-javascript-with-type-safety",
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/__tests__/blog.test.ts`
Expected: FAIL with "getFlagshipPosts is not a function" (or similar — the exports don't exist yet).

- [ ] **Step 3: Implement the split**

In `lib/blog.ts`, add below the existing `getPost` function:

```ts
const ARCHIVE_TAGS = ["python", "django"];

export function isArchivedPost(post: BlogPost): boolean {
  return post.tags.some((tag) => ARCHIVE_TAGS.includes(tag.toLowerCase()));
}

export function getFlagshipPosts(): BlogPost[] {
  return getPosts().filter((post) => !isArchivedPost(post));
}

export function getArchivedPosts(): BlogPost[] {
  return getPosts().filter(isArchivedPost);
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run lib/__tests__/blog.test.ts`
Expected: PASS — all tests green.

---

### Task 4: `Header.tsx` — multi-page navigation

**Files:**
- Modify: `components/Header.tsx`

**Interfaces:**
- Consumes: `usePathname` from `next/navigation`, `useTheme` from `next-themes` (unchanged).
- Produces: real `<Link>` navigation to `/about`, `/work`, `/writing`, `/contact`. No more anchor-hash or `isOnBlogsPage` logic. Every later page task renders `<Header />` unchanged.

- [ ] **Step 1: Replace the component**

Replace the full contents of `components/Header.tsx` with:

```tsx
"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
] as const;

const Header = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [toggle, setToggle] = useState<boolean>();

  useEffect(() => {
    setToggle(theme === "light");
  }, [theme]);

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 p-5 mx-auto max-w-7xl">
      <Link
        href="/"
        className="text-sm font-semibold uppercase tracking-widest text-gray-200 dark:text-gray-900 hover:text-[#CA3E47] transition-colors">
        Murat Öncü
      </Link>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm uppercase tracking-wider">
        {NAV_LINKS.map((link) => {
          const active =
            pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                active
                  ? "text-[#CA3E47]"
                  : "text-gray-300 dark:text-gray-800 hover:text-[#CA3E47]"
              }`}>
              {link.label}
            </Link>
          );
        })}
      </motion.nav>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1">
          <SocialIcon
            url="https://github.com/murathudavendigar"
            fgColor="gray"
            bgColor="transparent"
            style={{ height: 32, width: 32 }}
          />
          <SocialIcon
            url="https://www.linkedin.com/in/murathudavendigaroncu/"
            fgColor="gray"
            bgColor="transparent"
            style={{ height: 32, width: 32 }}
          />
        </div>

        <button
          type="button"
          aria-label="Toggle dark mode"
          className={`w-8 h-5 md:w-16 md:h-10 flex items-center bg-gray-300 rounded-full p-1 ${
            toggle ? "bg-red-500 justify-end" : "justify-start"
          }`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          <motion.div
            layout
            className="w-4 h-4 bg-white rounded-full shadow-md md:w-8 md:h-8"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed.

---

### Task 5: `/about` route — About + Experience + Skills

**Files:**
- Modify: `components/About.tsx`
- Modify: `components/Experience.tsx`
- Modify: `components/Skills.tsx`
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: `experiencesData` from `@/data/experiencesData`, `skillsData` from `@/data/skillsData` (unchanged), `site` from `@/lib/site`.
- Produces: `/about` route rendering all three components in normal page flow (no `h-screen`/full-viewport pinning).

- [ ] **Step 1: Un-pin `About.tsx` from the full-viewport shell**

Replace the full contents of `components/About.tsx` with:

```tsx
"use client";
import { site } from "@/lib/site";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const faqs = [
  {
    q: "Who is Murat Öncü?",
    a: "Murat Hüdavendigâr Öncü is a frontend-focused full-stack developer, co-founder of TemCraft Tech, and a frontend instructor, based in the Netherlands. He builds with React, Next.js, and TypeScript, and teaches modern web development to students across Europe.",
  },
  {
    q: "What does he build with?",
    a: "React, Next.js, and TypeScript on the frontend, with Django and .NET on the backend when products need it.",
  },
  {
    q: "Where is he based?",
    a: "The Netherlands, working remotely with teams and students across Europe.",
  },
] as const;

const About = () => {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="max-w-7xl px-6 py-20 mx-auto md:px-10">
      <h3 className="text-center md:text-left uppercase tracking-[12px] md:tracking-[20px] text-gray-200 dark:text-gray-700 text-xl md:text-2xl mb-10">
        About
      </h3>

      <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start md:justify-evenly">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          transition={{ duration: 1.2 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex-shrink-0">
          <Image
            src={site.profileImage}
            alt="Murat Hüdavendigâr Öncü at work"
            width={500}
            height={500}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover md:rounded-lg md:h-80 md:w-80 lg:h-96 lg:w-96"
            loading="lazy"
          />
        </motion.div>

        <div className="mt-4 mb-8 md:mb-0 md:mt-0 space-y-3 md:space-y-6 px-0 md:px-10 max-w-xl w-full">
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-semibold dark:text-gray-900">
            A Bit About Me
          </h4>
          <div className="space-y-2 md:space-y-4 text-xs sm:text-sm leading-relaxed">
            <p>
              I&apos;m Murat Hüdavendigâr Öncü — Computer Engineering graduate
              from Kocaeli University, co-founder of{" "}
              <a
                href="https://temcrafttech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#CA3E47] transition-colors">
                TemCraft Tech
              </a>
              , and a frontend instructor. I build with React and Next.js,
              with Django and .NET when products need it.
            </p>
            <p>
              Since early 2024 I&apos;ve taught frontend development while
              shipping products at TemCraft Tech — mentoring students through
              HTML, CSS, JavaScript, React, and Next.js, then applying the
              same craft in production.
            </p>
            <p>
              Based in the Netherlands and open to new opportunities. If you
              need a frontend engineer who can also teach, ship, and own
              product outcomes, let&apos;s talk.
            </p>
          </div>

          <div className="border-t border-white/10 dark:border-gray-400/40 pt-3 text-left">
            <button
              type="button"
              onClick={() => setFaqOpen((open) => !open)}
              aria-expanded={faqOpen}
              className="flex w-full items-center justify-between gap-3 text-sm font-semibold uppercase tracking-wider text-[#CA3E47] hover:opacity-80 transition-opacity">
              <span>Quick facts</span>
              <span
                aria-hidden="true"
                className={`text-lg leading-none transition-transform duration-200 ${
                  faqOpen ? "rotate-45" : ""
                }`}>
                +
              </span>
            </button>

            <dl
              className={`space-y-3 text-sm overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
                faqOpen
                  ? "mt-3 max-h-[600px] opacity-100"
                  : "mt-0 max-h-0 opacity-0"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
```

- [ ] **Step 2: Un-pin `Experience.tsx`**

Replace the full contents of `components/Experience.tsx` with:

```tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";
import { experiencesData } from "@/data/experiencesData";

const Experience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative text-left max-w-full px-10 py-20 mx-auto items-center">
      <h3 className="uppercase tracking-[20px] text-gray-200 text-2xl mb-10">
        Experience
      </h3>
      <div className="w-full flex space-x-5 overflow-x-scroll p-10 snap-x snap-mandatory scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80">
        {experiencesData.map((experience) => (
          <ExperienceCard key={experience.company} experience={experience} />
        ))}
      </div>
    </motion.div>
  );
};

export default Experience;
```

(The horizontal `snap-x` card carousel is a deliberate UI pattern, not the removed page-level shell — it stays.)

- [ ] **Step 3: Un-pin `Skills.tsx`**

Replace the full contents of `components/Skills.tsx` with:

```tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Skill from "./Skill";
import { skillsData } from "../data/skillsData";

const Skills = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative text-center md:text-left max-w-[2000px] px-6 xl:px-10 py-20 mx-auto items-center">
      <h3 className="uppercase tracking-[20px] text-gray-200 dark:text-gray-900 text-2xl">
        Skills
      </h3>
      <h3 className="uppercase tracking-[3px] text-gray-200 dark:text-gray-900 text-sm mt-2 mb-10">
        Hover over a skill for name
      </h3>
      <div className="grid grid-cols-4 lg:grid-cols-10 2xl:grid-cols-7 gap-5 align-middle">
        {skillsData.map((item, index) =>
          index % 2 == 0 ? (
            <Skill key={index} item={item} />
          ) : (
            <Skill key={index} item={item} directionLeft={true} />
          ),
        )}
      </div>
    </motion.div>
  );
};

export default Skills;
```

- [ ] **Step 4: Create the `/about` page**

Create `app/about/page.tsx`:

```tsx
import About from "@/components/About";
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Skills from "@/components/Skills";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Murat Hüdavendigâr Öncü — frontend developer, co-founder of TemCraft Tech, and frontend instructor based in the Netherlands.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.shortName}`,
    description:
      "Murat Hüdavendigâr Öncü — frontend developer, co-founder of TemCraft Tech, and frontend instructor based in the Netherlands.",
    url: `${site.url}/about`,
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <Header />
      <About />
      <Experience />
      <Skills />
    </div>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed. Then run `npm run dev` and open `http://localhost:3000/about` — confirm bio, quick-facts accordion, experience carousel, and skills grid all render without the old full-viewport section jumps.

---

### Task 6: `/work` routes — index + case study detail

**Files:**
- Modify: `lib/schema.ts`
- Modify: `lib/__tests__/schema.test.ts`
- Modify: `components/Projects.tsx`
- Create: `app/work/page.tsx`
- Create: `app/work/[slug]/page.tsx`
- Delete: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProjects`, `getProject` from `@/lib/projects` (unchanged).
- Produces: `workSchema(project)` and `workIndexSchema(projects)` in `lib/schema.ts` (both exported); `/work` index and `/work/[slug]` detail pages.

This task replaces the existing `projectSchema` export and updates its only call site (`app/projects/[slug]/page.tsx`, which this task also deletes) in the same pass, so the build never sits in a broken intermediate state.

- [ ] **Step 1: Replace `projectSchema` with `workSchema`, and add `workIndexSchema`**

In `lib/schema.ts`, replace the existing `projectSchema` function with:

```ts
export function workSchema(project: {
  name: string;
  description: string;
  slug: string;
  github: string;
  url: string;
}) {
  const pageUrl = absoluteUrl(`/work/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: absoluteUrl("/work"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#project`,
        name: project.name,
        description: project.description,
        url: pageUrl,
        codeRepository: project.github || undefined,
        author: { "@id": personId },
        isPartOf: { "@id": websiteId },
      },
    ],
  };
}

export function workIndexSchema(projects: { name: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/work")}#webpage`,
    url: absoluteUrl("/work"),
    name: "Work — Murat Hüdavendigâr Öncü",
    description:
      "Case studies and shipped projects by Murat Hüdavendigâr Öncü.",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/work/${project.slug}`),
        name: project.name,
      })),
    },
  };
}
```

- [ ] **Step 2: Write the tests**

In `lib/__tests__/schema.test.ts`, add:

```ts
import { workSchema, workIndexSchema } from "../schema";

describe("workSchema", () => {
  it("uses /work/ URLs and includes a breadcrumb back to Work and Home", () => {
    const graph = workSchema({
      name: "codebrief",
      description: "Test",
      slug: "codebrief",
      github: "https://github.com/murathudavendigar/codebrief",
      url: "https://www.npmjs.com/package/codebrief",
    })["@graph"] as any[];

    const breadcrumb = graph.find(
      (n) => n["@type"] === "BreadcrumbList",
    ) as any;
    expect(breadcrumb.itemListElement[1].name).toBe("Work");
    expect(breadcrumb.itemListElement[1].item).toContain("/work");

    const work = graph.find((n) => n["@type"] === "CreativeWork") as any;
    expect(work.url).toBe("https://www.muratoncu.com/work/codebrief");
  });
});

describe("workIndexSchema", () => {
  it("lists every project under /work/", () => {
    const schema = workIndexSchema([
      { name: "codebrief", slug: "codebrief" },
    ]);
    expect(schema.mainEntity.itemListElement[0].url).toBe(
      "https://www.muratoncu.com/work/codebrief",
    );
  });
});
```

- [ ] **Step 3: Run tests, verify pass**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: PASS. (`npm run typecheck`/`npm run build` will still fail at this exact point, because `app/projects/[slug]/page.tsx` still imports the now-removed `projectSchema` — that gets fixed in Step 6 of this same task, below. Don't stop here to "fix" it; continue to the next step.)

- [ ] **Step 4: Rebuild `Projects.tsx` as an index grid**

Replace the full contents of `components/Projects.tsx` with:

```tsx
"use client";
import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const allProjectsData = projectsData as ProjectType[];
const TABS = ["Featured", "All", "React.JS", "Next.JS", "NPM"] as const;

const Projects = () => {
  const [lang, setLang] = useState<(typeof TABS)[number]>("Featured");

  const isVisible = (project: ProjectType) => {
    if (lang === "Featured") return project.featured === true;
    if (lang === "All") return true;
    return project.language === lang;
  };

  const visibleProjects = allProjectsData.filter(isVisible);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="max-w-6xl px-6 py-20 mx-auto">
      <h1 className="text-center text-2xl uppercase tracking-[10px] text-gray-200 dark:text-gray-900 mb-8">
        Work
      </h1>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`heroButton px-3 py-1 text-xs md:px-6 md:py-2 md:text-sm ${
              lang === tab ? "text-[#CA3E47] border-[#CA3E47]/40" : ""
            }`}
            onClick={() => setLang(tab)}>
            {tab === "All" ? "All Projects" : tab}
          </button>
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-gray-300 dark:text-gray-900">
            No projects found
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="flex flex-col gap-3 p-6 rounded-lg border border-white/10 dark:border-gray-300 hover:border-[#CA3E47]/60 transition-colors">
              {project.img?.trim() ? (
                <img
                  src={project.img}
                  alt={project.name}
                  className="w-full h-40 object-cover rounded-lg border border-white/10 dark:border-gray-300"
                  loading="lazy"
                />
              ) : (
                <div className="flex w-full h-40 items-center justify-center rounded-lg border border-white/10 bg-white/5 dark:border-gray-300 dark:bg-gray-200/50">
                  <svg
                    className="h-12 w-12 text-white/20 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <h2 className="text-lg font-semibold dark:text-gray-900">
                {project.name}
              </h2>
              <p className="text-sm text-gray-300 dark:text-gray-700 line-clamp-3">
                {project.description}
              </p>
              <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 font-mono-ui text-xs font-semibold rounded-full bg-white/10 dark:bg-gray-200/50 border border-white/20 dark:border-gray-300 text-gray-200 dark:text-gray-800">
                {project.language}
              </span>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Projects;
```

- [ ] **Step 5: Create the `/work` index page**

Create `app/work/page.tsx`:

```tsx
import Header from "@/components/Header";
import Projects from "@/components/Projects";
import { getProjects } from "@/lib/projects";
import { workIndexSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and shipped projects by Murat Hüdavendigâr Öncü — React, Next.js, and TypeScript products.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Work — ${site.shortName}`,
    description:
      "Case studies and shipped projects by Murat Hüdavendigâr Öncü — React, Next.js, and TypeScript products.",
    url: `${site.url}/work`,
    type: "website",
  },
};

export default function WorkIndexPage() {
  const projects = getProjects();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <Header />
      <Projects />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workIndexSchema(projects)),
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Create the `/work/[slug]` detail page**

Create `app/work/[slug]/page.tsx` (this replaces `app/projects/[slug]/page.tsx`):

```tsx
import Header from "@/components/Header";
import { getProject, getProjects } from "@/lib/projects";
import { workSchema } from "@/lib/schema";
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
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${project.name} — ${site.shortName}`,
      description: project.description,
      url: absoluteUrl(`/work/${slug}`),
      type: "website",
      images: project.img
        ? [{ url: project.img }]
        : [{ url: site.defaultOgImage, width: 1200, height: 630 }],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 font-custom">
      <Header />
      <div className="px-6 py-16 max-w-3xl mx-auto">
        <Link
          href="/work"
          className="underline hover:text-[#CA3E47] transition-colors">
          ← Back to work
        </Link>
        <h1 className="text-3xl font-semibold mt-6">{project.name}</h1>
        <p className="mt-4 text-gray-300 dark:text-gray-700 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-6 flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-[#CA3E47]">
              GitHub
            </a>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#CA3E47]">
            {project.language === "NPM" ? "NPM Package" : "Live Demo"}
          </a>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(workSchema(project)),
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Delete the old route**

Delete `app/projects/[slug]/page.tsx` (and the now-empty `app/projects/` directory). This is the step that resolves the broken import from Step 3 — `npm run build` goes green again from here on.

- [ ] **Step 8: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed, and the build output lists static params generated for every project slug under `/work/[slug]`. Then `npm run dev` and check `http://localhost:3000/work` and `http://localhost:3000/work/codebrief` render correctly with working tab filters and back-link.

---

### Task 7: `/writing` routes — index, archive, detail

**Files:**
- Modify: `components/BlogCard.tsx`
- Create: `app/writing/page.tsx`
- Create: `app/writing/archive/page.tsx`
- Create: `app/writing/[slug]/page.tsx`
- Delete: `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getFlagshipPosts`, `getArchivedPosts`, `getPost` from `@/lib/blog` (Task 3); `blogIndexSchema`, `blogPostingGraph` from `@/lib/schema` (Task 2).
- Produces: `/writing`, `/writing/archive`, `/writing/[slug]` routes.

- [ ] **Step 1: Point `BlogCard` links at `/writing`**

In `components/BlogCard.tsx`, change:

```tsx
<Link href={`/blogs/${slug}`}>
```

to:

```tsx
<Link href={`/writing/${slug}`}>
```

- [ ] **Step 2: Create the `/writing` index page (flagship posts only)**

Create `app/writing/page.tsx`:

```tsx
import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import { getFlagshipPosts } from "@/lib/blog";
import { blogIndexSchema } from "@/lib/schema";
import Link from "next/link";

export const metadata = {
  title: "Writing",
  description:
    "Notes on React, Next.js, TypeScript, and teaching frontend — written by Murat Hüdavendigâr Öncü while building products at TemCraft Tech.",
  alternates: { canonical: "/writing" },
};

export default function WritingIndexPage() {
  const posts = getFlagshipPosts();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <Header />

      <div className="flex flex-col items-center px-10 py-20 mx-auto text-center max-w-7xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
          Writing on frontend development
        </h1>
        <p className="max-w-2xl mt-4 text-sm leading-relaxed text-gray-300 dark:text-gray-700 sm:text-base">
          Practical notes from shipping React and Next.js products and
          teaching the same stack — TypeScript, UI patterns, and the tools I
          use with students and clients.
        </p>

        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              date={new Date(post.date).toLocaleDateString()}
              slug={post.slug}
              description={post.description}
              imageUrl={post.imageUrl}
              readTime={post.readTime}
              tags={post.tags}
              author={post.author}
            />
          ))}
        </div>

        <Link
          href="/writing/archive"
          className="mt-12 text-sm underline text-gray-300 dark:text-gray-700 hover:text-[#CA3E47] transition-colors">
          Looking for the earlier Python/Django learning notes? See the
          archive →
        </Link>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogIndexSchema(posts)),
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create the `/writing/archive` page**

Create `app/writing/archive/page.tsx`:

```tsx
import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import { getArchivedPosts } from "@/lib/blog";
import Link from "next/link";

export const metadata = {
  title: "Learning Archive",
  description:
    "Early learning notes on Python and Django from Murat Hüdavendigâr Öncü's beginner-era writing.",
  alternates: { canonical: "/writing/archive" },
};

export default function WritingArchivePage() {
  const posts = getArchivedPosts();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <Header />

      <div className="flex flex-col items-center px-10 py-20 mx-auto text-center max-w-7xl">
        <Link
          href="/writing"
          className="self-start text-sm underline text-gray-300 dark:text-gray-700 hover:text-[#CA3E47] transition-colors mb-8">
          ← Back to Writing
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
          Learning archive
        </h1>
        <p className="max-w-2xl mt-4 text-sm leading-relaxed text-gray-300 dark:text-gray-700 sm:text-base">
          Early notes written while learning Python and Django. Kept for
          reference — not representative of current frontend-focused work.
        </p>

        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              date={new Date(post.date).toLocaleDateString()}
              slug={post.slug}
              description={post.description}
              imageUrl={post.imageUrl}
              readTime={post.readTime}
              tags={post.tags}
              author={post.author}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create the `/writing/[slug]` detail page**

Create `app/writing/[slug]/page.tsx` with the same content as the current `app/blogs/[slug]/page.tsx`, with these changes: `generateStaticParams` and `getPost` still come from `@/lib/blog` (unchanged), but `canonical` becomes `/writing/${post.slug}`, and both "Back to Blogs" links point to `/writing` instead of `/blogs`:

```tsx
import Header from "@/components/Header";
import MarkdownContent from "@/components/MarkdownContent";
import { getPost, getPosts } from "@/lib/blog";
import { blogPostingGraph } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";
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
    alternates: { canonical: `/writing/${post.slug}` },
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

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const createdDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isUpdated =
    post.updatedAt &&
    new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingGraph(post)),
        }}
      />
      <Header />

      <div className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
        <article className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <Link
            href="/writing"
            className="group inline-flex items-center gap-2 px-4 py-2 mb-8 sm:mb-10 md:mb-12 text-sm font-medium rounded-lg bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300 hover:bg-white/10 dark:hover:bg-gray-200 hover:border-[#CA3E47]/50 dark:hover:border-[#CA3E47] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#CA3E47]/20">
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 text-[#CA3E47]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-white dark:text-gray-800 group-hover:text-[#CA3E47] transition-colors duration-300">
              Back to Writing
            </span>
          </Link>

          {post.imageUrl && (
            <div className="relative w-full h-48 mb-8 overflow-hidden shadow-2xl rounded-2xl sm:h-64 md:h-80 lg:h-96 group">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          <header className="mb-8 sm:mb-10 md:mb-12">
            <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl dark:text-gray-900 sm:mb-5 md:mb-6">
              {post.title}
            </h1>

            <div className="flex flex-col items-start gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 font-mono-ui text-xs text-gray-400 sm:gap-3 sm:text-sm dark:text-gray-600">
                {post.author && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">{post.author}</span>
                  </div>
                )}
                <time
                  dateTime={new Date(post.createdAt).toISOString()}
                  className="px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300">
                  {createdDate}
                </time>
                {post.readTime && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">{post.readTime} min</span>
                  </div>
                )}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 font-mono-ui text-xs sm:text-sm font-medium rounded-full bg-[#CA3E47]/10 text-[#CA3E47] dark:bg-[#CA3E47]/20 border border-[#CA3E47]/30 dark:border-[#CA3E47]/40 hover:bg-[#CA3E47]/20 dark:hover:bg-[#CA3E47]/30 transition-colors duration-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-base leading-relaxed text-gray-200 sm:text-lg md:text-xl dark:text-gray-700">
              {post.description}
            </p>

            {isUpdated && (
              <div className="flex items-center gap-2 px-3 py-2 mt-4 text-xs text-gray-400 border rounded-lg sm:text-sm bg-white/5 dark:bg-gray-200/30 border-white/10 dark:border-gray-300 dark:text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>
                  Last updated on{" "}
                  <time dateTime={new Date(post.updatedAt!).toISOString()}>
                    {updatedDate}
                  </time>
                </span>
              </div>
            )}
          </header>

          <div className="mb-12 prose-sm prose prose-invert sm:prose-base md:prose-lg dark:prose max-w-none">
            <MarkdownContent content={post.content} />
          </div>

          <footer className="pt-6 mt-12 border-t sm:pt-8 border-white/20 dark:border-gray-300">
            <Link
              href="/writing"
              className="group inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg bg-[#CA3E47] hover:bg-[#CA3E47]/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#CA3E47]/30 hover:scale-105">
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to all posts</span>
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Delete the old routes**

Delete `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`, and the now-empty `app/blogs/` directory.

- [ ] **Step 6: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed, with static params generated for all 13 posts under `/writing/[slug]`. Then `npm run dev` and check `http://localhost:3000/writing` (6 flagship posts only), `http://localhost:3000/writing/archive` (7 archived posts), and one post detail page each.

---

### Task 8: `/contact` route

**Files:**
- Modify: `components/Contact.tsx`
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: nothing new — `Contact.tsx`'s internal EmailJS/react-hook-form logic is unchanged.
- Produces: `/contact` route.

- [ ] **Step 1: Un-pin `Contact.tsx` from the full-viewport shell**

In `components/Contact.tsx`, change the outer wrapper `className` from:

```tsx
className="relative z-0 flex h-screen flex-col items-center justify-start overflow-y-auto px-4 py-20 md:justify-center md:overflow-hidden md:px-10"
```

to:

```tsx
className="relative z-0 flex flex-col items-center px-4 py-20 md:px-10"
```

And change the heading from:

```tsx
<h3 className="absolute top-16 uppercase tracking-[12px] text-gray-200 dark:text-gray-700 text-xl md:top-24 md:tracking-[20px] md:text-2xl">
  Contact
</h3>
```

to:

```tsx
<h3 className="uppercase tracking-[12px] text-gray-200 dark:text-gray-700 text-xl md:tracking-[20px] md:text-2xl mb-8">
  Contact
</h3>
```

Everything else in the file (the location/email rows, the three persona cards, and the form) stays exactly as-is.

- [ ] **Step 2: Create the `/contact` page**

Create `app/contact/page.tsx`:

```tsx
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Murat Hüdavendigâr Öncü — frontend engineer based in the Netherlands, open to roles, freelance React/Next.js work, and teaching.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${site.shortName}`,
    description:
      "Get in touch with Murat Hüdavendigâr Öncü — frontend engineer based in the Netherlands, open to roles, freelance React/Next.js work, and teaching.",
    url: `${site.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <Header />
      <Contact />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed. Then `npm run dev`, open `http://localhost:3000/contact`, and submit a test message to confirm EmailJS still fires (or the existing error toast fires cleanly if env vars are unset locally — same behavior as before).

---

### Task 9: `/` — lean landing page

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getProjects` from `@/lib/projects`, `homepageGraph` from `@/lib/schema` (unchanged).
- Produces: the new homepage — static (non-looping) hero + featured-work strip linking into `/work`, `/about`, `/writing`, `/contact`.

- [ ] **Step 1: Make the hero headline static**

Replace the full contents of `components/Hero.tsx` with:

```tsx
import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "./BackgroundCircles";

const HERO_HEADLINE = "Hi, I am Murat Hüdavendigâr Öncü";
const HERO_TITLE = "Frontend · React / Next.js";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 overflow-hidden text-center py-20">
      <BackgroundCircles />
      <Image
        src={site.profileImage}
        alt="Murat Hüdavendigâr Öncü — frontend developer portrait"
        className="relative object-cover rounded-full"
        width={128}
        height={128}
        priority
      />
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-200 dark:text-gray-900 pb-2 tracking-[15px]">
          {HERO_TITLE}
        </h2>
        <h1 className="px-10 text-5xl font-semibold lg:text-6xl">
          {HERO_HEADLINE}
        </h1>

        <div className="pt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/work">
            <button className="heroButton">Work</button>
          </Link>
          <Link href="/about">
            <button className="heroButton">About</button>
          </Link>
          <Link href="/writing">
            <button className="heroButton">Writing</button>
          </Link>
          <Link href="/contact">
            <button className="heroButton">Contact</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
```

This removes the looping `react-simple-typewriter` usage from the H1/H2 — same words as before (`HERO_LINES[0]` / `TITLE_LINES[0]`), just no longer animated. This resolves the LCP-instability issue flagged in `docs/roadmap.md` P1.1/P1.2 as a side effect. (New headline wording is a separate content task, not in this plan.)

- [ ] **Step 2: Rebuild `app/page.tsx` as a lean landing page**

Replace the full contents of `app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { getProjects } from "@/lib/projects";
import { homepageGraph } from "@/lib/schema";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import Link from "next/link";

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

export default function Home() {
  const featured = getProjects()
    .filter((p) => p.featured)
    .slice(0, 3);

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <Header />
      <Hero />

      <section className="max-w-6xl px-6 py-20 mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[10px] text-gray-200 dark:text-gray-900 mb-10">
          Featured work
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="block p-6 rounded-lg border border-white/10 dark:border-gray-300 hover:border-[#CA3E47]/60 transition-colors">
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              <p className="text-sm text-gray-300 dark:text-gray-700 line-clamp-3">
                {project.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link href="/work" className="heroButton">
            See all work
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageGraph()),
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run build`
Expected: both succeed. Then `npm run dev`, open `http://localhost:3000/`, and confirm: the H1 renders immediately with no animation delay, the three featured-work cards link to real `/work/[slug]` pages, and the four buttons link to `/work`, `/about`, `/writing`, `/contact`.

---

### Task 10: Redirects for old URLs

**Files:**
- Modify: `next.config.js`

**Interfaces:**
- Produces: permanent redirects so every previously-indexed URL still resolves. This task must run after Tasks 6–9 land, since the destination routes must exist before the redirects are added (otherwise old URLs would redirect into a 404 during the gap).

- [ ] **Step 1: Add the redirects**

In `next.config.js`, add a `redirects` function alongside the existing `headers` function:

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
  async redirects() {
    return [
      {
        source: "/projects/:slug*",
        destination: "/work/:slug*",
        permanent: true,
      },
      { source: "/blogs", destination: "/writing", permanent: true },
      {
        source: "/blogs/:slug*",
        destination: "/writing/:slug*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run start`

In a second terminal, run:

```bash
curl -sI http://localhost:3000/blogs | head -5
curl -sI http://localhost:3000/blogs/what-is-a-list-in-python | head -5
curl -sI http://localhost:3000/projects/codebrief | head -5
```

Expected: each response includes `HTTP/1.1 308 Permanent Redirect` and a `location:` header pointing at the corresponding `/writing...` or `/work/...` URL. Stop the `npm run start` process afterward.

---

### Task 11: Sitemap and `llms.txt` for the new structure

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `public/llms.txt`

**Interfaces:**
- Consumes: `getPosts` from `@/lib/blog`, `getProjects` from `@/lib/projects` (unchanged signatures).

- [ ] **Step 1: Rewrite the sitemap**

Replace the full contents of `app/sitemap.ts` with:

```ts
import { getPosts } from "@/lib/blog";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

// Bump this constant whenever static-page copy/structure actually changes.
const STATIC_LAST_MODIFIED = new Date("2026-09-04");

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latestPostChange = posts.length
    ? new Date(Math.max(...posts.map((p) => p.updatedAt ?? p.createdAt)))
    : STATIC_LAST_MODIFIED;

  return [
    { url: site.url, lastModified: STATIC_LAST_MODIFIED },
    { url: `${site.url}/about`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${site.url}/work`, lastModified: STATIC_LAST_MODIFIED },
    ...getProjects().map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
    })),
    { url: `${site.url}/writing`, lastModified: latestPostChange },
    { url: `${site.url}/writing/archive`, lastModified: latestPostChange },
    ...posts.map((p) => ({
      url: `${site.url}/writing/${p.slug}`,
      lastModified: new Date(p.updatedAt ?? p.createdAt),
    })),
    { url: `${site.url}/contact`, lastModified: STATIC_LAST_MODIFIED },
  ];
}
```

- [ ] **Step 2: Update `llms.txt`**

In `public/llms.txt`, replace the `## Key pages` section with:

```
## Key pages

- Home / profile: https://www.muratoncu.com
- About: https://www.muratoncu.com/about
- Work index: https://www.muratoncu.com/work
- Writing index: https://www.muratoncu.com/writing
- Contact: https://www.muratoncu.com/contact
- Sitemap: https://www.muratoncu.com/sitemap.xml
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run start`

In a second terminal:

```bash
curl -s http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -30
```

Expected: the output includes `/about`, `/work`, `/work/codebrief`, `/writing`, `/writing/archive`, and `/writing/<slug>` URLs, with no remaining `/blogs` or `/projects` entries. Stop `npm run start` afterward.

---

## Final full-suite verification

After all 11 tasks:

```bash
npm run typecheck
npm run lint
npx vitest run
npm run build
```

Expected: all four succeed with zero errors. Then run `npm run dev` and manually click through `/`, `/about`, `/work`, `/work/codebrief`, `/writing`, `/writing/archive`, `/writing/a-beginners-guide-to-django-web-framework`, `/contact`, plus one old URL each (`/blogs`, `/projects/codebrief`) to confirm the redirects land correctly. Leave everything uncommitted for the owner to review and commit.
