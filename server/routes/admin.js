import express from "express";
import GameState from "../models/GameState.js";
import User from "../models/User.js";
import { authRequired, adminRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toggle a stage on/off
router.post(
  "/toggle-stage",
  authRequired,
  adminRequired,
  async (req, res) => {
    const { stage, active } = req.body;
    const state = await GameState.findOne() || (await GameState.create({}));

    if (stage === 1) state.stage1Active = active;
    if (stage === 2) state.stage2Active = active;
    if (stage === 3) state.stage3Active = active;
    await state.save();
    res.json(state);
    console.log("State updated:", state);
  }
);

// Reset a user
router.post(
  "/reset-user",
  authRequired,
  adminRequired,
  async (req, res) => {
    const { enrollment } = req.body;
    const user = await User.findOne({ enrollment });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.stageStatus = { stage1: false, stage2: false, stage3: false };
    user.score = { stage1: 0, stage2: 0, stage3: 0, total: 0 };
    await user.save();

    res.json({ message: "User reset" });
    console.log("User reset:", user.username);
  }
);

export default router;
