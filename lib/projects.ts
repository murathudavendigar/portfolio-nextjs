import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";

const allProjects = projectsData as ProjectType[];

/**
 * Homepage Featured spine = strongest shipped products that prove the brand
 * promise (ratings, real users, clear card art). HaberAI & Money Guardian stay
 * selected on /work but are intentionally /work-only until their card art and
 * case-study depth match this set — prefer explicit “Featured products”
 * labeling over promoting them into the homepage row.
 */
export const HOMEPAGE_FEATURED_SLUGS = [
  "daily-skyline",
  "courai",
  "choose-game",
  "autoinvoice-pro",
  "codebrief",
  "nodezero",
] as const;

export function getProjects(): ProjectType[] {
  return allProjects;
}

export function getHomepageFeaturedProjects(): ProjectType[] {
  return HOMEPAGE_FEATURED_SLUGS.map((slug) => getProject(slug)).filter(
    (p): p is ProjectType => Boolean(p),
  );
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

export function getPublishedNpmCount(): number {
  return allProjects.filter((p) => p.language === "NPM").length;
}

export function getShippedIosCount(): number {
  return allProjects.filter((p) => Boolean(p.appStoreUrl)).length;
}

const CATEGORY_ORDER = [
  "Mobile Apps",
  "Desktop Apps",
  "Web Products",
  "npm Packages",
] as const;

/** Native desktop apps (Electron or Tauri). */
export function isDesktopApp(project: ProjectType): boolean {
  return project.language === "Electron" || project.language === "Tauri";
}

function categoryFor(project: ProjectType): (typeof CATEGORY_ORDER)[number] {
  if (project.language === "iOS") return "Mobile Apps";
  if (isDesktopApp(project)) return "Desktop Apps";
  if (project.language === "NPM") return "npm Packages";
  return "Web Products";
}

export function getSelectedProjectsByCategory(): {
  category: (typeof CATEGORY_ORDER)[number];
  projects: ProjectType[];
}[] {
  const selected = getSelectedProjects();
  return CATEGORY_ORDER.map((category) => ({
    category,
    projects: selected.filter((p) => categoryFor(p) === category),
  })).filter((group) => group.projects.length > 0);
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
    project.problem ||
      project.approach ||
      project.tradeoffs ||
      project.outcome ||
      project.lessons,
  );
}

export type WorkMockupKind = "iphone" | "safari" | "none";

export function hasWorkMedia(project: ProjectType): boolean {
  return Boolean(project.img?.trim());
}

export function getWorkMockupKind(project: ProjectType): WorkMockupKind {
  if (!hasWorkMedia(project)) return "none";
  if (project.mockup) return project.mockup;
  if (project.language === "iOS") return "iphone";
  if (project.language === "NPM" || isDesktopApp(project)) return "none";
  return "safari";
}

export function projectPrimaryCta(project: ProjectType): {
  href: string;
  label: string;
} | null {
  if (project.appStoreUrl) {
    return { href: project.appStoreUrl, label: "App Store" };
  }
  if (project.downloadUrl) {
    return { href: project.downloadUrl, label: project.ctaLabel ?? "Download" };
  }
  if (!project.url) return null;
  if (project.ctaLabel) return { href: project.url, label: project.ctaLabel };
  if (project.language === "NPM") {
    return { href: project.url, label: "NPM Package" };
  }
  return { href: project.url, label: "Visit site" };
}

const normalizeTopic = (value: string) => value.toLowerCase().replace(/[.\s-]/g, "");

/**
 * Case studies for a post: the ones named in its `projects` frontmatter first,
 * then selected work whose stack overlaps the post's tags.
 */
export function getRelatedWork(
  post: { projects: string[]; tags: string[] },
  limit = 2,
): ProjectType[] {
  const explicit = post.projects
    .map((slug) => getProject(slug))
    .filter((p): p is ProjectType => Boolean(p));

  const tags = new Set(post.tags.map(normalizeTopic));
  const byStack = getSelectedProjects()
    .filter((p) => !explicit.includes(p))
    .map((p) => ({
      p,
      overlap: (p.stack ?? []).filter((s) => tags.has(normalizeTopic(s))).length,
    }))
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .map((entry) => entry.p);

  return [...explicit, ...byStack].slice(0, limit);
}
