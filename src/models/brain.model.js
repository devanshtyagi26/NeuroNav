import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const brainSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  bestBrain: {
    type: String,
  },
});

const Brain = mongoose.models.brain || mongoose.model("brain", brainSchema);

export default Brain;
