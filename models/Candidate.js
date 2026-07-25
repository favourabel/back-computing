import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true, index: true },
    manifesto: { type: String, default: "" },
    photo: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);