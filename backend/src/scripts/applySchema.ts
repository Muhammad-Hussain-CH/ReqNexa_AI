import "dotenv/config";
import path from "path";
import fs from "fs";
import { Client } from "pg";
import { env } from "../lib/env";
import { fileURLToPath } from "url";

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const schemaPath = path.resolve(__dirname, "../database/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  const client = env.DATABASE_URL
    ? new Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    : new Client({
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
      });

  console.log(`Applying schema from: ${schemaPath}`);
  try {
    await client.connect();
    await client.query(sql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Failed to apply schema:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
