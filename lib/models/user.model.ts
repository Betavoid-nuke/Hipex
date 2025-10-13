import mongoose, { Schema } from "mongoose";
import { unique } from "next/dist/build/utils";


interface SocialHandle {
  platform: string;
  url: string;
}

const SocialHandleSchema = new Schema<SocialHandle>({
  platform: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
});

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  Countdowns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Countdowns",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  friendsId: {
    type: [String],
    default: [],
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  twinxprojects:[
    {
      type: String,
      unique: false,
    }
  ],
  twinxfavprojects:[
    {
      type: String, //array of projectIDs on mongoa
      unique: false,
    }
  ],
  socialhandles: {
    type: [SocialHandleSchema],
    default: [],
  },
  tags: [
    {
      type: String,
      unique: false,
      required: false,
      default: "twinx user",
    }
  ],
  jobs: {
    type: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      }
    ],
    default: [],
  },
  country: {
    type: String,
    required: true,
    default: "Earth",
  },
  oneSentanceIntro: {
    type: String,
    required: false,
    default: "Hello, I'm new to Twinx!",
  },
  listedAssets: [
    {
      type: String,
      required: false,
    }
  ],
  listedTwins: [
    {
      type: String,
      required: false,
    }
  ]
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
