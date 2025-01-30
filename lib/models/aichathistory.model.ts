import mongoose from "mongoose";

const aichatSchema = new mongoose.Schema({
  userinput: {
    type: String,
    required: true,
  },
  aireply: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

const AIchatH = mongoose.models.AIchatH || mongoose.model("AIchatH", aichatSchema);

export default AIchatH;
