import { Pool } from "pg";
import { env } from "../lib/env";

const pgPool = env.DATABASE_URL
  ? new Pool({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
    });

pgPool.on("error", (err) => {
  console.error("PostgreSQL pool error", err);
});

export { pgPool };
