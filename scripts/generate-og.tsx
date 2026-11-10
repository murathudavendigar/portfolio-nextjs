/**
 * Renders every share card to public/og/ before `next build`.
 *
 * Cards are plain static files on purpose: rendering them in a route pulls
 * resvg.wasm (~0.8 MB gzip) into the Cloudflare Worker, which pushes the
 * bundle past the 3 MB free-plan limit.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getPosts } from "@/lib/blog";
import { renderHomeOg, renderOgCard } from "@/lib/og";
import { PAGE_CARDS } from "@/lib/og-pages";
import { getProjects } from "@/lib/projects";
import { formatPostDate } from "@/lib/utils";

const OUT = path.join(process.cwd(), "public/og");

async function save(file: string, render: Promise<Response>) {
  const target = path.join(OUT, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await (await render).arrayBuffer()));
}

async function main() {
  await rm(OUT, { recursive: true, force: true });

  const jobs: Promise<void>[] = [save("home.png", renderHomeOg())];

  for (const [key, card] of Object.entries(PAGE_CARDS)) {
    jobs.push(save(`page/${key}.png`, renderOgCard(card)));
  }

  for (const project of getProjects()) {
    jobs.push(
      save(
        `work/${project.slug}.png`,
        renderOgCard({
          kicker: project.category ?? "Case study",
          title: project.name,
          description: project.description,
          meta: project.stack?.slice(0, 3).join(" · "),
        }),
      ),
    );
  }

  for (const post of getPosts()) {
    jobs.push(
      save(
        `writing/${post.slug}.png`,
        renderOgCard({
          kicker: `Writing · ${post.readTime} min read`,
          title: post.title,
          description: post.description,
          meta: formatPostDate(post.createdAt),
        }),
      ),
    );
  }

  await Promise.all(jobs);
  console.log(`og: wrote ${jobs.length} cards to public/og`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
