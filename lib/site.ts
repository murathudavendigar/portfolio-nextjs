export const site = {
  name: "Murat Hüdavendigâr Öncü",
  shortName: "Murat Öncü",
  url: "https://www.muratoncu.com",
  title: "Murat Hüdavendigâr Öncü — Frontend Developer",
  description:
    "Co-founder at TemCraft Tech and frontend instructor. I build React and Next.js products and teach modern web development from the Netherlands.",
  email: "contact@muratoncu.com",
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

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;
