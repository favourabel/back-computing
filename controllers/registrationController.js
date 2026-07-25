import asyncHandler from "express-async-handler";
import Registration from "../models/Registration.js";

/**
 * @desc  Create or update a student's registration
 * @route POST /api/registrations
 */
export const saveRegistration = asyncHandler(async (req, res) => {
  const {
    matNumber,
    fullName,
    level,
    phoneNumber,
    sex,
    passportPhoto,
    selfie,
    faceDescriptor,
  } = req.body;

  if (!matNumber || !passportPhoto || !faceDescriptor) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const registration = await Registration.findOneAndUpdate(
    { matNumber: matNumber.toUpperCase() },
    {
      matNumber: matNumber.toUpperCase(),
      fullName,
      level,
      phoneNumber,
      sex,
      passportPhoto,
      selfie,
      faceDescriptor,
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    message: "Registration saved",
    data: registration,
  });
});

/**
 * @desc  Get a student's registration
 * @route GET /api/registrations/:matNumber
 */
export const getRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findOne({
    matNumber: req.params.matNumber.toUpperCase(),
  });

  if (!registration) {
    res.status(404);
    throw new Error("Registration not found");
  }

  res.json({ success: true, data: registration });
});