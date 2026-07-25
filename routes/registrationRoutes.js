import express from "express";
import {
  saveRegistration,
  getRegistration,
} from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveRegistration);
router.get("/:matNumber", protect, getRegistration);

export default router;