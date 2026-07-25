import express from "express";
import { loginAdmin, loginStudent } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/student/login", loginStudent);

export default router;