import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await User.find()
    .select("username score")
    .sort({ "score.total": -1 });
  res.json(users);
});

export default router;
