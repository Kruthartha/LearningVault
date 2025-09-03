import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.APP_ENV || "dev"}` });

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.on("connect", () => console.log("Connected to PostgreSQL"));
pool.on("error", (err) =>
  console.error("Unexpected error on idle client", err)
);
