# SEO Patch — Current Site (Pages Router) for www.muratoncu.com

**Date:** 2026-07-05
**Status:** Approved
**Owner:** Murat Hüdavendigâr Öncü

## Goal

Add complete SEO to the existing Next.js 13 Pages Router site for the new domain
`https://www.muratoncu.com`, without rebuilding. The full rebuild
(`2026-07-04-portfolio-rebuild-design.md`) remains a separate, later effort.

## Scope

1. **Meta foundation**
   - `lib/site.ts`: site constants (name, url, description, email, socials).
   - `components/Seo.tsx`: reusable `next/head` block — title, description,
     canonical, Open Graph, Twitter card. Used by every page.
   - Home: `Murat Hüdavendigâr Öncü — Frontend Developer` + keyword-rich description.
   - Blog index and post pages: canonical, `og:type=article` on posts with
     published/modified times and tags.

2. **Crawlability**
   - `public/robots.txt` allowing all, pointing at sitemap.
   - `pages/sitemap.xml.ts`: server-rendered XML. Static pages (`/`, `/blogs`)
     plus all published post slugs read from MongoDB via existing
     `lib/mongodb.ts`. Cached with `s-maxage=86400`.

3. **Structured data**
   - JSON-LD `Person` on home (name, jobTitle, url, sameAs socials).
   - JSON-LD `Article` on blog posts (headline, description, dates, author, image).

4. **Social preview**
   - Default `og:image`: existing `public/img/MHO.jpg` (1472×832). Blog posts
     use `post.imageUrl` when present. No new dependencies.

5. **Small fixes**
   - Real alt text on footer avatar images (home, blog index).
   - `theme-color` meta + explicit favicon link in `_document.tsx`.

## Out of scope

- Any redesign, stack upgrade, or content change (covered by the rebuild spec).
- Dynamic OG image generation.
- Vercel domain wiring and Google Search Console submission (user actions).

## Verification

- `npm run build` passes clean.
- `/sitemap.xml` lists static pages + all published posts.
- View-source check: canonical, OG, Twitter, JSON-LD present on `/`, `/blogs`,
  and one post page.
