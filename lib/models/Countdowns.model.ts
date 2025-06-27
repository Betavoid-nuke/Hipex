import mongoose from "mongoose";
import { boolean } from "zod";

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
  PublishedName: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
  Instagramlink: {
    type: String,
    required: false,
  },
  Facebooklink: {
    type: String,
    required: false,
  },
  Youtubelink: {
    type: String,
    required: false,
  },
  LinkedInlink: {
    type: String,
    required: false,
  },
  Twitchlink: {
    type: String,
    required: false,
  },
  Twitterlink: {
    type: String,
    required: false,
  },
  PageStyle: {
    backgroundColor: {
      type: String,
      default: "#07070a"
    },
    backgroundPattern: {
      type: String,
      default: "default"
    },
    fontColor: {
      type: String,
      default: "white"
    },
    headingStyle: {
      type: String,
      default: "default"
    }
  },
  projectType: {
    type: Boolean,
    default: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  customCode: {
    type: new mongoose.Schema({
      defaultFilesList: {
        type: [String],
        required: true
      },
      defaultFilesData: {
        type: [
          {
            name: { type: String, required: true },
            language: { type: String, required: true },
            value: { type: String, required: true }
          }
        ],
        default: []
      }
    }, { _id: false }),
    required: false,
    default: undefined
  }
});

const Countdown = mongoose.models.Countdown || mongoose.model("Countdown", CountdownSchema);
export default Countdown;