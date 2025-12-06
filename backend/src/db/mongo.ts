import { MongoClient } from "mongodb";
import { env } from "../lib/env";

const client = new MongoClient(env.MONGODB_URI);

export const mongo = {
  client,
  connect: () => client.connect(),
  db: () => client.db(),
};

