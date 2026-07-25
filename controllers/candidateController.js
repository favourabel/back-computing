import asyncHandler from "express-async-handler";
import Candidate from "../models/Candidate.js";

/**
 * @desc  Get all candidates
 * @route GET /api/candidates
 */
export const getAllCandidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find().sort({ position: 1, name: 1 });
  res.json({ success: true, data: candidates });
});

/**
 * @desc  Create a candidate (admin only)
 * @route POST /api/candidates
 */
export const createCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.create(req.body);
  res.status(201).json({ success: true, data: candidate });
});

/**
 * @desc  Delete a candidate (admin only)
 * @route DELETE /api/candidates/:id
 */
export const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);
  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }
  res.json({ success: true, message: "Candidate deleted" });
});