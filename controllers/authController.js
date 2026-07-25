import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * @desc  Admin login
 * @route POST /api/auth/admin/login
 */
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid admin email or password");
  }

  const token = generateToken({ id: admin._id, role: "admin" });

  res.json({
    success: true,
    message: "Admin login successful",
    data: {
      role: "admin",
      email: admin.email,
      token,
    },
  });
});

/**
 * @desc  Student login (matric number + name + level)
 * @route POST /api/auth/student/login
 */
export const loginStudent = asyncHandler(async (req, res) => {
  const { matNumber, fullName, level } = req.body;

  if (!matNumber || !fullName || !level) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const student = await Student.findOne({
    matNumber: matNumber.toUpperCase(),
    fullName: new RegExp(`^${fullName.trim()}$`, "i"),
  });

  if (!student) {
    res.status(404);
    throw new Error(
      "Your matric number and name were not found. Please contact the admin."
    );
  }

  const token = generateToken({
    id: student._id,
    role: "student",
    matNumber: student.matNumber,
  });

  res.json({
    success: true,
    message: "Student verified successfully",
    data: {
      role: "student",
      matNumber: student.matNumber,
      fullName: student.fullName,
      level: level.trim(),
      token,
    },
  });
});