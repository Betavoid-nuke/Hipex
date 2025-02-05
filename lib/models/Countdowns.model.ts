import mongoose from "mongoose";

const CountdownSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  CDname: {
    type: String,
    required: true,
  },
  CDDescription: {
    type: String,
    required: true,
  },
  CDlink: {
    type: String,
    required: true,
  },
  Instagram: {
    type: Boolean,
    default: false,
  },
  Facebook: {
    type: Boolean,
    default: false,
  },
  Youtube: {
    type: Boolean,
    default: false,
  },
  LinkedIn: {
    type: Boolean,
    default: false,
  },
  Twitch: {
    type: Boolean,
    default: false,
  },
  Twitter: {
    type: Boolean,
    default: false,
  },
  userid: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  CDID: {
    type: String,
    required: false,
  },
});

const Countdown = mongoose.models.Countdown || mongoose.model("Countdown", CountdownSchema);
export default Countdown;