import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  clerkId: string;
  email: string;
  name: string;
  avatar: string;
  friends: string[]; // Stores an array of other clerkId's
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: false },
  friends: [{ type: String }],
});

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;