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
  published: boolean;
  ThumbnailUrl: string;
  toatlSteps: number;
  pipelineConfig: {
    id: number;
    name: string;
    description: string;
    icon: string;
  }[];
  pipelineFinished: boolean;
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
    ThumbnailUrl: {
      type: String,
      default: "",
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    ownerID: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    published: {
      type: Boolean,
      required: false
    },
    toatlSteps: {
      type: Number,
      required: false,
      default: 0
    },
    pipelineConfig: {
      type: [
        {
          id: Number,
          name: String,
          description: String,
          icon: String,
        },
      ],
      default: [
        { id: 1, name: 'Upload', description: 'Video is being uploaded to secure servers.', icon: 'UploadCloud' },
        { id: 2, name: 'Transcoding', description: 'Adjusting video format for compatibility.', icon: 'Settings' },
        { id: 3, name: 'Quality Analysis', description: 'Assessing video resolution and bitrate.', icon: 'Check' },
        { id: 4, name: 'Scene Detection', description: 'Identifying distinct scenes in the video.', icon: 'FileText' },
        { id: 5, name: 'Object Recognition', description: 'Detecting objects within each frame.', icon: 'Search' },
        { id: 6, name: 'Metadata Extraction', description: 'Gathering technical details from the file.', icon: 'Briefcase' },
        { id: 7, name: 'Audio Transcription', description: 'Converting spoken words to text.', icon: 'User' },
        { id: 8, name: 'Geometry Mapping', description: 'Creating a 3D representation of the scene.', icon: 'MoreVertical' },
        { id: 9, name: 'Texture Baking', description: 'Applying textures to the 3D model.', icon: 'Star' },
        { id: 10, name: 'Lighting Simulation', description: 'Simulating realistic lighting conditions.', icon: 'Eye' },
        { id: 11, name: 'Physics Caching', description: 'Pre-calculating physics interactions.', icon: 'Trash2' },
        { id: 12, name: 'Final Assembly', description: 'Compiling all data into the final twin.', icon: 'Check' },
      ],
    },
    pipelineFinished: {
      type: Boolean,
      default: false,
    }
  }
)

// 👇 Export model (handles hot reload in Next.js)
const TwinxProject =
  mongoose.models.TwinxProject ||
  mongoose.model<IProject>("TwinxProject", TwinxProjectSchema);

export default TwinxProject;
