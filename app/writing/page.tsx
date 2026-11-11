import { absoluteUrl, site } from "@/lib/site";
import { pageOgImages } from "@/lib/og-pages";
import { formatPostDate } from "@/lib/utils";
import BlogCard from "@/components/BlogCard";
import Reveal from "@/components/Reveal";
import { getFlagshipPosts } from "@/lib/blog";
import { blogIndexSchema } from "@/lib/schema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing · React, Next.js and TypeScript",
  description: "Articles by Murat Öncü on frontend development: React, Next.js, TypeScript, and how real products are structured, built, and shipped.",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: `Writing · React, Next.js and TypeScript — ${site.shortName}`,
    description: "Articles by Murat Öncü on frontend development: React, Next.js, TypeScript, and how real products are structured, built, and shipped.",
    url: absoluteUrl("/writing"),
    images: pageOgImages("writing"),
  },
};

export default function WritingIndexPage() {
  const posts = getFlagshipPosts();

  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main" className="flex flex-col items-center px-10 py-20 mx-auto text-center max-w-7xl">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
            Writing on frontend development
          </h1>
          <p className="max-w-2xl mt-4 text-sm leading-relaxed text-gray-300 dark:text-gray-700 sm:text-base">
            Practical notes from shipping React and Next.js products — TypeScript, UI patterns, and the CLIs I use with clients and agents.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={Math.min(index, 8) * 0.06}>
              <BlogCard
                title={post.title}
                date={formatPostDate(post.date)}
                slug={post.slug}
                description={post.description}
                imageUrl={post.imageUrl}
                readTime={post.readTime}
                tags={post.tags}
                author={post.author}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/writing/archive"
            className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors"
          >
            Earlier learning notes (Python, JavaScript, React basics) are in the archive →
          </Link>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogIndexSchema(posts)),
        }}
      />
    </div>
  );
}
