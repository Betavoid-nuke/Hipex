// global.d.ts
import mongoose from "mongoose";

declare global {
  // allow global `mongoose` object
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}
