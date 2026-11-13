import type { BlogPost } from "@/types";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const LOCAL_BLOG_DIR = path.join(process.cwd(), "content/blog");
const WORKER_BLOG_DIR = "/bundle/blog";

function getBlogDirectory(): string {
  return fs.existsSync(WORKER_BLOG_DIR) ? WORKER_BLOG_DIR : LOCAL_BLOG_DIR;
}

/**
 * Published posts only. A post is left out when its frontmatter has
 * `draft: true`, or when its `date` is still in the future.
 *
 * Scheduling happens at build time: the site is fully static, so a post dated
 * "2026-11-26" (00:00 UTC) appears with the first build on or after that
 * moment. The daily workflow in .github/workflows/scheduled-posts.yml triggers
 * that build through a Cloudflare Deploy Hook.
 */
export function getPosts(now: number = Date.now()): BlogPost[] {
  return getAllPosts().filter((post) => !post.draft && post.createdAt <= now);
}

/** Every post file, including drafts and scheduled ones. Not for pages. */
export function getAllPosts(): (BlogPost & { draft: boolean })[] {
  const blogDirectory = getBlogDirectory();
  return fs
    .readdirSync(blogDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(blogDirectory, f), "utf8"),
      );
      const createdAt = new Date(data.date as string).getTime();
      return {
        draft: data.draft === true,
        id: slug,
        title: (data.title as string) ?? "",
        description: (data.description as string) ?? "",
        metaDescription: (data.metaDescription as string) || undefined,
        seoTitle: (data.seoTitle as string) || undefined,
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
        projects: (data.projects as string[]) ?? [],
        archived: data.archived === true,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export const ARCHIVE_TAGS = ["python", "django"];

/**
 * Archived posts leave the /writing list but keep their URL, sitemap entry
 * and indexing, so search traffic to them is not lost.
 */
export function isArchivedPost(post: BlogPost): boolean {
  return (
    post.archived ||
    post.tags.some((tag) => ARCHIVE_TAGS.includes(tag.toLowerCase()))
  );
}

export function getFlagshipPosts(): BlogPost[] {
  return getPosts().filter((post) => !isArchivedPost(post));
}

export function getArchivedPosts(): BlogPost[] {
  return getPosts().filter(isArchivedPost);
}

/**
 * Newer and older neighbours of a post, within its own group: flagship posts
 * link to flagship posts, archived posts to archived ones.
 */
export function getAdjacentPosts(slug: string): {
  newer: BlogPost | null;
  older: BlogPost | null;
} {
  const post = getPost(slug);
  if (!post) return { newer: null, older: null };
  const group = isArchivedPost(post) ? getArchivedPosts() : getFlagshipPosts();
  const index = group.findIndex((p) => p.slug === slug);
  return {
    newer: index > 0 ? group[index - 1] : null,
    older: index >= 0 && index < group.length - 1 ? group[index + 1] : null,
  };
}

function normalizeTopic(value: string): string {
  return value.toLowerCase().replace(/[.\s-]/g, "");
}

/**
 * Posts for a case study: ones that name the project in frontmatter first,
 * then flagship posts that share the most stack tags.
 */
export function getRelatedPosts(
  stack: string[] = [],
  limit = 2,
  projectSlug?: string,
): BlogPost[] {
  const topics = new Set(stack.map(normalizeTopic));

  const explicit = projectSlug
    ? getPosts().filter((post) => post.projects.includes(projectSlug))
    : [];

  const byStack = getFlagshipPosts()
    .filter((post) => !explicit.includes(post))
    .map((post) => {
      const overlap = post.tags.filter((tag) =>
        topics.has(normalizeTopic(tag)),
      ).length;
      return { post, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .map((entry) => entry.post);

  return [...explicit, ...byStack].slice(0, limit);
}
