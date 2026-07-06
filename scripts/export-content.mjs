// scripts/export-content.mjs
// One-time export of MongoDB content to repo files. Run: node scripts/export-content.mjs
import { MongoClient } from "mongodb";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const uri = readFileSync(".env.local", "utf8").match(/MONGODB_URI=(.*)/)[1].trim();
const client = new MongoClient(uri);
await client.connect();
const db = client.db("portfolio-db");

const yamlStr = (s) => JSON.stringify(String(s ?? ""));
const iso = (v) => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return d.toISOString().slice(0, 10);
};

mkdirSync("content/blog", { recursive: true });
const blogs = await db.collection("blogs").find({ published: true }).toArray();
for (const b of blogs) {
  const fm = [
    "---",
    `title: ${yamlStr(b.title)}`,
    `description: ${yamlStr(b.description)}`,
    `date: "${iso(b.createdAt ?? b.date)}"`,
    `updated: ${b.updatedAt ? `"${iso(b.updatedAt)}"` : "null"}`,
    `tags: ${JSON.stringify(b.tags ?? [])}`,
    `readTime: ${b.readTime ?? 5}`,
    `image: ${yamlStr(b.imageUrl)}`,
    `author: ${yamlStr(b.author ?? "Murat Hüdavendigâr Öncü")}`,
    "---",
    "",
  ].join("\n");
  const slug = b.slug || b._id.toString();
  writeFileSync(`content/blog/${slug}.md`, fm + (b.content ?? ""));
  console.log("wrote", slug);
}

// Same mapping pages/api/projects.ts uses today, so Projects.tsx renders identically.
const rawProjects = await db.collection("projects").find({}).toArray();
const projects = rawProjects.map((p) => ({
  img: p.imageUrl || "",
  name: p.title,
  description: p.description,
  url: p.liveUrl,
  language: p.technologies?.[0] || "Other",
  github: p.githubUrl,
  featured: p.featured || false,
}));
writeFileSync("data/projects.json", JSON.stringify(projects, null, 2) + "\n");
console.log("wrote", projects.length, "projects");
await client.close();
