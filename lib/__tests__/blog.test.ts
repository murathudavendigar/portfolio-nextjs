import { describe, expect, it } from "vitest";
import {
  getArchivedPosts,
  getFlagshipPosts,
  getPost,
  getPosts,
  getRelatedPosts,
} from "../blog";

describe("blog loader", () => {
  it("loads all 14 exported posts sorted newest first", () => {
    const posts = getPosts();
    expect(posts.length).toBe(14);
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

describe("flagship/archive split", () => {
  it("splits all 14 posts into flagship and archived with no overlap", () => {
    const flagship = getFlagshipPosts();
    const archived = getArchivedPosts();
    expect(flagship.length + archived.length).toBe(14);
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
    expect(flagshipSlugs).toContain(
      "how-i-structure-a-nextjs-app-router-product",
    );
  });
});

describe("getRelatedPosts", () => {
  it("matches flagship posts by stack/tag overlap, case- and punctuation-insensitive", () => {
    const related = getRelatedPosts(["React", "Next.js", "TypeScript"]);
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(2);
    for (const post of related) {
      expect(getArchivedPosts().map((p) => p.slug)).not.toContain(post.slug);
    }
  });

  it("returns nothing for a stack with no topical overlap", () => {
    expect(getRelatedPosts(["Groq", "Upstash Redis", "PWA"])).toEqual([]);
  });

  it("returns nothing for an empty stack", () => {
    expect(getRelatedPosts([])).toEqual([]);
    expect(getRelatedPosts()).toEqual([]);
  });
});

describe("writing URLs inside posts", () => {
  it("does not point at the retired /blogs/ path", () => {
    for (const post of getPosts()) {
      expect(post.content).not.toMatch(/muratoncu\.com\/blogs\//);
    }
  });
});
