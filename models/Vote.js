import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    matNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    fullName: { type: String, required: true },
    selections: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    selfie: { type: String },
    votedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Vote", voteSchema);