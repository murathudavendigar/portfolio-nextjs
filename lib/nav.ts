import { site } from "@/lib/site";

/** Every page; the footer lists all of them. */
export const NAV_LINKS = [
  { href: "/work", label: "Work", primary: true },
  { href: "/about", label: "About", primary: true },
  { href: "/lab", label: "Lab", primary: true },
  { href: "/writing", label: "Writing", primary: true },
  { href: "/now", label: "Now", primary: false },
  { href: "/uses", label: "Uses", primary: false },
  { href: "/hire", label: "Hire", primary: false },
  { href: "/contact", label: "Contact", primary: true },
] as const;

/** The short list shown in the header. */
export const PRIMARY_NAV_LINKS = NAV_LINKS.filter((link) => link.primary);

export const SOCIAL_LINKS = [
  { url: site.socials.github, label: "GitHub" },
  { url: site.socials.linkedin, label: "LinkedIn" },
  { url: site.socials.x, label: "X" },
  { url: site.socials.medium, label: "Medium" },
] as const;
