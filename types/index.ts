export type ProjectTier = "selected" | "earlier";

export type Projects = {
  img?: string;
  coverFit?: "cover" | "contain";
  name: string;
  slug: string;
  description: string;
  url: string;
  language: string;
  github: string;
  tier: ProjectTier;
  stack?: string[];
  problem?: string;
  approach?: string;
  tradeoffs?: string;
  outcome?: string;
  appStoreUrl?: string;
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
};
