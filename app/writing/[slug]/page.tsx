import MarkdownContent from "@/components/MarkdownContent";
import { getPost, getPosts } from "@/lib/blog";
import { blogPostingGraph } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      ...(post.updatedAt && {
        modifiedTime: new Date(post.updatedAt).toISOString(),
      }),
      tags: post.tags,
      images: [{ url: post.imageUrl || "/img/og.jpg" }],
    },
  };
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const createdDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isUpdated =
    post.updatedAt &&
    new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingGraph(post)),
        }}
      />

      <main id="main" className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
        <article className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <Link
            href="/writing"
            className="group inline-flex items-center gap-2 px-4 py-2 mb-8 sm:mb-10 md:mb-12 text-sm font-medium rounded-lg bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300 hover:bg-white/10 dark:hover:bg-gray-200 hover:border-[#CA3E47]/50 dark:hover:border-[#CA3E47] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#CA3E47]/20">
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 text-[#CA3E47]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-white dark:text-gray-800 group-hover:text-[#CA3E47] transition-colors duration-300">
              Back to Writing
            </span>
          </Link>

          {post.imageUrl && (
            <div className="relative w-full h-48 mb-8 overflow-hidden shadow-2xl rounded-2xl sm:h-64 md:h-80 lg:h-96 group">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          <header className="mb-8 sm:mb-10 md:mb-12">
            <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl dark:text-gray-900 sm:mb-5 md:mb-6">
              {post.title}
            </h1>

            <div className="flex flex-col items-start gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 font-mono-ui text-xs text-gray-400 sm:gap-3 sm:text-sm dark:text-gray-600">
                {post.author && (
                  <Link
                    href="/about"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300 hover:border-[#CA3E47]/50 hover:text-[#CA3E47] transition-colors">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">{post.author}</span>
                    <span className="hidden sm:inline text-gray-500 dark:text-gray-600">
                      {" "}
                      · frontend developer
                    </span>
                  </Link>
                )}
                <time
                  dateTime={new Date(post.createdAt).toISOString()}
                  className="px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300">
                  {createdDate}
                </time>
                {post.readTime && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">{post.readTime} min</span>
                  </div>
                )}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 font-mono-ui text-xs sm:text-sm font-medium rounded-full bg-[#CA3E47]/10 text-[#CA3E47] dark:bg-[#CA3E47]/20 border border-[#CA3E47]/30 dark:border-[#CA3E47]/40 hover:bg-[#CA3E47]/20 dark:hover:bg-[#CA3E47]/30 transition-colors duration-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-base leading-relaxed text-gray-200 sm:text-lg md:text-xl dark:text-gray-700">
              {post.description}
            </p>

            {isUpdated && (
              <div className="flex items-center gap-2 px-3 py-2 mt-4 text-xs text-gray-400 border rounded-lg sm:text-sm bg-white/5 dark:bg-gray-200/30 border-white/10 dark:border-gray-300 dark:text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>
                  Last updated on{" "}
                  <time dateTime={new Date(post.updatedAt!).toISOString()}>
                    {updatedDate}
                  </time>
                </span>
              </div>
            )}
          </header>

          <div className="mb-12 prose-sm prose prose-invert sm:prose-base md:prose-lg dark:prose max-w-none">
            <MarkdownContent content={post.content} />
          </div>

          <footer className="pt-6 mt-12 border-t sm:pt-8 border-white/20 dark:border-gray-300">
            <Link
              href="/writing"
              className="group inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg bg-[#CA3E47] hover:bg-[#CA3E47]/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#CA3E47]/30 hover:scale-105">
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to all posts</span>
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
