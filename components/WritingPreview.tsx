import { getFlagshipPosts } from "@/lib/blog";
import Link from "next/link";
import Reveal from "./Reveal";
import BlogCard from "./BlogCard";

export default function WritingPreview() {
  const posts = getFlagshipPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6 dark:border-gray-400/40">
          <div>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Thoughts & Notes
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
              Writing
            </h2>
          </div>
          <Link
            href="/writing"
            className="group hidden font-mono-ui text-xs uppercase tracking-wider text-[var(--accent-text)] transition-colors hover:text-white dark:hover:text-gray-900 sm:inline-flex">
            View all posts <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={i * 0.1}>
            <BlogCard
              title={post.title}
              date={new Date(post.date).toLocaleDateString()}
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

      <Reveal delay={0.2}>
        <div className="mt-10 sm:hidden">
          <Link
            href="/writing"
            className="btn-secondary w-full justify-center">
            View all posts
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
