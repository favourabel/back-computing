import express from "express";
import {
  getAllCandidates,
  createCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCandidates);
router.post("/", protect, adminOnly, createCandidate);
router.delete("/:id", protect, adminOnly, deleteCandidate);

export default router;