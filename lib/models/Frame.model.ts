import mongoose from "mongoose";
import { number } from "zod";

const frameSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  logger: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  playerList: [
    {
      type: String, // Array of Clerk userIds
    },
    {
      type: number, // Player's score
    },
    {
      type: [Number],
      default: [], // Array of scores for each player
    }
  ],
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
    default: null, // Will be set when the game ends
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  winnerPlayer: {
    type: String, // Clerk userId of the winner
    default: null, // Will be set when the game ends
  }
});

const Frame = mongoose.models.Frame || mongoose.model("Frame", frameSchema);

export default Frame;
