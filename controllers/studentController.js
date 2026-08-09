import asyncHandler from "express-async-handler";
import fs from "fs";
import Student from "../models/Student.js";

// ✅ Updated — import parseStudentFile instead of parseStudentCSV
import { parseStudentFile } from "../utils/parseStudentFile.js";

/**
 * @desc  Bulk upload students via CSV or XLSX
 * @route POST /api/students/upload
 */
export const uploadStudentsCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    // ✅ Updated error message to reflect both file types
    throw new Error("No CSV or XLSX file uploaded");
  }

  // ✅ Updated — parseStudentFile handles both CSV and XLSX automatically
  const parsed = parseStudentFile(req.file.path);
  fs.unlinkSync(req.file.path);

  if (parsed.length === 0) {
    res.status(400);
    // ✅ Updated error message to reflect both file types
    throw new Error("No valid student rows found in the uploaded file");
  }

  // ✅ DEBUG — log first parsed row so we can verify in Render logs
  console.log("🔍 First parsed row:", parsed[0]);
  console.log("🔍 Total parsed rows:", parsed.length);

  // ✅ EXPLICITLY list every field so Mongoose can't strip anything
  const operations = parsed.map((s) => ({
    updateOne: {
      filter: { matNumber: s.matNumber.toUpperCase() },
      update: {
        $setOnInsert: {
          matNumber: s.matNumber.toUpperCase(),
          fullName: s.fullName,
          programme: s.programme || "",
        },
      },
      upsert: true,
    },
  }));

  const result = await Student.bulkWrite(operations);

  res.json({
    success: true,
    message: `${result.upsertedCount} student(s) added. ${
      parsed.length - result.upsertedCount
    } duplicate(s) skipped.`,
    data: {
      totalAdded: result.upsertedCount,
      duplicatesSkipped: parsed.length - result.upsertedCount,
    },
  });
});

/**
 * @desc  Get all students
 * @route GET /api/students
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json({ success: true, data: students });
});

/**
 * @desc  Delete a single student
 * @route DELETE /api/students/:id
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json({ success: true, message: "Student deleted" });
});

/**
 * @desc  Delete ALL students
 * @route DELETE /api/students
 */
export const clearAllStudents = asyncHandler(async (req, res) => {
  await Student.deleteMany({});
  res.json({ success: true, message: "All students deleted" });
});