import express from "express";
import {
  getAllThreats,
  getThreatById,
  getThreatStats,
  analyzeThreat,
} from "../controllers/threat.controller";

const router = express.Router();

router.get("/", getAllThreats);
router.get("/stats",getThreatStats)
router.get("/:id", getThreatById);
router.post("/analyze", analyzeThreat);
export default router;
