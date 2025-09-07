import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.on("connect", () => console.log("Connected to PostgreSQL"));
console.log("DB_PASS:", process.env.DB_PASS, typeof process.env.DB_PASS);
pool.on("error", (err) =>
  console.error("Unexpected error on idle client", err)
);
