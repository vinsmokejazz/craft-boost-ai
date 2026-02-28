import { MongoClient } from "mongodb";

/**
 * Singleton MongoClient promise for the Auth.js MongoDB adapter.
 *
 * Mongoose and the native MongoClient serve different purposes:
 * - Mongoose → ODM for our application models (ProductPost, etc.)
 * - MongoClient → required by @auth/mongodb-adapter for session/account storage.
 *
 * In development we cache on `globalThis` to survive hot-reloads.
 * The connection is created lazily so the module can be imported at
 * build time without `MONGODB_URI` being present.
 */

/* eslint-disable no-var */
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
/* eslint-enable no-var */

const options = {};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  if (process.env.NODE_ENV === "development") {
    globalThis._mongoClientPromise ??= new MongoClient(uri, options).connect();
    return globalThis._mongoClientPromise;
  }

  return new MongoClient(uri, options).connect();
}

/**
 * Lazy-initialised client promise.
 * Uses a Proxy so the adapter receives a thenable without
 * eagerly resolving during Next.js build / static analysis.
 */
const clientPromise: Promise<MongoClient> = new Proxy(
  {} as Promise<MongoClient>,
  {
    get(_target, prop, receiver) {
      const real = getClientPromise();
      return Reflect.get(real, prop, receiver);
    },
  },
);

export default clientPromise;
