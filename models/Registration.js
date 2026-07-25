import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    matNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    fullName: { type: String, required: true },
    level: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    sex: { type: String, enum: ["Male", "Female"], required: true },
    passportPhoto: { type: String, required: true },
    selfie: { type: String },
    faceDescriptor: { type: [Number], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);