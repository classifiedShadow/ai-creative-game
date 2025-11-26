import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  stage1: { type: Number, default: 0 },
  stage2: { type: Number, default: 0 },
  stage3: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

const stageStatusSchema = new mongoose.Schema({
  stage1: { type: Boolean, default: false },
  stage2: { type: Boolean, default: false },
  stage3: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  enrollment: { type: String, unique: true, required: true },
  name: String,
  phone: String,
  username: String,
  passwordLast6: String,
  isAdmin: { type: Boolean, default: false },
  stageStatus: { type: stageStatusSchema, default: () => ({}) },
  score: { type: scoreSchema, default: () => ({}) }
});

export default mongoose.model("User", userSchema);
