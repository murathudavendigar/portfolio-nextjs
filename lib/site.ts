export const site = {
  name: "Murat Hüdavendigâr Öncü",
  shortName: "Murat Öncü",
  url: "https://www.muratoncu.com",
  title: "Murat Hüdavendigâr Öncü — Frontend Developer",
  description:
    "Frontend developer building fast, polished web apps with React, Next.js and TypeScript. Projects, experience and writing on the frontend craft.",
  email: "murathoncu@gmail.com",
  defaultOgImage: "/img/MHO.jpg",
  twitterHandle: "@murathoncu",
  socials: {
    github: "https://github.com/murathudavendigar",
    x: "https://x.com/murathoncu",
    linkedin: "https://www.linkedin.com/in/murathudavendigaroncu/",
    medium: "https://medium.com/@murathoncu",
  },
} as const;

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;
