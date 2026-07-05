import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import clientPromise from "@/lib/mongodb";
import type { BlogPost } from "@/types";
import Logger from "dev-console-kit";
import Image from "next/image";
import Link from "next/link";

export async function getStaticProps() {
  // Eğer MONGODB_URI yoksa boş array dön
  if (!process.env.MONGODB_URI) {
    Logger.warning("MONGODB_URI is not defined, returning empty posts array");
    return {
      props: {
        posts: [],
      },
      revalidate: 30,
    };
  }

  try {
    // MongoDB'den direkt blogları çek
    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogsCollection = db.collection("blogs");
    const commentsCollection = db.collection("comments");

    // Sadece yayınlanmış blogları çek, createdAt'e göre sırala
    const blogs = await blogsCollection
      .find({ published: true })
      .sort({ createdAt: -1, date: -1 })
      .toArray();

    // Her blog için yorum sayısını al
    const blogsWithComments = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await commentsCollection.countDocuments({
          blogId: blog._id.toString(),
        });

        return {
          id: blog._id.toString(),
          title: blog.title || "",
          description: blog.description || "",
          content: blog.content || "",
          imageUrl: blog.imageUrl || "",
          date:
            typeof (blog.createdAt || blog.date) === "number"
              ? blog.createdAt || blog.date || Date.now()
              : (blog.createdAt || blog.date) instanceof Date
                ? (blog.createdAt || blog.date).getTime()
                : Date.now(),
          createdAt:
            typeof (blog.createdAt || blog.date) === "number"
              ? blog.createdAt || blog.date || Date.now()
              : (blog.createdAt || blog.date) instanceof Date
                ? (blog.createdAt || blog.date).getTime()
                : Date.now(),
          updatedAt: blog.updatedAt
            ? typeof blog.updatedAt === "number"
              ? blog.updatedAt
              : blog.updatedAt instanceof Date
                ? blog.updatedAt.getTime()
                : null
            : null,
          likes: blog.likes || 0,
          commentCount,
          author: blog.author || "Anonymous",
          slug: blog.slug || blog._id.toString(),
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          published: Boolean(blog.published),
          readTime: blog.readTime || 5,
        };
      }),
    );

    return {
      props: {
        posts: blogsWithComments,
      },
      revalidate: 30,
    };
  } catch (error) {
    Logger.error("Error fetching blog posts:", error);
    return {
      props: {
        posts: [],
      },
      revalidate: 30,
    };
  }
}

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80 font-custom transition-all duration-500 scroll-smooth">
      <Seo
        title="Blog — Murat Öncü"
        description="Writing on React, Next.js, TypeScript, Python and the frontend craft by Murat Hüdavendigâr Öncü."
        path="/blogs"
      />
      <Header />

      <div className="relative flex flex-col items-center min-h-screen px-10 py-20 mx-auto text-center md:text-left md:flex-row max-w-7xl justify-evenly">
        <h3 className="absolute top-20 uppercase tracking-[20px] text-gray-200 dark:text-gray-700 text-2xl">
          My Blog Posts
        </h3>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mt-20 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                date={new Date(post.date).toLocaleDateString()}
                slug={post.slug}
                description={post.description}
                imageUrl={post.imageUrl}
                likes={post.likes}
                commentCount={post.commentCount}
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
    </div>
  );
}
