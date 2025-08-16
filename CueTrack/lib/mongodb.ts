import mongoose from "mongoose";

// Read the MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure the connection string exists
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * We use a cached connection so that if `dbConnect()` is called multiple times,
 * it reuses the same database connection instead of creating a new one each time.
 *
 * This is especially important in Next.js API routes, which can be re-invoked
 * many times in development or in serverless environments like Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Connection> {
  // If connection already exists, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise yet, create one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // disables mongoose buffering commands before connection
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((m) => m);
  }

  try {
    cached.conn = (await cached.promise).connection;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
