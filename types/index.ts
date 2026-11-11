export type ProjectTier = "selected" | "earlier";

export type Projects = {
  img?: string;
  coverFit?: "cover" | "contain";
  mockup?: "iphone" | "safari" | "none";
  name: string;
  slug: string;
  category?: string;
  description: string;
  /** Short, complete sentence (≤155 chars) for meta/OG when `description` is longer. */
  metaDescription?: string;
  url: string;
  /**
   * The live site is down (e.g. a disabled Vercel deployment). Hides every
   * link to `url` until the site is back. Remove the flag to show them again.
   */
  offline?: boolean;
  /** Direct installer/download link; when set it becomes the primary CTA and url becomes "Website". */
  downloadUrl?: string;
  language: string;
  github: string;
  tier: ProjectTier;
  stack?: string[];
  problem?: string;
  approach?: string;
  tradeoffs?: string;
  outcome?: string;
  lessons?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  /** Label for the main button when it is not the App Store (e.g. "Download for Windows"). */
  ctaLabel?: string;
};

export type Experience = {
  company: string;
  companyImage?: string;
  usedTechnologiesImages: string[];
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  points: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  description: string;
  /** Frontmatter `seoTitle`: shorter <title> when `title` runs past 60 chars. */
  seoTitle?: string;
  /** Frontmatter `metaDescription`: short meta/OG text when `description` is long. */
  metaDescription?: string;
  content: string;
  imageUrl: string;
  date: number; // Timestamp in milliseconds (deprecated, use createdAt)
  createdAt: number; // Timestamp in milliseconds
  updatedAt: number | null; // Timestamp in milliseconds or null
  author: string;
  slug: string;
  tags: string[];
  published: boolean;
  readTime: number; // in minutes
  /** Work slugs this post is about (frontmatter `projects`). */
  projects: string[];
  /** Frontmatter `archived: true`: listed on /writing/archive, URL unchanged. */
  archived: boolean;
};
