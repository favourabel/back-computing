import asyncHandler from "express-async-handler";
import Candidate from "../models/Candidate.js";
import VotingStatus from "../models/VotingStatus.js"; // ✅ NEW — needed for lock check

/* ============================================================================
   HELPER — Block writes when voting is OPEN
   ============================================================================
   Concept:
   Admin can only add/edit/delete candidates when voting is CLOSED.
   This prevents cheating (e.g. adding a candidate mid-election).
   ============================================================================ */
async function ensureVotingIsClosed(res) {
  const status = await VotingStatus.findOne();

  /* If voting is currently open → block the operation */
  if (status?.isOpen) {
    res.status(403);
    throw new Error(
      "Cannot modify candidates while voting is open. Please close voting first."
    );
  }
}

/**
 * @desc  Get all candidates
 * @route GET /api/candidates
 * @access Public (any logged-in user)
 */
export const getAllCandidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find().sort({ position: 1, name: 1 });
  res.json({ success: true, data: candidates });
});

/**
 * @desc  Create a candidate (admin only, voting must be closed)
 * @route POST /api/candidates
 */
export const createCandidate = asyncHandler(async (req, res) => {
  await ensureVotingIsClosed(res); // ✅ NEW — lock check

  const { name, position, manifesto, photo } = req.body;

  if (!name?.trim() || !position?.trim()) {
    res.status(400);
    throw new Error("Name and position are required");
  }

  const candidate = await Candidate.create({
    name: name.trim(),
    position: position.trim(),
    manifesto: manifesto?.trim() || "",
    photo: photo || null,
  });

  res.status(201).json({ success: true, data: candidate });
});

/**
 * ✅ NEW — Update a candidate (admin only, voting must be closed)
 * @route PUT /api/candidates/:id
 */
export const updateCandidate = asyncHandler(async (req, res) => {
  await ensureVotingIsClosed(res); // ✅ NEW — lock check

  const { name, position, manifesto, photo } = req.body;

  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }

  /* Only update fields that were sent */
  if (name !== undefined) candidate.name = name.trim();
  if (position !== undefined) candidate.position = position.trim();
  if (manifesto !== undefined) candidate.manifesto = manifesto.trim();
  if (photo !== undefined) candidate.photo = photo;

  await candidate.save();

  res.json({ success: true, data: candidate });
});

/**
 * @desc  Delete a candidate (admin only, voting must be closed)
 * @route DELETE /api/candidates/:id
 */
export const deleteCandidate = asyncHandler(async (req, res) => {
  await ensureVotingIsClosed(res); // ✅ NEW — lock check

  const candidate = await Candidate.findByIdAndDelete(req.params.id);
  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }

  res.json({ success: true, message: "Candidate deleted" });
});

/**
 * ✅ NEW — Delete ALL candidates (admin only, voting must be closed)
 * @route DELETE /api/candidates
 * Useful for wiping demo candidates before real election
 */
export const clearAllCandidates = asyncHandler(async (req, res) => {
  await ensureVotingIsClosed(res); // ✅ NEW — lock check

  const result = await Candidate.deleteMany({});

  res.json({
    success: true,
    message: `${result.deletedCount} candidate(s) deleted`,
  });
});