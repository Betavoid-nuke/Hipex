import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IVenue extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  lat: number;
  lon: number;
}

const VenueSchema: Schema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

const Venue: Model<IVenue> = models.Venue || mongoose.model<IVenue>('Venue', VenueSchema);

export default Venue;