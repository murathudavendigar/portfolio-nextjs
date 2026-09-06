import { describe, expect, it } from "vitest";
import projectsData from "@/data/projects.json";
import {
  getAdjacentProjects,
  getEarlierProjects,
  getProject,
  getProjects,
  getSelectedProjects,
  getSelectedProjectsByCategory,
  hasCaseStudy,
  projectPrimaryCta,
} from "../projects";

describe("projects loader", () => {
  it("loads all projects with unique slugs", () => {
    const projects = getProjects();
    expect(projects.length).toBe(projectsData.length);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("returns neighbouring projects in JSON order", () => {
    const { prev, next } = getAdjacentProjects("courai");
    expect(prev?.slug).toBe("daily-skyline");
    expect(next?.slug).toBe("choose-game");
  });

  it("getProject finds by slug", () => {
    const project = getProject("codebrief");
    expect(project?.name).toBe("codebrief");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});

describe("selected vs earlier split", () => {
  it("splits every project into selected or earlier with no overlap", () => {
    const selected = getSelectedProjects();
    const earlier = getEarlierProjects();
    expect(selected.length + earlier.length).toBe(getProjects().length);
    const earlierSlugs = new Set(earlier.map((p) => p.slug));
    for (const project of selected) {
      expect(earlierSlugs.has(project.slug)).toBe(false);
    }
  });

  it("includes Daily Skyline and Courai as selected iOS work", () => {
    const selectedSlugs = getSelectedProjects().map((p) => p.slug);
    expect(selectedSlugs).toHaveLength(10);
    expect(selectedSlugs[0]).toBe("daily-skyline");
    expect(selectedSlugs[1]).toBe("courai");
    expect(getProject("daily-skyline")?.language).toBe("iOS");
    expect(getProject("courai")?.language).toBe("iOS");
  });

  it("points iOS apps at the App Store", () => {
    const skyline = projectPrimaryCta(getProject("daily-skyline")!);
    const courai = projectPrimaryCta(getProject("courai")!);
    expect(skyline?.label).toBe("App Store");
    expect(skyline?.href).toContain("apps.apple.com");
    expect(courai?.label).toBe("App Store");
    expect(courai?.href).toContain("6766915688");
  });

  it("labels npm packages as NPM Package", () => {
    const cta = projectPrimaryCta(getProject("codebrief")!);
    expect(cta?.label).toBe("NPM Package");
    expect(cta?.href).toContain("npmjs.com");
  });

  it("labels shipped web products as Visit site", () => {
    expect(projectPrimaryCta(getProject("haberai")!)?.label).toBe("Visit site");
  });

  it("uses a typographic cover when a remote image is gone", () => {
    expect(getProject("fireblog-app")?.img).toBe("");
    expect(getProject("weather-app-with-pure-js")?.img).toBe("");
  });

  it("gives every selected project a full case study", () => {
    for (const project of getSelectedProjects()) {
      expect(hasCaseStudy(project)).toBe(true);
      expect(project.problem?.length).toBeGreaterThan(40);
      expect(project.approach?.length).toBeGreaterThan(40);
      expect(project.tradeoffs?.length).toBeGreaterThan(40);
      expect(project.outcome?.length).toBeGreaterThan(20);
    }
  });

  it("groups selected work into iOS Apps, Web Products, npm Packages, covering every selected project once", () => {
    const groups = getSelectedProjectsByCategory();
    const categories = groups.map((g) => g.category);
    expect(categories).toEqual(["iOS Apps", "Web Products", "npm Packages"]);

    const grouped = groups.flatMap((g) => g.projects.map((p) => p.slug));
    expect(new Set(grouped).size).toBe(grouped.length);
    expect(grouped.sort()).toEqual(
      getSelectedProjects()
        .map((p) => p.slug)
        .sort(),
    );

    const iosGroup = groups.find((g) => g.category === "iOS Apps")!;
    expect(iosGroup.projects.map((p) => p.slug)).toEqual([
      "daily-skyline",
      "courai",
    ]);
    const npmGroup = groups.find((g) => g.category === "npm Packages")!;
    expect(npmGroup.projects.map((p) => p.slug)).toEqual([
      "codebrief",
      "dev-console-kit",
    ]);
  });

  it("shows Courai and Daily Skyline as App Store screenshots", () => {
    const courai = getProject("courai")!;
    const skyline = getProject("daily-skyline")!;
    expect(courai.coverFit).toBe("cover");
    expect(courai.img).toBe("/img/projects/courai.png");
    expect(skyline.coverFit).toBe("cover");
    expect(skyline.img).toBe("/img/projects/daily-skyline.png");
  });
});

