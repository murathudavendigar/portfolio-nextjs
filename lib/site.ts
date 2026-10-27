export const site = {
  name: "Murat Hüdavendigâr Öncü",
  shortName: "Murat Öncü",
  url: "https://www.muratoncu.com",
  title: "Murat Hüdavendigâr Öncü — Frontend Engineer",
  description:
    "Frontend engineer and co-founder at TemCraft Tech. I ship React, Next.js, and React Native products from the Netherlands.",
  email: "contact@muratoncu.com",
  /** Booking link. NEXT_PUBLIC_CAL_URL overrides it (e.g. for a different event). */
  calUrl:
    process.env.NEXT_PUBLIC_CAL_URL?.trim() ||
    "https://cal.com/murat-hudavendigar-oncu/15min",
  defaultOgImage: "/img/og.jpg",
  profileImage: "/img/pp.jpeg",
  twitterHandle: "@murathoncu",
  socials: {
    github: "https://github.com/murathudavendigar",
    x: "https://x.com/murathoncu",
    linkedin: "https://www.linkedin.com/in/murathudavendigaroncu/",
    medium: "https://medium.com/@murathoncu",
  },
} as const;

/**
 * Default share image. Next.js replaces (not merges) a parent's `openGraph`,
 * so every page that sets its own `openGraph` must pass this back in.
 */
export const defaultOgImages = [
  { url: site.defaultOgImage, width: 1200, height: 630 },
];

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;

/** Label for the intro button: only promise a booking when a calendar exists. */
export function introBookingLabel(): string {
  return site.calUrl ? "Book a 15-min intro" : "Email me";
}

export function introBookingHref(): string {
  if (site.calUrl) return site.calUrl;
  const subject = encodeURIComponent("15-min intro");
  const body = encodeURIComponent(
    "Hi Murat,\n\nI'd like a short intro call about:\n- \n\nTimezone:\n",
  );
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
