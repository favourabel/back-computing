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
    // ✅ NEW — programme field added
    programme: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);