import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    matNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);