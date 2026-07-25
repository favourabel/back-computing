import express from "express";
import {
  uploadStudentsCSV,
  getAllStudents,
  deleteStudent,
  clearAllStudents,
} from "../controllers/studentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadCSV } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", protect, adminOnly, uploadCSV.single("file"), uploadStudentsCSV);
router.get("/", protect, adminOnly, getAllStudents);
router.delete("/:id", protect, adminOnly, deleteStudent);
router.delete("/", protect, adminOnly, clearAllStudents);

export default router;