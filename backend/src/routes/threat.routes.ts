import express from "express";
import {
  getAllThreats,
  getThreatById,
  getThreatStats,
  analyzeThreat,
  getRecentPredictions,
} from "../controllers/threat.controller";

const router = express.Router();

router.get("/", getAllThreats);
router.get("/stats",getThreatStats)
router.get("/recents", getRecentPredictions);
router.get("/:id", getThreatById);
router.post("/analyze", analyzeThreat);
export default router;
