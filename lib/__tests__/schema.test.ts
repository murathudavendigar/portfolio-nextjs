import { describe, expect, it } from "vitest";
import { homepageGraph, blogPostingGraph } from "../schema";
import { site } from "@/lib/site";

describe("homepageGraph", () => {
  it("ProfilePage node uses mainEntity (Google's required property), not about", () => {
    const graph = homepageGraph()["@graph"] as any[];
    const profilePage = graph.find((node: any) => node["@type"] === "ProfilePage") as any;
    expect(profilePage).toBeDefined();
    expect(profilePage.mainEntity).toEqual({ "@id": expect.stringContaining("#person") });
    expect(profilePage.about).toBeUndefined();
  });
});

describe("blogPostingGraph", () => {
  it("BlogPosting author/publisher carry an inline Person stub, not just an @id", () => {
    const graph = blogPostingGraph({
      slug: "test-post",
      title: "Test",
      description: "Test description",
      createdAt: Date.now(),
      updatedAt: null,
      tags: ["test"],
    } as any)["@graph"];
    const posting = graph.find((n: any) => n["@type"] === "BlogPosting") as any;
    expect(posting).toBeDefined();
    expect(posting.author.name).toBe(site.name);
    expect(posting.author.sameAs).toEqual(Object.values(site.socials));
  });
});
