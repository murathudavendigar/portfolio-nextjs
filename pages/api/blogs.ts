import clientPromise from "@/lib/mongodb";
import Logger from "dev-console-kit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogsCollection = db.collection("blogs");
    const commentsCollection = db.collection("comments");

    if (req.method === "GET") {
      // Sadece yayınlanmış blogları çek
      const blogs = await blogsCollection
        .find({ published: true })
        .sort({ date: -1 })
        .toArray();

      // Her blog için yorum sayısını al
      const blogsWithComments = await Promise.all(
        blogs.map(async (blog) => {
          const commentCount = await commentsCollection.countDocuments({
            blogId: blog._id.toString(),
          });

          return {
            id: blog._id.toString(),
            title: blog.title,
            description: blog.description,
            content: blog.content,
            imageUrl: blog.imageUrl || "",
            date: blog.date || Date.now(),
            likes: blog.likes || 0,
            commentCount,
            author: blog.author || "Anonymous",
            slug: blog.slug || blog._id.toString(),
            tags: blog.tags || [],
            published: blog.published || false,
            readTime: blog.readTime || 5,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        data: blogsWithComments,
      });
    }

    // POST ile yeni blog ekle (admin için)
    else if (req.method === "POST") {
      const { title, description, content, imageUrl } = req.body;

      const newBlog = {
        title,
        description,
        content,
        imageUrl: imageUrl || "",
        date: Date.now(),
        likes: 0,
      };

      const result = await blogsCollection.insertOne(newBlog);

      return res.status(201).json({
        success: true,
        data: { id: result.insertedId.toString(), ...newBlog },
      });
    } else {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }
  } catch (error) {
    Logger.error("MongoDB error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
