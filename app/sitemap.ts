import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getPosts().map((p) => ({
    url: `${site.url}/blogs/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.createdAt),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts,
  ];
}
