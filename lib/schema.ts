import { absoluteUrl, site } from "@/lib/site";
import type { BlogPost } from "@/types";

export const personId = `${site.url}/#person`;
export const websiteId = `${site.url}/#website`;
export const profileImageId = `${site.url}/#profileimage`;
export const orgId = "https://temcrafttech.com/#organization";

export function personSchema() {
  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: site.url,
    jobTitle: "Frontend Developer",
    email: site.email,
    description: site.description,
    image: { "@id": profileImageId },
    sameAs: Object.values(site.socials),
    worksFor: { "@id": orgId },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Kocaeli University",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "React Native",
      "Django",
      ".NET",
      "iOS",
      "Frontend Development",
      "Web Development Education",
    ],
    knowsLanguage: ["en", "tr"],
    hasOccupation: {
      "@type": "Occupation",
      name: "Frontend Developer",
    },
    homeLocation: {
      "@type": "Place",
      name: "Netherlands",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
  };
}

export function personStub() {
  return {
    "@id": personId,
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Frontend Developer",
    sameAs: Object.values(site.socials),
  };
}

export function homepageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.shortName,
        description: site.description,
        publisher: { "@id": personId },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#webpage`,
        url: site.url,
        name: site.title,
        description: site.description,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        primaryImageOfPage: { "@id": profileImageId },
        inLanguage: "en",
      },
      personSchema(),
      {
        "@type": "ImageObject",
        "@id": profileImageId,
        url: absoluteUrl(site.profileImage),
        contentUrl: absoluteUrl(site.profileImage),
        caption: site.name,
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: "TemCraft Tech",
        url: "https://temcrafttech.com",
        founder: { "@id": personId },
      },
    ],
  };
}

export function blogPostingGraph(post: BlogPost) {
  const url = absoluteUrl(`/writing/${post.slug}`);
  const imageUrl = absoluteUrl(post.imageUrl || site.defaultOgImage);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Writing",
            item: absoluteUrl("/writing"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          contentUrl: imageUrl,
        },
        datePublished: new Date(post.createdAt).toISOString(),
        ...(post.updatedAt && {
          dateModified: new Date(post.updatedAt).toISOString(),
        }),
        author: personStub(),
        publisher: personStub(),
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        isPartOf: { "@id": websiteId },
        inLanguage: "en",
        keywords: post.tags.join(", "),
      },
    ],
  };
}

export function workSchema(project: {
  name: string;
  description: string;
  slug: string;
  github: string;
  url: string;
  img?: string;
  appStoreUrl?: string;
  language?: string;
}) {
  const pageUrl = absoluteUrl(`/work/${project.slug}`);
  const image = project.img?.startsWith("/")
    ? absoluteUrl(project.img)
    : project.img || undefined;
  const isApp = project.language === "iOS";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: absoluteUrl("/work"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": isApp ? "SoftwareApplication" : "CreativeWork",
        "@id": `${pageUrl}#project`,
        name: project.name,
        description: project.description,
        url: pageUrl,
        image,
        codeRepository: project.github || undefined,
        installUrl: project.appStoreUrl || undefined,
        applicationCategory: isApp ? "MobileApplication" : undefined,
        operatingSystem: isApp ? "iOS" : undefined,
        author: { "@id": personId },
        isPartOf: { "@id": websiteId },
      },
    ],
  };
}

export function workIndexSchema(projects: { name: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/work")}#webpage`,
    url: absoluteUrl("/work"),
    name: "Work — Murat Hüdavendigâr Öncü",
    description:
      "Case studies and shipped projects by Murat Hüdavendigâr Öncü.",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/work/${project.slug}`),
        name: project.name,
      })),
    },
  };
}

export function aboutPageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${absoluteUrl("/about")}#webpage`,
        url: absoluteUrl("/about"),
        name: `About — ${site.shortName}`,
        description:
          "Murat Hüdavendigâr Öncü — frontend developer, co-founder of TemCraft Tech, and frontend instructor based in the Netherlands.",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        inLanguage: "en",
      },
      personSchema(),
    ],
  };
}

export function contactPageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${absoluteUrl("/contact")}#webpage`,
        url: absoluteUrl("/contact"),
        name: `Contact — ${site.shortName}`,
        description:
          "Get in touch with Murat Hüdavendigâr Öncü — frontend engineer based in the Netherlands.",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: {
          "@type": "Person",
          "@id": personId,
          name: site.name,
          email: site.email,
          url: site.url,
        },
        inLanguage: "en",
      },
    ],
  };
}

export function privacyPageGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl("/privacy")}#webpage`,
    url: absoluteUrl("/privacy"),
    name: `Privacy Policy — ${site.shortName}`,
    description:
      "What muratoncu.com collects through the contact form and site analytics, and how it's used.",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    inLanguage: "en",
  };
}

export function blogIndexSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/writing")}#webpage`,
    url: absoluteUrl("/writing"),
    name: "Writing — Murat Hüdavendigâr Öncü",
    description:
      "Writing on React, Next.js, TypeScript and the frontend craft by Murat Hüdavendigâr Öncü.",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/writing/${post.slug}`),
        name: post.title,
      })),
    },
  };
}
