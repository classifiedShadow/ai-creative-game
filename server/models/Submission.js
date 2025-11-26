import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stage: { type: Number, required: true },
  prompt: String,
  imageUrl: String,
  peerVotes: { type: Number, default: 0 },
  aiScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);
