import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";

const allProjects = projectsData as ProjectType[];

export function getProjects(): ProjectType[] {
  return allProjects;
}

export function getProject(slug: string): ProjectType | undefined {
  return allProjects.find((p) => p.slug === slug);
}
