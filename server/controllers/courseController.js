import { pool } from "../config/db.js";

// GET all tracks
export const getLearningTracks = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM learning_paths");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learning tracks" });
  }
};

// GET single track by ID
export const getLearningTrackById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM learning_paths WHERE id = $1",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Track not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learning track" });
  }
};
