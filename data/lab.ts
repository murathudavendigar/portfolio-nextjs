export type LabStatus = "live" | "soon";

export type LabExperiment = {
  /** URL segment under /lab — e.g. choose → /lab/choose */
  slug: string;
  /** Matching projects.json slug for /work/[slug] */
  workSlug: string;
  title: string;
  eyebrow: string;
  summary: string;
  status: LabStatus;
  /** Optional live product URL (App Store, PWA, etc.) */
  productUrl?: string;
  productLabel?: string;
};

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    slug: "choose",
    workSlug: "choose-game",
    title: "CHOOSE",
    eyebrow: "Wrong is right",
    summary:
      "Timed mini-run of the inverted quiz rule — wrong answers score, correct ones burn lives, combos stack.",
    status: "live",
    productUrl: "https://choosegame.muratoncu.com",
    productLabel: "Play full CHOOSE",
  },
  {
    slug: "daily-skyline",
    workSlug: "daily-skyline",
    title: "Daily Skyline",
    eyebrow: "Skyscraper logic",
    summary:
      "A full 5×5 tutorial board — same height-and-clue loop as the daily puzzle, with a few givens to start.",
    status: "live",
    productUrl: "https://apps.apple.com/app/id6791111716",
    productLabel: "App Store",
  },
];

export function getLabExperiments(): LabExperiment[] {
  return LAB_EXPERIMENTS;
}

export function getLabExperiment(slug: string): LabExperiment | undefined {
  return LAB_EXPERIMENTS.find((e) => e.slug === slug);
}

export function getLabByWorkSlug(workSlug: string): LabExperiment | undefined {
  return LAB_EXPERIMENTS.find((e) => e.workSlug === workSlug);
}

export function getLiveLabExperiments(): LabExperiment[] {
  return LAB_EXPERIMENTS.filter((e) => e.status === "live");
}
