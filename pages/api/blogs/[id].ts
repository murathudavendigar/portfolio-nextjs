import clientPromise from "@/lib/mongodb";
import Logger from "dev-console-kit";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogsCollection = db.collection("blogs");

    if (req.method === "GET") {
      // Tek blog detayını çek - slug veya id ile
      let blog;

      // Önce slug ile ara
      blog = await blogsCollection.findOne({ slug: id });

      // Slug ile bulunamadıysa ObjectId ile ara
      if (!blog && ObjectId.isValid(id)) {
        blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
      }

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: blog._id.toString(),
          title: blog.title,
          description: blog.description,
          content: blog.content,
          imageUrl: blog.imageUrl || "",
          date: blog.date || Date.now(),
          likes: blog.likes || 0,
          author: blog.author || "Anonymous",
          slug: blog.slug || blog._id.toString(),
          tags: blog.tags || [],
          published: blog.published || false,
          readTime: blog.readTime || 5,
        },
      });
    }

    // PUT ile blog güncelle
    else if (req.method === "PUT") {
      const { title, description, content, imageUrl } = req.body;

      const result = await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title,
            description,
            content,
            imageUrl,
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog updated successfully",
      });
    }

    // DELETE ile blog sil
    else if (req.method === "DELETE") {
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
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
