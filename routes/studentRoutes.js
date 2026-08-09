import express from "express";
import {
  uploadStudentsCSV,
  getAllStudents,
  deleteStudent,
  clearAllStudents,
} from "../controllers/studentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

// ✅ Updated — import uploadFile instead of uploadCSV
import { uploadFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Updated — uploadFile instead of uploadCSV
router.post("/upload", protect, adminOnly, uploadFile.single("file"), uploadStudentsCSV);
router.get("/", protect, adminOnly, getAllStudents);
router.delete("/:id", protect, adminOnly, deleteStudent);
router.delete("/", protect, adminOnly, clearAllStudents);

export default router;