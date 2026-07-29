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
      "Django",
      ".NET",
      "Frontend Development",
      "Web Development Education",
    ],
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
  const url = absoluteUrl(`/blogs/${post.slug}`);
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
            name: "Blog",
            item: absoluteUrl("/blogs"),
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

export function projectSchema(project: {
  name: string;
  description: string;
  slug: string;
  github: string;
  url: string;
  language: string;
}) {
  const pageUrl = absoluteUrl(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#project`,
    name: project.name,
    description: project.description,
    url: pageUrl,
    codeRepository: project.github || undefined,
    author: { "@id": personId },
    isPartOf: { "@id": websiteId },
  };
}

export function blogIndexSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/blogs")}#webpage`,
    url: absoluteUrl("/blogs"),
    name: "Blog — Murat Hüdavendigâr Öncü",
    description:
      "Writing on React, Next.js, TypeScript, Python and the frontend craft by Murat Hüdavendigâr Öncü.",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blogs/${post.slug}`),
        name: post.title,
      })),
    },
  };
}
