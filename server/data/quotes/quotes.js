// data/quotes.js
import fs from "fs";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ absolute path to your quotes.jsonl file
const filePath = path.join(__dirname, "quotes.jsonl");

export async function loadQuotes() {
  const quotes = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath), // ✅ now always correct
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    quotes.push(JSON.parse(line));
  }

  return quotes;
}