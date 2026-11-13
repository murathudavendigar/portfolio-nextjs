import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getAdjacentPosts,
  getAllPosts,
  getArchivedPosts,
  getFlagshipPosts,
  getPost,
  getPosts,
  getRelatedPosts,
} from "../blog";

// A fixed "now" so post counts don't change when a scheduled post goes live.
const BEFORE_NO_ACCOUNT_POST = Date.parse("2026-11-13T12:00:00Z");

describe("blog loader", () => {
  it("loads the 17 posts published by 13 Nov 2026, newest first", () => {
    const posts = getPosts(BEFORE_NO_ACCOUNT_POST);
    expect(posts.length).toBe(17);
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

describe("scheduled and draft posts", () => {
  const SLUG = "why-daily-skyline-has-no-account";

  it("hides a post until 00:00 UTC on its date", () => {
    const before = getPosts(Date.parse("2026-11-25T23:59:59Z"));
    const onTheDay = getPosts(Date.parse("2026-11-26T00:00:00Z"));
    expect(before.map((p) => p.slug)).not.toContain(SLUG);
    expect(onTheDay.map((p) => p.slug)).toContain(SLUG);
  });

  it("never publishes a draft: true post, whatever the date", () => {
    const far = Date.parse("2100-01-01T00:00:00Z");
    const drafts = getAllPosts().filter((p) => p.draft);
    const published = getPosts(far).map((p) => p.slug);
    for (const draft of drafts) expect(published).not.toContain(draft.slug);
  });

  it("leaves no [MURAT: …] note in any post file, scheduled or not", () => {
    const dir = join(process.cwd(), "content/blog");
    const offenders = readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .filter((f) => readFileSync(join(dir, f), "utf8").includes("[MURAT:"));
    expect(offenders).toEqual([]);
  });
});

describe("flagship/archive split", () => {
  it("splits all posts into flagship and archived with no overlap", () => {
    const flagship = getFlagshipPosts();
    const archived = getArchivedPosts();
    expect(flagship.length + archived.length).toBe(getPosts().length);
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

  it("archives posts marked archived: true in frontmatter", () => {
    const archivedSlugs = getArchivedPosts().map((p) => p.slug);
    expect(archivedSlugs).toContain(
      "react-hooks-essential-strategies-custom-solutions",
    );
    expect(archivedSlugs).toContain(
      "typescript-supercharge-your-javascript-with-type-safety",
    );
    expect(archivedSlugs).toContain("getting-started-with-responsive-web-design");
  });

  it("keeps product posts in flagship", () => {
    const flagshipSlugs = getFlagshipPosts().map((p) => p.slug);
    expect(flagshipSlugs).toContain(
      "how-i-structure-a-nextjs-app-router-product",
    );
    expect(flagshipSlugs).toContain("codebrief-vs-skillbrief");
    expect(flagshipSlugs).toContain("shipping-daily-skyline-to-android");
    expect(flagshipSlugs).toContain(
      "reading-cs2-and-dota-2-with-game-state-integration",
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

  it("surfaces the codebrief vs skillbrief post next to Node.js tooling", () => {
    const related = getRelatedPosts(["Node.js"]);
    expect(related.map((post) => post.slug)).toContain(
      "codebrief-vs-skillbrief",
    );
  });
});

describe("writing URLs inside posts", () => {
  it("does not point at the retired /blogs/ path", () => {
    for (const post of getPosts()) {
      expect(post.content).not.toMatch(/muratoncu\.com\/blogs\//);
    }
  });

  it("links the codebrief vs skillbrief post to both case studies", () => {
    const post = getPost("codebrief-vs-skillbrief");
    expect(post).toBeDefined();
    expect(post?.content).toContain("/work/codebrief");
    expect(post?.content).toContain("/work/skillbrief");
  });
});

describe("post ↔ case study links", () => {
  it("puts posts that name a project first on its case study", () => {
    const related = getRelatedPosts(["Node.js"], 2, "skillbrief");
    expect(related[0]?.slug).toBe("codebrief-vs-skillbrief");
  });

  it("links a post to the case studies in its frontmatter", async () => {
    const { getRelatedWork } = await import("../projects");
    const post = getPost("codebrief-vs-skillbrief")!;
    expect(getRelatedWork(post).map((p) => p.slug)).toEqual([
      "codebrief",
      "skillbrief",
    ]);
  });

  it("falls back to selected work that shares the post's stack", async () => {
    const { getRelatedWork } = await import("../projects");
    const work = getRelatedWork({ projects: [], tags: ["react-native", "expo"] });
    expect(work.length).toBeGreaterThan(0);
  });
});

describe("getAdjacentPosts", () => {
  it("links flagship posts only to flagship posts, newest first", () => {
    const flagship = getFlagshipPosts();
    const { newer, older } = getAdjacentPosts(flagship[1].slug);
    expect(newer?.slug).toBe(flagship[0].slug);
    expect(older?.slug).toBe(flagship[2].slug);
    expect(getAdjacentPosts(flagship[0].slug).newer).toBeNull();
  });

  it("keeps archived posts within the archive", () => {
    const archivedSlugs = getArchivedPosts().map((p) => p.slug);
    const { newer, older } = getAdjacentPosts(archivedSlugs[1]);
    for (const p of [newer, older]) {
      if (p) expect(archivedSlugs).toContain(p.slug);
    }
  });
});
