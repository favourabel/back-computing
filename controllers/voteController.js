import asyncHandler from "express-async-handler";
import Vote from "../models/Vote.js";

/**
 * @desc  Check if student has voted
 * @route GET /api/votes/status/:matNumber
 */
export const getVoteStatus = asyncHandler(async (req, res) => {
  const vote = await Vote.findOne({
    matNumber: req.params.matNumber.toUpperCase(),
  });
  res.json({ success: true, hasVoted: !!vote });
});

/**
 * @desc  Cast a vote
 * @route POST /api/votes
 */
export const castVote = asyncHandler(async (req, res) => {
  const { matNumber, fullName, selections, selfie } = req.body;

  const existing = await Vote.findOne({ matNumber: matNumber.toUpperCase() });
  if (existing) {
    res.status(400);
    throw new Error("You have already voted. Each student can vote only once.");
  }

  const vote = await Vote.create({
    matNumber: matNumber.toUpperCase(),
    fullName,
    selections,
    selfie,
  });

  res.status(201).json({
    success: true,
    message: "Vote recorded successfully",
    data: vote,
  });
});

/**
 * @desc  Get all votes (admin only) + tally
 * @route GET /api/votes
 */
export const getAllVotes = asyncHandler(async (req, res) => {
  const votes = await Vote.find();

  const tally = {};
  votes.forEach((vote) => {
    for (const [position, candidateId] of vote.selections.entries()) {
      const key = `${position}:${candidateId}`;
      tally[key] = (tally[key] || 0) + 1;
    }
  });

  res.json({
    success: true,
    data: { total: votes.length, tally, votes },
  });
});