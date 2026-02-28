import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/clientPromise";
import authConfig from "./auth.config";

/**
 * Full Auth.js configuration (Node.js runtime only).
 *
 * Extends the Edge-safe base config with the MongoDB adapter.
 * This file is used by API routes and server actions — NOT by middleware.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
});
