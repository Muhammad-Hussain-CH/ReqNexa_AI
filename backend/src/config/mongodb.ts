import { MongoClient, Db, Collection, Document } from "mongodb";
import { env } from "../lib/env";

const mongoClient = new MongoClient(env.MONGODB_URI);

async function connectWithRetry(maxRetries = 5, baseDelayMs = 1000): Promise<Db> {
  let attempt = 0;
  while (true) {
    try {
      await mongoClient.connect();
      return mongoClient.db();
    } catch (err) {
      attempt += 1;
      if (attempt > maxRetries) throw err;
      const delay = baseDelayMs * attempt;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

function getCollection<T extends Document>(db: Db, name: string): Collection<T> {
  return db.collection<T>(name);
}

export { mongoClient, connectWithRetry, getCollection };
