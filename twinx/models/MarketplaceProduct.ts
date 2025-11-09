import mongoose, { Schema, model, models } from "mongoose";

const MarketplaceProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: [{ type: String, required: true }],
    category: { type: String, required: true },
    creator: { type: String, required: true },
    downloads: { type: Number, default: 0 },
    downloadUrls: [
      {
        format: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    comments: [
      {
        content: { type: String, required: true },
        owner: { type: String, required: true }, // userId or username
        date: { type: Date, default: Date.now },
        likes: { type: Number, default: 0 },
        LikedBy: [{ type: String, required: true }]
      },
    ],
  },
  { timestamps: true }
);

export default models.MarketplaceProduct ||
  model("MarketplaceProduct", MarketplaceProductSchema);
