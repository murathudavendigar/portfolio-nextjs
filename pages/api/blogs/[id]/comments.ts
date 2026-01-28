import clientPromise from "@/lib/mongodb";
import Logger from "dev-console-kit";
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
    const commentsCollection = db.collection("comments");

    if (req.method === "GET") {
      // Blog yorumlarını çek
      const comments = await commentsCollection
        .find({ blogId: id })
        .sort({ date: -1 })
        .toArray();

      const formattedComments = comments.map((comment) => ({
        id: comment._id.toString(),
        blogId: comment.blogId,
        name: comment.name,
        email: comment.email,
        comment: comment.comment,
        date: comment.date,
      }));

      return res.status(200).json({
        success: true,
        data: formattedComments,
      });
    }

    // POST ile yeni yorum ekle
    else if (req.method === "POST") {
      const { name, email, comment } = req.body;

      if (!name || !email || !comment) {
        return res.status(400).json({
          success: false,
          message: "Name, email and comment are required",
        });
      }

      const newComment = {
        blogId: id,
        name,
        email,
        comment,
        date: Date.now(),
      };

      const result = await commentsCollection.insertOne(newComment);

      return res.status(201).json({
        success: true,
        data: {
          id: result.insertedId.toString(),
          ...newComment,
        },
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
