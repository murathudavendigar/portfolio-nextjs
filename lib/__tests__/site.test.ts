import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { experiencesData } from "@/data/experiencesData";
import robots from "../../app/robots";
import { getResumeHref } from "../resume";

describe("getResumeHref", () => {
  it("returns the public PDF path when the résumé file exists", () => {
    expect(getResumeHref(true)).toBe("/resume.pdf");
  });

  it("returns null when the résumé file is missing", () => {
    expect(getResumeHref(false)).toBeNull();
  });
});

describe("experience logos", () => {
  it("self-hosts company images when a logo is present", () => {
    for (const experience of experiencesData) {
      if (!experience.companyImage) continue;
      expect(experience.companyImage.startsWith("/img/companies/")).toBe(true);
    }
  });
});

describe("robots", () => {
  it("allows the AI search crawlers that obey robots.txt", () => {
    const doc = robots();
    const agents = (Array.isArray(doc.rules) ? doc.rules : [doc.rules]).map(
      (rule) => rule.userAgent,
    );
    expect(agents).toEqual(
      expect.arrayContaining([
        "*",
        "GPTBot",
        "OAI-SearchBot",
        "ClaudeBot",
        "PerplexityBot",
        "Applebot",
        "anthropic-ai",
      ]),
    );
  });
});

describe("llms.txt", () => {
  it("points agents at /work and /writing, not the retired /blogs path", () => {
    const text = readFileSync(
      join(process.cwd(), "public", "llms.txt"),
      "utf8",
    );
    expect(text).toContain("https://www.muratoncu.com/work");
    expect(text).toContain("https://www.muratoncu.com/writing");
    expect(text).not.toMatch(/muratoncu\.com\/blogs/);
    expect(text).toContain("Daily Skyline");
    expect(text).toContain("Courai");
  });
});
