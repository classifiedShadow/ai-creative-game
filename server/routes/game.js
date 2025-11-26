import express from "express";
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import GameState from "../models/GameState.js";
import { authRequired } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Ensure a single GameState doc exists
const ensureGameState = async () => {
  let state = await GameState.findOne();
  if (!state) {
    state = await GameState.create({});
  }
  return state;
};

// Get current game state + user status
router.get("/state", authRequired, async (req, res) => {
  const state = await ensureGameState();
  const user = await User.findById(req.user.id);
  res.json({ global: state, userStatus: user.stageStatus });
});

// -------- Stage 1 --------

// Generate image (placeholder call to HF)
router.post("/stage1/generate", authRequired, async (req, res) => {
  const { prompt } = req.body;
  // HERE: call Hugging Face text-to-image if you want.
  // For now just return a fake image URL.
  const fakeUrl = `https://picsum.photos/seed/${encodeURIComponent(
    prompt
  )}/512/512`;

  res.json({ imageUrl: fakeUrl });
});

// Submit final Stage1 image
router.post("/stage1/submit", authRequired, async (req, res) => {
  const { prompt, imageUrl, aiScore = 20 } = req.body;

  // basic originality check
  if (!prompt || prompt.length < 10) {
    return res.status(400).json({ message: "Prompt too short / generic" });
  }

  const user = await User.findById(req.user.id);

  const submission = await Submission.create({
    user: user._id,
    stage: 1,
    prompt,
    imageUrl,
    aiScore,
    peerVotes: 0
  });

  user.stageStatus.stage1 = true;
  user.score.stage1 = aiScore; // temporary, real score after voting
  user.score.total =
    (user.score.stage1 + user.score.stage2 + user.score.stage3) / 3;
  await user.save();

  // broadcast leaderboard update
  req.app.get("io").emit("leaderboard-update");

  res.json({ message: "Stage 1 submitted", submissionId: submission._id });
});

// Voting: get random Stage1 submissions (excluding self)
router.get("/stage1/vote-list", authRequired, async (req, res) => {
  const submissions = await Submission.find({
    stage: 1,
    user: { $ne: req.user.id }
  })
    .populate("user", "username")
    .limit(10);
  res.json(submissions);
});

// Cast a vote
router.post("/stage1/vote", authRequired, async (req, res) => {
  const { submissionId } = req.body;
  const sub = await Submission.findById(submissionId);
  if (!sub) return res.status(404).json({ message: "Not found" });
  sub.peerVotes += 1;
  await sub.save();

  req.app.get("io").emit("leaderboard-update");
  res.json({ message: "Voted" });
});

// -------- Stage 2 --------
router.post("/stage2/submit", authRequired, async (req, res) => {
  const { relevancyScore } = req.body; // from MCQ selection
  const user = await User.findById(req.user.id);

  user.stageStatus.stage2 = true;
  user.score.stage2 = relevancyScore;
  user.score.total =
    (user.score.stage1 + user.score.stage2 + user.score.stage3) / 3;
  await user.save();

  req.app.get("io").emit("leaderboard-update");
  res.json({ message: "Stage 2 submitted" });
  
  console.log("Stage 2 submitted by user:", req.user.username);
});
//res.redirect("/Leaderboard");

// -------- Stage 3 --------
router.post("/stage3/submit", authRequired, async (req, res) => {
  const { prompt, imageUrl, similarityScore = 70 } = req.body;
  // similarityScore should come from an AI comparison (e.g. CLIP)
  const user = await User.findById(req.user.id);

  await Submission.create({
    user: user._id,
    stage: 3,
    prompt,
    imageUrl,
    aiScore: similarityScore
  });

  user.stageStatus.stage3 = true;
  user.score.stage3 = similarityScore;
  user.score.total =
    (user.score.stage1 + user.score.stage2 + user.score.stage3) / 3;
  await user.save();

  req.app.get("io").emit("leaderboard-update");
  res.json({ message: "Stage 3 submitted" });
});

export default router;
