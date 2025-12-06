import { Pool } from "pg";
import { env } from "../lib/env";

const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
});

export const pg = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};

