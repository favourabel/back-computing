import express from "express";
import {
  getAllCandidates,
  createCandidate,
  updateCandidate,      // ✅ NEW
  deleteCandidate,
  clearAllCandidates,   // ✅ NEW
} from "../controllers/candidateController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public read */
router.get("/", getAllCandidates);

/* Admin-only writes (all blocked when voting is open — enforced in controller) */
router.post("/", protect, adminOnly, createCandidate);
router.put("/:id", protect, adminOnly, updateCandidate);            // ✅ NEW
router.delete("/:id", protect, adminOnly, deleteCandidate);
router.delete("/", protect, adminOnly, clearAllCandidates);         // ✅ NEW

export default router;