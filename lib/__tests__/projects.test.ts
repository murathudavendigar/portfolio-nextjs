import { describe, expect, it } from "vitest";
import projectsData from "@/data/projects.json";
import { getProject, getProjects } from "../projects";

describe("projects loader", () => {
  it("loads all projects with unique slugs", () => {
    const projects = getProjects();
    expect(projects.length).toBe(projectsData.length);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("getProject finds by slug", () => {
    const project = getProject("codebrief");
    expect(project?.name).toBe("codebrief");
  });
  it("returns undefined for unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});
