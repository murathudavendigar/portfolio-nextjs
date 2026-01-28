export type Projects = {
  img?: string;
  name: string;
  description: string;
  url: string;
  language: string;
  github: string;
  featured?: boolean;
};

export type Experience = {
  company: string;
  companyImage: string;
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
  updatedAt?: number; // Timestamp in milliseconds
  likes?: number;
  commentCount?: number;
  author: string;
  slug: string;
  tags: string[];
  published: boolean;
  readTime: number; // in minutes
};

export type Comment = {
  id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  date: number;
};
