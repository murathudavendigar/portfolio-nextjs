import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import { getPosts } from "@/lib/blog";
import { blogIndexSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on React, Next.js, TypeScript, and teaching frontend — written by Murat Hüdavendigâr Öncü while building products at TemCraft Tech.",
  alternates: { canonical: "/blogs" },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80 font-custom transition-all duration-500 scroll-smooth">
      <Header />

      <div className="relative flex flex-col items-center min-h-screen px-10 py-20 mx-auto text-center max-w-7xl">
        <h1 className="mt-16 text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
          Writing on frontend development
        </h1>
        <p className="max-w-2xl mt-4 text-sm leading-relaxed text-gray-300 dark:text-gray-700 sm:text-base">
          Practical notes from shipping React and Next.js products and teaching
          the same stack — TypeScript, UI patterns, and the tools I use with
          students and clients.
        </p>

        {posts.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="mb-4 text-lg text-gray-400 dark:text-gray-600">
              No blog posts found
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-700">
              Check back later for new content!
            </p>
          </div>
        )}
      </div>
      <Link href="/">
        <footer className="sticky w-full cursor-pointer bottom-16 md:bottom-5">
          <div className="flex items-center justify-center">
            <Image
              className="object-cover rounded-full cursor-pointer h-11 w-11 filter grayscale hover:grayscale-0"
              src="/img/MHO.jpg"
              alt="Murat Hüdavendigâr Öncü — back to home"
              width={44}
              height={44}
              loading="lazy"
            />
          </div>
        </footer>
      </Link>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogIndexSchema(posts)),
        }}
      />
    </div>
  );
}
