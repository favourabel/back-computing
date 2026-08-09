/* ============================================================================
   CONTROLLER — Voting Status
   ============================================================================
   - GET  /api/voting/status  → anyone logged in can read the flag
   - PUT  /api/voting/status  → admin only, changes the flag

   Concept:
   Because VotingStatus is a "singleton" (only one doc), we use a small
   helper that fetches the doc — or creates it once if it doesn't exist.
   That way the admin never has to seed anything manually.
   ============================================================================ */

import asyncHandler from "express-async-handler";
import VotingStatus from "../models/VotingStatus.js";

/* --------------------------------------------------------------------------
   Helper — always returns THE single status doc
   (creates it the very first time it's ever accessed)
   -------------------------------------------------------------------------- */
async function getOrCreateStatus() {
  let status = await VotingStatus.findOne();

  if (!status) {
    status = await VotingStatus.create({ isOpen: false });
  }

  return status;
}

/**
 * @desc  Get current voting status (open or closed)
 * @route GET /api/voting/status
 * @access Any logged-in user (student or admin)
 */
export const getVotingStatus = asyncHandler(async (req, res) => {
  const status = await getOrCreateStatus();

  res.json({
    success: true,
    data: {
      isOpen: status.isOpen,
      updatedAt: status.updatedAt,
      updatedBy: status.updatedBy,
    },
  });
});

/**
 * @desc  Open or close voting
 * @route PUT /api/voting/status
 * @access Admin only
 */
export const setVotingStatus = asyncHandler(async (req, res) => {
  const { isOpen } = req.body;

  /* Basic validation — must be true or false */
  if (typeof isOpen !== "boolean") {
    res.status(400);
    throw new Error("'isOpen' must be true or false");
  }

  const status = await getOrCreateStatus();

  status.isOpen = isOpen;
  status.updatedBy = req.user?.email || "admin";
  await status.save();

  console.log(
    `🗳️  Voting has been ${isOpen ? "OPENED" : "CLOSED"} by ${status.updatedBy}`
  );

  res.json({
    success: true,
    message: `Voting is now ${isOpen ? "OPEN" : "CLOSED"}`,
    data: {
      isOpen: status.isOpen,
      updatedAt: status.updatedAt,
      updatedBy: status.updatedBy,
    },
  });
});