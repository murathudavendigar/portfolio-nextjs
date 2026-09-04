import BlogCard from "@/components/BlogCard";
import { getArchivedPosts } from "@/lib/blog";
import Link from "next/link";

export const metadata = {
  title: "Learning Archive",
  description:
    "Early learning notes on Python and Django from Murat Hüdavendigâr Öncü's beginner-era writing.",
  alternates: { canonical: "/writing/archive" },
};

export default function WritingArchivePage() {
  const posts = getArchivedPosts();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main" className="flex flex-col items-center px-10 py-20 mx-auto text-center max-w-7xl">
        <Link
          href="/writing"
          className="self-start text-sm underline text-gray-300 dark:text-gray-700 hover:text-[#CA3E47] transition-colors mb-8">
          ← Back to Writing
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
          Learning archive
        </h1>
        <p className="max-w-2xl mt-4 text-sm leading-relaxed text-gray-300 dark:text-gray-700 sm:text-base">
          Early notes written while learning Python and Django. Kept for
          reference — not representative of current frontend-focused work.
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
      </main>
    </div>
  );
}
