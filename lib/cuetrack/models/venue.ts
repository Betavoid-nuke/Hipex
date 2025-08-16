import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Interface describing the properties of a Venue document
export interface IVenue extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  lat: number;
  lon: number;
}

// Mongoose Schema for the Venue model
const VenueSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Venue name is required.'],
    trim: true 
  },
  rating: { 
    type: Number, 
    required: [true, 'Venue rating is required.'],
    min: 0,
    max: 5
  },
  lat: { 
    type: Number, 
    required: [true, 'Latitude is required.'] 
  },
  lon: { 
    type: Number, 
    required: [true, 'Longitude is required.'] 
  },
});

// Prevent model recompilation in Next.js hot-reloading environments
const Venue: Model<IVenue> = models.Venue || mongoose.model<IVenue>('Venue', VenueSchema);

export default Venue;