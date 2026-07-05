import clientPromise from "@/lib/mongodb";
import { site } from "@/lib/site";
import type { GetServerSideProps } from "next";

type Entry = { loc: string; lastmod?: string };

const toIsoDate = (value: unknown): string | undefined => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number") return new Date(value).toISOString().slice(0, 10);
  return undefined;
};

const buildXml = (entries: Entry[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>${
        e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""
      }\n  </url>`,
  )
  .join("\n")}
</urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const entries: Entry[] = [
    { loc: site.url },
    { loc: `${site.url}/blogs` },
  ];

  try {
    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogs = await db
      .collection("blogs")
      .find({ published: true })
      .project({ slug: 1, updatedAt: 1, createdAt: 1, date: 1 })
      .toArray();

    for (const blog of blogs) {
      const slug = blog.slug || blog._id.toString();
      entries.push({
        loc: `${site.url}/blogs/${slug}`,
        lastmod: toIsoDate(blog.updatedAt ?? blog.createdAt ?? blog.date),
      });
    }
  } catch {
    // Sitemap still serves the static pages if MongoDB is unreachable.
  }

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.write(buildXml(entries));
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
