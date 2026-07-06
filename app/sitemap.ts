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
