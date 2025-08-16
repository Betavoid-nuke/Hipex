// lib/dbConnect.ts
import mongoose, {
  type Connection,
  type ConnectOptions,
  type Mongoose,
} from "mongoose";

// Augment globalThis so we can cache the connection (works with HMR/serverless)
declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn:
    | { conn: Connection | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URL as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Reuse the cached object across reloads/functions
const cached =
  globalThis.__mongooseConn ??
  (globalThis.__mongooseConn = { conn: null, promise: null });

export default async function dbConnect(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
      // optionally tune pool size etc:
      // maxPoolSize: 10,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  cached.conn = (await cached.promise).connection;
  return cached.conn;
}
