import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import { generateToken } from "../utils/generateToken.js";

/* ============================================================================
   Helper — Fallback programme detection from matric number
   ============================================================================
   Used when a student record was uploaded before the `programme` field existed.
   Extracts the department code (2nd segment of matric) and maps to programme.
   
   Example:  FCP/CSC/22/1001  →  "Computer Science"
   ============================================================================ */
function getProgrammeFromMatric(matNumber) {
  if (!matNumber) return "";
  const code = matNumber.split("/")[1]?.toUpperCase();

  const map = {
    CSC: "Computer Science",
    SEN: "Software Engineering",
    IT:  "Information Technology",
    IS:  "Information Systems",
    CYB: "Cybersecurity",
    DSC: "Data Science",
  };

  return map[code] || "";
}

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
 * @desc  Student login (matric number + name + programme + level)
 * @route POST /api/auth/student/login
 * @note  All 4 fields required. Matric + Name + Programme must match the
 *        record uploaded by admin. Any mismatch → generic "not uploaded" error.
 */
export const loginStudent = asyncHandler(async (req, res) => {
  const { matNumber, fullName, department, level } = req.body;

  // ✅ Step 1 — All fields must be present
  if (!matNumber || !fullName || !department || !level) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // ✅ Step 2 — Look up by matric number ONLY (so we can give specific error)
  const student = await Student.findOne({
    matNumber: matNumber.toUpperCase().trim(),
  });

  // ✅ Step 3 — If matric not found → generic uploaded error
  if (!student) {
    res.status(404);
    throw new Error(
      "Your details have not been uploaded. Please contact the admin."
    );
  }

  // ✅ Step 4 — Compare full name (case-insensitive, trimmed)
  const uploadedName = student.fullName.toLowerCase().trim();
  const inputName = fullName.toLowerCase().trim();

  if (uploadedName !== inputName) {
    res.status(401);
    throw new Error(
      "Your details have not been uploaded. Please contact the admin."
    );
  }

  // ✅ Step 5 — Compare programme (with matric-code fallback)
  const programmeFromMatric = getProgrammeFromMatric(student.matNumber);
  const uploadedProgramme = (student.programme || programmeFromMatric)
    .toLowerCase()
    .trim();
  const inputProgramme = department.toLowerCase().trim();

  if (uploadedProgramme !== inputProgramme) {
    res.status(401);
    throw new Error(
      "Your details have not been uploaded. Please contact the admin."
    );
  }

  // ✅ Step 6 — All checks passed → issue token
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
      programme: student.programme || programmeFromMatric,
      level: level.trim(),
      token,
    },
  });
});