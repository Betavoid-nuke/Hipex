import mongoose from "mongoose";

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
  friendsid: [
    {
      type: String, // Array of Clerk userIds
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  twinxprojects:[
    {
      type: String, //array of projectIDs on mongo
      unique: false,
    }
  ],
  twinxfavprojects:[
    {
      type: String, //array of projectIDs on mongo
      unique: false,
    }
  ]
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
