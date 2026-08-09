/* ============================================================================
   ROUTES — Voting Status
   ============================================================================
   GET  /api/voting/status  → protected (any logged-in user)
   PUT  /api/voting/status  → protected + admin only
   ============================================================================ */

import express from "express";
import {
  getVotingStatus,
  setVotingStatus,
} from "../controllers/votingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Read status — any logged in user (student or admin) */
router.get("/status", protect, getVotingStatus);

/* Change status — admin only */
router.put("/status", protect, adminOnly, setVotingStatus);

export default router;