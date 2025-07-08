import express from "express";
import {
  getAllThreats,
  getThreatById,
  getThreatStats,
} from "../controllers/threat.controller";

const router = express.Router();

router.get("/", getAllThreats);
router.get("/stats",getThreatStats)
router.get("/:id", getThreatById);
export default router;
