import clientPromise from "@/lib/mongodb";
import { Projects } from "@/types";
import Logger from "dev-console-kit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio-db"); // Veritabanı adınız
    const collection = db.collection<Projects>("projects"); // Collection adınız

    if (req.method === "GET") {
      // Tüm projeleri çek
      const { language } = req.query;

      let query = {};
      if (language && language !== "All") {
        // technologies array'inde arama yap
        query = { technologies: language };
      }

      const rawProjects = await collection.find(query).toArray();

      // MongoDB formatını component'in beklediği formata dönüştür
      const projects = rawProjects.map((project: any) => ({
        img: project.imageUrl || "",
        name: project.title,
        description: project.description,
        url: project.liveUrl,
        language: project.technologies?.[0] || "Other", // İlk technology'yi al
        github: project.githubUrl,
        featured: project.featured || false,
      }));

      return res.status(200).json({
        success: true,
        data: projects,
      });
    }

    // POST isteği ile yeni proje ekleyebilirsiniz (opsiyonel)
    else if (req.method === "POST") {
      const project = req.body;
      const result = await collection.insertOne(project);

      return res.status(201).json({
        success: true,
        data: result,
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
