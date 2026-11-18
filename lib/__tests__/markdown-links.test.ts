import { describe, expect, it } from "vitest";
import { toSitePath } from "@/components/MarkdownContent";

describe("toSitePath", () => {
  it("keeps in-site links on the site", () => {
    expect(toSitePath("/work/daily-skyline#try-it")).toBe("/work/daily-skyline#try-it");
    expect(toSitePath("#heading")).toBe("#heading");
    expect(toSitePath("https://muratoncu.com")).toBe("/");
    expect(toSitePath("https://muratoncu.com/writing")).toBe("/writing");
  });

  it("treats other sites as external", () => {
    expect(toSitePath("https://github.com/x")).toBeNull();
    expect(toSitePath("//evil.example/x")).toBeNull();
    expect(toSitePath("https://muratoncu.com.evil.example/")).toBeNull();
    expect(toSitePath("mailto:a@b.c")).toBeNull();
  });
});
