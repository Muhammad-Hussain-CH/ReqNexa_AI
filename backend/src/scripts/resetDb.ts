import "dotenv/config";
import { Client } from "pg";
import { env } from "../lib/env";

async function execute(client: Client, sql: string) {
  await client.query(sql);
}

async function main() {
  const client = env.DATABASE_URL
    ? new Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    : new Client({
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
      });

  console.log("Resetting database schema (public)...");
  try {
    await client.connect();
    try {
      await execute(client, "DROP SCHEMA IF EXISTS public CASCADE;");
      await execute(client, "CREATE SCHEMA public;");
    } catch (e) {
      console.warn("Could not drop/recreate public schema, attempting targeted drop...");
      await execute(
        client,
        [
          "DROP TABLE IF EXISTS activity_logs CASCADE;",
          "DROP TABLE IF EXISTS project_members CASCADE;",
          "DROP TABLE IF EXISTS requirements CASCADE;",
          "DROP TABLE IF EXISTS projects CASCADE;",
          "DROP TABLE IF EXISTS users CASCADE;",
          "DROP TYPE IF EXISTS requirement_status_enum CASCADE;",
          "DROP TYPE IF EXISTS requirement_priority_enum CASCADE;",
          "DROP TYPE IF EXISTS requirement_type_enum CASCADE;",
          "DROP TYPE IF EXISTS project_status_enum CASCADE;",
          "DROP TYPE IF EXISTS project_type_enum CASCADE;",
          "DROP TYPE IF EXISTS user_role_enum CASCADE;",
        ].join("\n")
      );
    }
    await execute(client, "CREATE EXTENSION IF NOT EXISTS pgcrypto;");
    console.log("Schema reset complete.");
  } catch (err) {
    console.error("Failed to reset schema:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
