import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const brainSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    bestBrain: {
      type: mongoose.Schema.Types.Mixed, // Accept any type
      required: false,
    },
  },
  { strict: false }
);

// Remove old model if it exists to avoid OverwriteModelError in dev
if (mongoose.models.Brain) {
  delete mongoose.models.Brain;
}

const Brain = mongoose.model("Brain", brainSchema);

export default Brain;
