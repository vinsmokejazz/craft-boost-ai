import mongoose from "mongoose";

/**
 * Singleton MongoDB connection for Next.js serverless environments.
 *
 * In dev, Next.js hot-reloads re-execute module scope — so we cache
 * the connection on the global object to prevent opening duplicates.
 * In production each cold-start reuses the in-process cache.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
  var __mongooseCache: MongooseCache | undefined;
}
/* eslint-enable no-var */

globalThis.__mongooseCache ??= {
  conn: null,
  promise: null,
};
const cached: MongooseCache = globalThis.__mongooseCache;

/**
 * Returns a cached Mongoose connection.
 * Safe to call from Server Actions, Route Handlers, and server components.
 */
export async function connectDB() {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  cached.promise ??= mongoose
    .connect(MONGODB_URI, { bufferCommands: false })
    .then((m) => {
      console.log("\u2705 MongoDB connected");
      return m;
    });

  cached.conn = await cached.promise;
  return cached.conn;
}
