import mongoose from "mongoose";

const Countdownsschema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likedby",
    },
  ],
});

const Countdowns = mongoose.models.Thread || mongoose.model("Countdowns", Countdownsschema);

export default Countdowns;
