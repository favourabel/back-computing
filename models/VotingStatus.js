/* ============================================================================
   MODEL — VotingStatus
   ============================================================================
   Concept:
   We only store ONE document in this collection — a single flag that tells
   the whole app whether voting is currently open or closed. It never gets
   duplicated. This is called a "singleton" pattern.
   ============================================================================ */

import mongoose from "mongoose";

const votingStatusSchema = new mongoose.Schema(
  {
    /* The only field that matters — true means students can vote */
    isOpen: {
      type: Boolean,
      default: false, // ✅ Safety default — voting starts CLOSED
    },

    /* Who last changed it — helpful for admin auditing */
    updatedBy: {
      type: String,
      default: "system",
    },
  },
  { timestamps: true }
);

const VotingStatus = mongoose.model("VotingStatus", votingStatusSchema);

export default VotingStatus;