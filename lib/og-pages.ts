import { getProjects } from "@/lib/projects";

/** Share-card copy for pages that are not a case study or a post. */
export const PAGE_CARDS = {
  about: {
    kicker: "About",
    title: "Frontend engineer, co-founder, teacher.",
    description:
      "Co-founder of TemCraft Tech. I ship React, Next.js, and React Native products from the Netherlands.",
  },
  work: {
    kicker: "Work",
    title: "Shipped products and case studies",
    description: `${getProjects().length} projects across iOS, Android, the web, npm, and Windows.`,
  },
  writing: {
    kicker: "Writing",
    title: "Notes from shipping frontend products",
    description: "React, Next.js, TypeScript, and the tooling around them.",
  },
  archive: {
    kicker: "Writing · Archive",
    title: "Learning archive",
    description: "Early notes on Python and Django from when I was starting out.",
  },
  lab: {
    kicker: "Lab",
    title: "Tap first, read later",
    description: "Interactive slices of products I have shipped.",
  },
  "lab-choose": {
    kicker: "Lab · CHOOSE",
    title: "Play a timed CHOOSE round",
    description: "Wrong answers score, timers burn lives. Then read the case study.",
  },
  "lab-daily-skyline": {
    kicker: "Lab · Daily Skyline",
    title: "Solve a 5×5 skyline board",
    description: "A full tutorial puzzle from the iOS and Android game.",
  },
  "lab-courai": {
    kicker: "Lab · Courai",
    title: "Courai, hands-on",
    description: "Lab demo coming soon. The case study is live.",
  },
  "lab-autoinvoice": {
    kicker: "Lab · AutoInvoice Pro",
    title: "AutoInvoice Pro, hands-on",
    description: "Lab demo coming soon. The case study is live.",
  },
  now: {
    kicker: "Now",
    title: "What I am focused on right now",
    description: "Shipping, learning, and what I am deliberately not doing.",
  },
  hire: {
    kicker: "Hire",
    title: "Work with me",
    description:
      "Frontend roles and scoped React / Next.js work through TemCraft. What to send and what happens next.",
  },
  contact: {
    kicker: "Contact",
    title: "Say hello",
    description: "Open to frontend roles and freelance React / Next.js work.",
  },
  uses: {
    kicker: "Uses",
    title: "Hardware and software I use daily",
  },
  privacy: {
    kicker: "Privacy",
    title: "Privacy policy",
    description: "What this site collects, and what it does not.",
  },
} as const;

export type PageCardKey = keyof typeof PAGE_CARDS;

// PNGs are written by scripts/generate-og.tsx (runs as `prebuild`).
const card = (url: string, alt: string) => [{ url, width: 1200, height: 630, alt }];

export const homeOgImages = card("/og/home.png", "Murat Öncü — Frontend Engineer");

export function pageOgImages(key: PageCardKey) {
  return card(`/og/page/${key}.png`, PAGE_CARDS[key].title);
}

export function workOgImages(slug: string, name: string) {
  return card(`/og/work/${slug}.png`, `${name} — case study`);
}

export function writingOgImages(slug: string, title: string) {
  return card(`/og/writing/${slug}.png`, title);
}
