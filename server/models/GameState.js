import mongoose from "mongoose";

const gameStateSchema = new mongoose.Schema({
  stage1Active: { type: Boolean, default: false },
  stage2Active: { type: Boolean, default: false },
  stage3Active: { type: Boolean, default: false }
});


export default mongoose.model("GameState", gameStateSchema);
