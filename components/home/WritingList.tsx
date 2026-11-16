import Reveal from "@/components/Reveal";
import { getFlagshipPosts } from "@/lib/blog";
import { formatPostDate } from "@/lib/utils";
import Link from "next/link";

/** The two newest posts as large title rows. */
export default function WritingList() {
  const posts = getFlagshipPosts().slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="writing-title"
      className="mx-auto max-w-6xl px-6 pb-28 pt-8 md:px-10 md:pb-40">
      <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2
          id="writing-title"
          className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-tight text-white dark:text-gray-900">
          Writing
        </h2>
        <Link
          href="/writing"
          className="text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47] dark:text-gray-900 dark:decoration-gray-400">
          All posts
        </Link>
      </Reveal>

      <ul className="mt-10">
        {posts.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={i * 0.08}>
            <Link
              href={`/writing/${post.slug}`}
              className="group grid gap-x-12 gap-y-3 rounded-lg px-4 py-8 transition-colors duration-200 hover:bg-inkDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:px-6 dark:hover:bg-paperDeep">
              <span className="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-tight text-white transition-colors [text-wrap:balance] group-hover:text-[var(--accent-text)] dark:text-gray-900 dark:group-hover:text-[var(--accent-text)]">
                {post.title}
              </span>
              <span className="text-[17px] leading-relaxed text-gray-200 dark:text-gray-800">
                <span className="line-clamp-3">{post.description}</span>
                <span className="mt-3 block text-[15px] text-[var(--text-muted)]">
                  {formatPostDate(post.date)} · {post.readTime} min read
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
