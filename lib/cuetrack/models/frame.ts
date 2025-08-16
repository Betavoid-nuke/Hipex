import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IFramePlayer extends Document {
  id: string;
  name: string;
  score: number;
}

export interface ILogEntry extends Document {
  turn: number;
  playerId: string;
  points: number;
}

export interface IFrame extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  location: string;
  tag: string;
  creatorId: string;
  status: 'pending' | 'live' | 'completed';
  startTime: string | null;
  endTime: string | null;
  players: IFramePlayer[];
  winnerId: string | null;
  turnIndex: number;
  log: ILogEntry[];
}

const FramePlayerSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
});

const LogEntrySchema: Schema = new Schema({
  turn: { type: Number, required: true },
  playerId: { type: String, required: true },
  points: { type: Number, required: true },
});

const FrameSchema: Schema = new Schema({
  date: { type: Date, default: Date.now },
  location: { type: String, required: true },
  tag: { type: String, required: true },
  creatorId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'live', 'completed'], default: 'pending' },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  players: [FramePlayerSchema],
  winnerId: { type: String, default: null },
  turnIndex: { type: Number, default: 0 },
  log: [LogEntrySchema],
});

const Frame: Model<IFrame> = models.Frame || mongoose.model<IFrame>('Frame', FrameSchema);

export default Frame;