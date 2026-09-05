import BlogCard from "@/components/BlogCard";
import { getFlagshipPosts } from "@/lib/blog";
import { blogIndexSchema } from "@/lib/schema";
import Link from "next/link";

export const metadata = {
  title: "Writing",
  description:
    "Notes on React, Next.js, TypeScript, and teaching frontend — written by Murat Hüdavendigâr Öncü while building products at TemCraft Tech.",
  alternates: { canonical: "/writing" },
};

export default function WritingIndexPage() {
  const posts = getFlagshipPosts();

  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main" className="flex flex-col items-center px-10 py-20 mx-auto text-center max-w-7xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
          Writing on frontend development
        </h1>
        <p className="max-w-2xl mt-4 text-sm leading-relaxed text-gray-300 dark:text-gray-700 sm:text-base">
          Practical notes from shipping React and Next.js products and
          teaching the same stack — TypeScript, UI patterns, and the tools I
          use with students and clients.
        </p>

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

        <Link
          href="/writing/archive"
          className="mt-12 text-sm underline text-gray-300 dark:text-gray-700 hover:text-[var(--accent-text)] transition-colors">
          Looking for the earlier Python/Django learning notes? See the
          archive →
        </Link>
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
