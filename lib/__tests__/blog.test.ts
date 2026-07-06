import { describe, expect, it } from "vitest";
import { getPost, getPosts } from "../blog";

describe("blog loader", () => {
  it("loads all 13 exported posts sorted newest first", () => {
    const posts = getPosts();
    expect(posts.length).toBe(13);
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
