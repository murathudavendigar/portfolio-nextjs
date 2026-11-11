export const site = {
  name: "Murat Hüdavendigâr Öncü",
  shortName: "Murat Öncü",
  url: "https://muratoncu.com",
  title: "Murat Hüdavendigâr Öncü — Frontend Engineer",
  description:
    "Frontend engineer and co-founder at TemCraft Tech. I ship React, Next.js, and React Native products from the Netherlands.",
  email: "contact@muratoncu.com",
  /** Set NEXT_PUBLIC_CAL_URL to a Cal.com (or similar) booking link. */
  calUrl: process.env.NEXT_PUBLIC_CAL_URL?.trim() || "",
  defaultOgImage: "/og/home.png",
  profileImage: "/img/pp.jpeg",
  twitterHandle: "@murathoncu",
  /**
   * Spoken languages. Edit here only: the About page and the Person schema
   * both read this list. `code` is the ISO 639-1 code; `level` is shown as-is.
   */
  languages: [
    { name: "Turkish", code: "tr", level: "Native" },
    { name: "English", code: "en", level: "B1" },
    { name: "Dutch", code: "nl", level: "A2" },
  ],
  socials: {
    github: "https://github.com/murathudavendigar",
    x: "https://x.com/murathoncu",
    linkedin: "https://www.linkedin.com/in/murathudavendigaroncu/",
    medium: "https://medium.com/@murathoncu",
  },
} as const;

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
