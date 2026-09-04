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
        updatedAt: data.updated
          ? new Date(data.updated as string).getTime()
          : null,
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
