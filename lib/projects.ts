import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";

const allProjects = projectsData as ProjectType[];

export function getProjects(): ProjectType[] {
  return allProjects;
}

export function getProject(slug: string): ProjectType | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getSelectedProjects(): ProjectType[] {
  return allProjects.filter((p) => p.tier === "selected");
}

export function getEarlierProjects(): ProjectType[] {
  return allProjects.filter((p) => p.tier === "earlier");
}

export function getAdjacentProjects(slug: string): {
  prev?: ProjectType;
  next?: ProjectType;
} {
  const index = allProjects.findIndex((p) => p.slug === slug);
  if (index < 0) return {};
  return {
    prev: index > 0 ? allProjects[index - 1] : undefined,
    next: index < allProjects.length - 1 ? allProjects[index + 1] : undefined,
  };
}

export function hasCaseStudy(project: ProjectType): boolean {
  return Boolean(
    project.problem || project.approach || project.tradeoffs || project.outcome,
  );
}

export function projectPrimaryCta(project: ProjectType): {
  href: string;
  label: string;
} | null {
  if (project.appStoreUrl) {
    return { href: project.appStoreUrl, label: "App Store" };
  }
  if (!project.url) return null;
  if (project.language === "NPM") {
    return { href: project.url, label: "NPM Package" };
  }
  return { href: project.url, label: "Visit site" };
}
