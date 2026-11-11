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
  /**
   * Search engine ownership codes. Paste only the `content` value of each
   * meta tag the webmaster tool gives you. Empty ones are not rendered.
   * Google is best verified by a DNS TXT record (Domain property), so it can
   * stay empty. Bing can import from Google Search Console instead.
   */
  searchVerification: {
    google: "",
    bing: "",
    yandex: "9ba1531b8a659fca",
    naver: "a4a82f72db4b4da0ac29897b14014233f2bb5f9b",
    seznam: "",
  },
} as const;

/**
 * Search snippets get cut around 160 characters. Trim longer text at a word
 * boundary and end it with an ellipsis.
 */
export function metaDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const end = cut.lastIndexOf(" ");
  return `${cut.slice(0, end > 0 ? end : cut.length).replace(/[\s,;:.—-]+$/, "")}…`;
}

/** Builds Next.js `metadata.verification` from `site.searchVerification`. */
export function verificationMetadata(
  v: Record<keyof typeof site.searchVerification, string> = site.searchVerification,
) {
  const other: Record<string, string> = {};
  if (v.bing) other["msvalidate.01"] = v.bing;
  if (v.naver) other["naver-site-verification"] = v.naver;
  if (v.seznam) other["seznam-wmt"] = v.seznam;

  return {
    ...(v.google && { google: v.google }),
    ...(v.yandex && { yandex: v.yandex }),
    ...(Object.keys(other).length > 0 && { other }),
  };
}

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
