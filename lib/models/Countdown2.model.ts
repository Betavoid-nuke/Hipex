import mongoose from "mongoose";

const Countdown2Schema = new mongoose.Schema({
  "time": {
    "required": true
  },
  "CDname": {
    "required": true
  },
  "CDDescription": {
    "required": true
  },
  "CDlink": {
    "required": true
  },
  "Instagram": {
    "required": false
  },
  "Facebook": {
    "required": false
  },
  "Youtube": {
    "required": false
  },
  "LinkedIn": {
    "required": false
  },
  "Twitch": {
    "required": false
  },
  "Twitter": {
    "required": false
  },
  "CDID": {
    "required": false
  },
  "userid": {
    "required": true
  }
});

const Countdown2 = mongoose.models.Countdown2 || mongoose.model("Countdown2", Countdown2Schema);
export default Countdown2;
