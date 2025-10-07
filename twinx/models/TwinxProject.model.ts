import mongoose, { Schema, Document } from "mongoose";

// 👇 TypeScript interface
export interface IProject extends Document {
  title: string;
  twinxid: string;
  thumbnail: string;
  videoUrl: string;
  isFavorite: boolean;
  isPublished: boolean;
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
  ownerID: string,
  published: boolean
}

// 👇 Define Mongoose schema
const TwinxProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    twinxid: {
      type: String,
      required: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    ownerID: {
      type: String,
      required: true,
      index: true,
    },
    published: {
      type: Boolean,
      required: false
    }
  },
  {
    timestamps: true, // ✅ Automatically manages createdAt & updatedAt
  }
);

// 👇 Export model (handles hot reload in Next.js)
const TwinxProject =
  mongoose.models.TwinxProject ||
  mongoose.model<IProject>("TwinxProject", TwinxProjectSchema);

export default TwinxProject;
