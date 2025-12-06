import "dotenv/config";
import { createApp } from "./app";
import { env } from "./lib/env";
import { pgPool } from "./config/database";
import { mongoClient, connectWithRetry } from "./config/mongodb";

async function start() {
  try {
    const db = await connectWithRetry();
    console.log("Connected to MongoDB:", db.databaseName);
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }

  try {
    await pgPool.query("SELECT 1");
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("PostgreSQL connection failed", err);
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`ReqNexa API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    server.close(async () => {
      try {
        await pgPool.end();
        await mongoClient.close();
        console.log("Connections closed. Bye.");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
