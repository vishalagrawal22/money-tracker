import { connect as mongooseConnect, set as mongooseSet } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = globalThis.mongooseCache;

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongooseConnect(process.env.MONGODB_URI || "").then(
      (mongoose) => {
        return mongoose;
      }
    );
    mongooseSet("strictQuery", false);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
