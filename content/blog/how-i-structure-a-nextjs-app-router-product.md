---
title: "How I Structure a Next.js App Router Product"
description: "A practical breakdown of how I organize routes, data, and metadata in production Next.js App Router apps, using this portfolio's own single-page-to-multi-page migration as the working example."
date: "2026-09-06"
tags: ["nextjs", "react", "typescript", "architecture", "frontend"]
readTime: 6
image: ""
author: "Murat Hüdavendigâr Öncü"
---

Until a few weeks ago this site was one long scrolling page. Hero, about, experience, projects, contact, all stacked on `/`. It worked fine for a while, but it had a ceiling I kept bumping into: every project shared one URL, every blog post lived off in its own corner, and search engines had exactly one page to crawl for a site with a dozen shipped products and thirteen articles behind it. So I moved it to a real App Router structure — actual routes, per-page metadata, structured data per page type. I'm writing this down mostly because I make these same calls on client work at TemCraft Tech, and I've explained them to students often enough that I'd rather just point people here.

### What actually deserves its own URL

Before I touched a single folder I asked myself one thing: not "how should this look," but "what here is worth indexing on its own." A case study is its own thing. So is a blog post. And a contact form isn't a footer anchor — it's a page someone can land on straight from Googling "hire Next.js developer Netherlands." If something answers a distinct search intent, it gets a route. If it's just a scroll position on the homepage, it doesn't.

That landed me here:

| Route | Purpose |
|---|---|
| `/` | Headline, a few stats, 2-3 featured case studies, one CTA |
| `/about` | Full bio and background |
| `/work` | Case study index, grouped by kind |
| `/work/[slug]` | One case study per shipped product |
| `/writing` | Current articles |
| `/writing/[slug]` | One article |
| `/writing/archive` | Older beginner posts, kept live, clearly labeled |
| `/contact` | A page, not an anchor |

`/writing/archive` is the one people ask about. I've got years of Python and Django posts that don't match where I position myself now, and I was tempted to just delete them. Didn't. They're indexed, they get real traffic, and throwing that away for the sake of a tidier nav bar would've been vanity over judgment. I labeled them honestly as early material and moved them out of the main menu instead. That was enough.

### Data doesn't belong in components

Every route pulls from a `lib/` module. Nothing gets hardcoded as an array sitting inside a component file, because I've cleaned up that mess before and it's never fun the second time either.

```
lib/
  site.ts       // name, email, socials, canonical URL
  projects.ts   // getProjects(), getSelectedProjects(), getProject(slug)
  blog.ts       // getPosts(), getPost(slug), getRelatedPosts(stack)
  schema.ts     // one function per JSON-LD graph, one graph per page type
```

Projects are a JSON file, blog posts are markdown with frontmatter parsed by `gray-matter`. No database, and I don't think this site needs one — a few dozen projects and articles is nothing, and one less service to patch and keep alive is worth something on its own. If the volume ever grows past what one person can hand-edit, this is exactly the layer a CMS would slot behind. The routes wouldn't change, just what sits behind `getProjects()`.

The part that actually sold me on this separation happened almost by accident. I added a "related writing" feature to the case-study pages — match a project's `stack` array against each post's tags, surface the two or three most relevant articles as links. Because `lib/projects.ts` and `lib/blog.ts` had no idea the other existed, that whole feature ended up being one small function instead of something tangled through three components.

### Metadata lives on the page, not in a shared default

Every page file exports its own `metadata` (or `generateMetadata` for the dynamic routes). Not a shared object that gets half-overridden here and there.

```ts
export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — frontend engineer based in the Netherlands, open to roles, freelance, and teaching.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Murat Öncü",
    description: "...",
    url: `${site.url}/contact`,
    type: "website",
  },
};
```

That `alternates.canonical` line looks like a throwaway detail until you skip it. Restructure a site's URLs without it and you're gambling on duplicate-content confusion while Google sorts out which version is real. I paired it with permanent redirects in `next.config.js` — `/projects/:slug*` to `/work/:slug*`, `/blogs` to `/writing` — so the old URLs forward whatever equity they built up instead of just 404ing on anyone who still has them bookmarked.

### Structured data per page, not one blob glued to the root layout

Each route renders its own JSON-LD instead of one big schema object stuffed into the layout and left to cover everything.

```ts
export function contactPageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${absoluteUrl("/contact")}#webpage`,
        mainEntity: { "@type": "Person", "@id": personId, ... },
      },
    ],
  };
}
```

`/` gets a `ProfilePage`, `/about` gets `AboutPage`, `/writing/[slug]` gets `BlogPosting` with its own breadcrumb, `/work` gets a `CollectionPage` listing every case study. This is the part I think actually matters for AI answer engines specifically — a single `BlogPosting` node with a clear author, a date, and a breadcrumb gives something concrete to point back to. One Person object copy-pasted into every page's head doesn't give anyone anything page-specific to cite.

### The links, not the routes, are where it breaks

Adding new routes is the easy afternoon. What actually risks breaking production is everything that used to be an in-page anchor — `#about`, `#projects`, `#contact` — scattered through old posts, external backlinks, your own header component, places you forget about until something 404s. I went through every internal link in the codebase by hand and pointed it at the new route, then redirected everything I couldn't reach directly. I didn't delete the old paths. A redirect costs nothing. A dead link costs you the visitor and whatever ranking signal that URL had built up.

### If you're about to do this yourself

One thing I'd say clearly: don't bundle a visual redesign into the same pass as a routing migration. I kept the colors, type, and components exactly as they were during the routing move, and did the visual work later as its own change. Doing both at once means if something regresses, you genuinely can't tell whether it was the new URLs or the new CSS — and you've turned one change you could review cleanly into two you can't.

And if you're picking App Router up right now, honestly the framework part is the least of it. Figure out which of your existing sections earn their own URL, keep your content behind small boring functions in `lib/`, give every route its own metadata and its own schema. That's the part that shows up later, in how the site actually performs — not the routing syntax.
