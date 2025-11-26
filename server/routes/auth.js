import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { enrollment, name, phone, username, isAdmin } = req.body;
    const last6 = phone.slice(-6);
    const user = await User.create({
      enrollment,
      name,
      phone,
      username,
      passwordLast6: last6,
      isAdmin: !!isAdmin
    });
    res.json({ message: "Registered", userId: user._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { enrollment, password } = req.body;
  const user = await User.findOne({ enrollment });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (password !== user.passwordLast6) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      enrollment: user.enrollment,
      username: user.username,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: {
      enrollment: user.enrollment,
      username: user.username,
      name: user.name,
      isAdmin: user.isAdmin,
      stageStatus: user.stageStatus,
      score: user.score
    }
  });
});

export default router;
