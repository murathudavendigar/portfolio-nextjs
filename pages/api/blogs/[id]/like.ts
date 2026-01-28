import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;
    const { action } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const client = await clientPromise;
    const db = client.db("portfolio-db");
    const blogsCollection = db.collection("blogs");

    // Like veya unlike işlemi
    const increment = action === "unlike" ? -1 : 1;

    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { likes: increment } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Güncel like sayısını al ve 0'ın altına düşmesin
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    const currentLikes = Math.max(0, blog?.likes || 0);

    // Eğer 0'ın altına düştüyse düzelt
    if (currentLikes === 0 && (blog?.likes || 0) < 0) {
      await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { likes: 0 } },
      );
    }

    return res.status(200).json({
      success: true,
      likes: currentLikes,
    });
  } catch (error) {
    console.error("MongoDB error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
