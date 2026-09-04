import { site } from "@/lib/site";

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = [
  { url: site.socials.github, label: "GitHub" },
  { url: site.socials.linkedin, label: "LinkedIn" },
  { url: site.socials.x, label: "X" },
  { url: site.socials.medium, label: "Medium" },
] as const;
