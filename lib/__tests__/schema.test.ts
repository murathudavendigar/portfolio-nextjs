import { describe, expect, it } from "vitest";
import {
  aboutPageGraph,
  blogPostingGraph,
  contactPageGraph,
  homepageGraph,
  personSchema,
  workIndexSchema,
  workSchema,
} from "../schema";
import { site } from "@/lib/site";

describe("homepageGraph", () => {
  it("ProfilePage node uses mainEntity (Google's required property), not about", () => {
    const graph = homepageGraph()["@graph"] as any[];
    const profilePage = graph.find((node: any) => node["@type"] === "ProfilePage") as any;
    expect(profilePage).toBeDefined();
    expect(profilePage.mainEntity).toEqual({ "@id": expect.stringContaining("#person") });
    expect(profilePage.about).toBeUndefined();
  });
});

describe("blogPostingGraph", () => {
  it("BlogPosting author/publisher carry an inline Person stub, not just an @id", () => {
    const graph = blogPostingGraph({
      slug: "test-post",
      title: "Test",
      description: "Test description",
      createdAt: Date.now(),
      updatedAt: null,
      tags: ["test"],
    } as any)["@graph"];
    const posting = graph.find((n: any) => n["@type"] === "BlogPosting") as any;
    expect(posting).toBeDefined();
    expect(posting.author.name).toBe(site.name);
    expect(posting.author.jobTitle).toBe("Frontend Developer");
    expect(posting.author.sameAs).toEqual(Object.values(site.socials));
  });
});

describe("blogPostingGraph — writing URLs", () => {
  it("points at /writing/ instead of /blogs/", () => {
    const graph = blogPostingGraph({
      slug: "test-post",
      title: "Test",
      description: "Test description",
      createdAt: Date.now(),
      updatedAt: null,
      tags: ["test"],
    } as any)["@graph"];
    const posting = graph.find((n: any) => n["@type"] === "BlogPosting") as any;
    expect(posting.url).toBe("https://www.muratoncu.com/writing/test-post");
    const breadcrumb = graph.find((n: any) => n["@type"] === "BreadcrumbList") as any;
    expect(breadcrumb.itemListElement[1].name).toBe("Writing");
  });
});

describe("workSchema", () => {
  it("uses /work/ URLs and includes a breadcrumb back to Work and Home", () => {
    const graph = workSchema({
      name: "codebrief",
      description: "Test",
      slug: "codebrief",
      github: "https://github.com/murathudavendigar/codebrief",
      url: "https://www.npmjs.com/package/codebrief",
    })["@graph"] as any[];

    const breadcrumb = graph.find(
      (n) => n["@type"] === "BreadcrumbList",
    ) as any;
    expect(breadcrumb.itemListElement[1].name).toBe("Work");
    expect(breadcrumb.itemListElement[1].item).toContain("/work");

    const work = graph.find((n) => n["@type"] === "CreativeWork") as any;
    expect(work.url).toBe("https://www.muratoncu.com/work/codebrief");
  });

  it("marks iOS products as SoftwareApplication", () => {
    const graph = workSchema({
      name: "Daily Skyline",
      description: "Daily puzzle",
      slug: "daily-skyline",
      github: "",
      url: "https://dailyskyline.muratoncu.com",
      img: "/img/projects/daily-skyline.png",
      appStoreUrl: "https://apps.apple.com/app/id6791111716",
      language: "iOS",
    })["@graph"] as any[];

    const app = graph.find((n) => n["@type"] === "SoftwareApplication") as any;
    expect(app.operatingSystem).toBe("iOS");
    expect(app.installUrl).toContain("apps.apple.com");
    expect(app.image).toBe(
      "https://www.muratoncu.com/img/projects/daily-skyline.png",
    );
  });
});

describe("workIndexSchema", () => {
  it("lists every project under /work/", () => {
    const schema = workIndexSchema([
      { name: "codebrief", slug: "codebrief" },
    ]);
    expect(schema.mainEntity.itemListElement[0].url).toBe(
      "https://www.muratoncu.com/work/codebrief",
    );
  });
});

describe("personSchema", () => {
  it("exposes occupation, languages, and a Netherlands home location", () => {
    const person = personSchema() as any;
    expect(person.jobTitle).toBe("Frontend Developer");
    expect(person.knowsLanguage).toEqual(expect.arrayContaining(["en", "tr"]));
    expect(person.hasOccupation).toMatchObject({
      "@type": "Occupation",
      name: "Frontend Developer",
    });
    expect(person.homeLocation).toMatchObject({
      "@type": "Place",
      name: "Netherlands",
    });
  });
});

describe("aboutPageGraph", () => {
  it("marks /about as an AboutPage whose main entity is the person", () => {
    const graph = aboutPageGraph()["@graph"] as any[];
    const page = graph.find((node) => node["@type"] === "AboutPage");
    expect(page.url).toBe("https://www.muratoncu.com/about");
    expect(page.mainEntity).toEqual({
      "@id": expect.stringContaining("#person"),
    });
  });
});

describe("contactPageGraph", () => {
  it("marks /contact as a ContactPage with the site email", () => {
    const graph = contactPageGraph()["@graph"] as any[];
    const page = graph.find((node) => node["@type"] === "ContactPage");
    expect(page.url).toBe("https://www.muratoncu.com/contact");
    expect(page.mainEntity.email).toBe(site.email);
  });
});
