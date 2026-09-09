import BlogCard from "@/components/BlogCard";
import Reveal from "@/components/Reveal";
import { getFlagshipPosts } from "@/lib/blog";
import { blogIndexSchema } from "@/lib/schema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Writing on frontend development, React, Next.js, and TypeScript.",
  alternates: { canonical: "/writing" },
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
            Practical notes from shipping React and Next.js products and teaching the same stack — TypeScript, UI patterns, and the CLIs I use with students, clients, and agents.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              date={new Date(post.date).toLocaleDateString()}
              slug={post.slug}
              description={post.description}
              imageUrl={post.imageUrl}
              readTime={post.readTime}
              tags={post.tags}
              author={post.author}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="https://medium.com/@murathudavendigar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-500 hover:text-[var(--accent-text)] transition-colors"
          >
            Looking for the earlier Python/Django learning notes? See the archive →
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
