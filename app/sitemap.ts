import { getPosts } from "@/lib/blog";
import { getProjects } from "@/lib/projects";
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
    ...getProjects().map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: HOMEPAGE_LAST_MODIFIED,
    })),
  ];
}
