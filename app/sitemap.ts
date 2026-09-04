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
