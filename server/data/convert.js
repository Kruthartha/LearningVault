import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read old JSON
const oldBlocksPath = path.join(__dirname, "lessonBlocks.json");
const oldBlocks = JSON.parse(fs.readFileSync(oldBlocksPath, "utf-8"));

// Transform
const newBlocks = oldBlocks.map(
  ({ lesson_id, step_position, block_position, type, ...rest }) => ({
    lesson_id,
    step_position,
    block_position,
    type,
    data: rest,
  })
);

// Write new JSON
const newBlocksPath = path.join(__dirname, "lessonBlocksNew.json");
fs.writeFileSync(newBlocksPath, JSON.stringify(newBlocks, null, 2));

console.log("Transformed lessonBlocksNew.json created!");
