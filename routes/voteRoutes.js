import express from "express";
import {
  castVote,
  getVoteStatus,
  getAllVotes,
} from "../controllers/voteController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status/:matNumber", protect, getVoteStatus);
router.post("/", protect, castVote);
router.get("/", protect, adminOnly, getAllVotes);

export default router;