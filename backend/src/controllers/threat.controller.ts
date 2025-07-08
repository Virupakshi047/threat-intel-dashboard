import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllThreats = async (req: Request, res: Response) => {
  const { page = "1", limit = "10", category, search } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (category) {
    where.threatCategory = {
      contains: category as string,
      mode: "insensitive",
    };
  }

  if (search) {
    where.cleanedText = {
      contains: search as string,
      mode: "insensitive",
    };
  }

  try {
    const threats = await prisma.threat.findMany({
      where,
      skip,
      take: limitNum,
    });

    const total = await prisma.threat.count({ where });

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      data: threats,
    });
  } catch (error) {
    console.error("❌ Failed to fetch threats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getThreatById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid threat id" });
  }

  try {
    const threat = await prisma.threat.findUnique({
      where: {
        id: parsedId,
      },
    });

    if (!threat) {
      return res.status(404).json({ error: "Threat not found" });
    }

    res.json(threat);
  } catch (error) {
    console.error("❌ Failed to fetch threat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getThreatStats = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.threat.count();

    const categoryCounts = await prisma.threat.groupBy({
      by: ["threatCategory"],
      _count: {
        threatCategory: true,
      },
    });

    const severityCounts = await prisma.threat.groupBy({
      by: ["severityScore"],
      _count: {
        severityScore: true,
      },
    });

    res.json({
      totalThreats: total,
      categoryCounts: categoryCounts.map((c: { threatCategory: string; _count: { threatCategory: number } }) => ({
        category: c.threatCategory,
        count: c._count.threatCategory,
      })),
      severityCounts: severityCounts.map((s: { severityScore: number; _count: { severityScore: number } }) => ({
        severity: s.severityScore,
        count: s._count.severityScore,
      })),
    });
  } catch (error) {
    console.error("❌ Failed to fetch stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
