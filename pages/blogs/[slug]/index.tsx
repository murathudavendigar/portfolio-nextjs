import CommentSection from "@/components/CommentSection";
import Header from "@/components/Header";
import LikeButton from "@/components/LikeButton";
import clientPromise from "@/lib/mongodb";
import type { BlogPost } from "@/types";
import "highlight.js/styles/github-dark.css";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogsCollection = db.collection("blogs");

    const blogs = await blogsCollection
      .find({ published: true })
      .project({ slug: 1 })
      .toArray();

    const paths = blogs.map((blog) => ({
      params: { slug: blog.slug || blog._id.toString() },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching blog paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogsCollection = db.collection("blogs");

    // Slug ile ara
    const blog = await blogsCollection.findOne({ slug });

    if (!blog) {
      return {
        notFound: true,
      };
    }

    const post = {
      id: blog._id.toString(),
      title: blog.title || "",
      description: blog.description || "",
      content: blog.content || "",
      imageUrl: blog.imageUrl || "",
      date: blog.date || Date.now(),
      likes: blog.likes || 0,
      author: blog.author || "Anonymous",
      slug: blog.slug || blog._id.toString(),
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      published: Boolean(blog.published),
      readTime: blog.readTime || 5,
    };

    return {
      props: {
        post,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return {
      notFound: true,
    };
  }
};

export default function BlogPost({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80 font-custom transition-all duration-500 scroll-smooth">
      <Head>
        <title>{post.title} | MHO</title>
        <meta name="description" content={post.description} />
      </Head>
      <Header />

      <div className="w-full min-h-screen py-12 sm:py-16 md:py-20 lg:py-24">
        <article className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          {/* Back button - Modern Design */}
          <Link
            href="/blogs"
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
              Back to Blogs
            </span>
          </Link>

          {/* Hero image - Responsive */}
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

          {/* Article header - Modern & Responsive */}
          <header className="mb-8 sm:mb-10 md:mb-12">
            <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl dark:text-gray-900 sm:mb-5 md:mb-6">
              {post.title}
            </h1>

            <div className="flex flex-col items-start gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 sm:gap-3 sm:text-sm dark:text-gray-600">
                {post.author && (
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">{post.author}</span>
                  </div>
                )}
                <time
                  dateTime={new Date(post.date).toISOString()}
                  className="px-3 py-1.5 rounded-full bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300">
                  {formattedDate}
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

              {/* Like Button */}
              <div className="mt-2 sm:mt-0">
                <LikeButton postId={post.id} initialLikes={post.likes || 0} />
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-[#CA3E47]/10 text-[#CA3E47] dark:bg-[#CA3E47]/20 border border-[#CA3E47]/30 dark:border-[#CA3E47]/40 hover:bg-[#CA3E47]/20 dark:hover:bg-[#CA3E47]/30 transition-colors duration-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-base leading-relaxed text-gray-200 sm:text-lg md:text-xl dark:text-gray-700">
              {post.description}
            </p>
          </header>

          {/* Article content - Responsive */}
          <div className="mb-12 prose-sm prose prose-invert sm:prose-base md:prose-lg dark:prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="mt-6 mb-4 text-2xl font-bold text-white sm:mt-8 sm:text-3xl dark:text-gray-900"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="mt-5 mb-3 text-xl font-bold text-white sm:mt-6 sm:text-2xl dark:text-gray-900"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="mt-4 mb-2 text-lg font-bold text-white sm:text-xl dark:text-gray-900"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p
                    className="mb-4 text-sm leading-relaxed text-gray-200 sm:text-base dark:text-gray-700"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="mb-4 space-y-2 text-gray-200 list-disc list-inside dark:text-gray-700"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="mb-4 space-y-2 text-gray-200 list-decimal list-inside dark:text-gray-700"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#CA3E47] pl-4 italic my-4 text-gray-300"
                    {...props}
                  />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code
                      className="bg-gray-800 dark:bg-gray-200 text-[#CA3E47] px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono"
                      {...props}
                    />
                  ) : (
                    <code
                      className="block p-3 my-4 overflow-x-auto font-mono text-xs text-gray-300 bg-gray-900 rounded-lg sm:p-4 sm:text-sm dark:bg-gray-200 dark:text-gray-800"
                      {...props}
                    />
                  ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="p-3 my-4 overflow-x-auto font-mono text-xs text-gray-300 bg-gray-900 rounded-lg sm:p-4 sm:text-sm dark:bg-gray-200 dark:text-gray-800"
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-[#CA3E47] hover:underline"
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                img: ({ node, ...props }) => (
                  <img className="w-full my-4 rounded-lg" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr
                    className="my-8 border-white/20 dark:border-gray-300"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="my-4 overflow-x-auto">
                    <table
                      className="min-w-full border border-gray-700 dark:border-gray-300"
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="px-4 py-2 font-bold bg-gray-800 border border-gray-700 dark:border-gray-300 dark:bg-gray-200"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="px-4 py-2 border border-gray-700 dark:border-gray-300"
                    {...props}
                  />
                ),
              }}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Comments Section */}
          <CommentSection postId={post.id} />

          {/* Footer - Modern Button */}
          <footer className="pt-6 mt-12 border-t sm:pt-8 border-white/20 dark:border-gray-300">
            <Link
              href="/blogs"
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
      </div>
    </div>
  );
}
