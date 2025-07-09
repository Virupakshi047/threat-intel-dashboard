import { Request, Response } from "express";
import prisma from "../../prisma/client";
import path from "path";
import { PythonShell } from "python-shell";
export const getAllThreats = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    category,
    search,
    sort,
    severity,
  } = req.query;

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

  if (severity) {
    where.severityScore = Number(severity);
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort && typeof sort === "string") {
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    else if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
  }

  try {
    const threats = await prisma.threat.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
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
      categoryCounts: categoryCounts.map(
        (c: {
          threatCategory: string;
          _count: { threatCategory: number };
        }) => ({
          category: c.threatCategory,
          count: c._count.threatCategory,
        })
      ),
      severityCounts: severityCounts.map(
        (s: { severityScore: number; _count: { severityScore: number } }) => ({
          severity: s.severityScore,
          count: s._count.severityScore,
        })
      ),
    });
  } catch (error) {
    console.error("❌ Failed to fetch stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const analyzeThreat = async (req: Request, res: Response) => {
  const { description } = req.body;
  if (!description || typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'description' in request body" });
  }

  // Simple mapping from category to severity
  function mapCategoryToSeverity(category: string): string {
    switch (category.toLowerCase()) {
      case 'ransomware':
      case 'malware':
        return 'critical';
      case 'phishing':
        return 'high';
      case 'ddos':
        return 'medium';
      default:
        return 'low';
    }
  }

  try {
    const options = {
      mode: "json" as const, 
      pythonOptions: ["-u"],
      scriptPath: path.join(__dirname, "../../ml"),
      args: [description],
    };

    PythonShell.run("predict_api.py", options)
      .then(async (results) => {
        if (results && results.length > 0) {
          const predicted_category = results[0].predicted_category || 'Unknown';
          const predicted_severity = mapCategoryToSeverity(predicted_category);
          // Save to Predicted table
          await prisma.predicted.create({
            data: {
              text: description,
              category: predicted_category,
              severity: predicted_severity,
            },
          });
          return res.json({
            predicted_category,
            predicted_severity,
          });
        } else {
          return res
            .status(500)
            .json({ error: "No prediction results returned" });
        }
      })
      .catch((err) => {
        console.error("❌ Prediction error:", err);
        return res
          .status(500)
          .json({ error: "Failed to analyze threat description" });
      });
  } catch (error) {
    console.error("❌ Prediction error:", error);
    return res
      .status(500)
      .json({ error: "Failed to analyze threat description" });
  }
};

export const getRecentPredictions = async (_req: Request, res: Response) => {
  try {
    const recents = await prisma.predicted.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.json(recents);
  } catch (error) {
    console.error('❌ Failed to fetch recent predictions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
