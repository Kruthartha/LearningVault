import { pool } from "../config/db.js";

// Get all problems with user status
export const getAllProblems = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const { rows } = await pool.query(
      `SELECT
         p.id,
         p.slug,
         p.title,
         p.difficulty,
         p.category,
         p.acceptance,
         p.likes,
         p.dislikes,
         p.premium,
         p.tags,
         p.companies,
         ups.status AS status
       FROM problems p
       LEFT JOIN user_problem_status ups
       ON p.id = ups.problem_id AND ups.user_id = $1
       ORDER BY p.id ASC`,
      [userId]
    );

    // Map results to match your API format
    const problems = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
      acceptance:
        p.acceptance !== null && p.acceptance !== undefined
          ? Number(p.acceptance).toFixed(2)
          : null,
      frequency: Math.floor(Math.random() * 100), // Placeholder
      premium: p.premium,
      tags: p.tags,
      companies: p.companies,
      status: p.status || "Ready",
    }));

    res.json({ ok: true, problems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};

// Get single problem details
export const getProblemBySlug = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?.id || null;

  try {
    const { rows } = await pool.query(
      `SELECT p.*, ups.status
       FROM problems p
       LEFT JOIN user_problem_status ups
         ON p.id = ups.problem_id AND ups.user_id = $1
       WHERE p.slug = $2`,
      [userId, slug]
    );

    if (!rows.length)
      return res.status(404).json({ ok: false, message: "Problem not found" });

    const p = rows[0];

    const problem = {
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
      acceptance: parseFloat(p.acceptance).toFixed(2),
      likes: p.likes,
      dislikes: p.dislikes,
      premium: p.premium,
      tags: p.tags,
      companies: p.companies,
      description: p.description,
      examples: p.examples,
      constraints: p.constraints,
      follow_up: p.follow_up,
      starter_code: p.starter_code,
      test_cases: p.test_cases,
      status: p.status || "Not Started", // default fallback
      created_at: p.created_at,
      updated_at: p.updated_at,
    };

    res.json({ ok: true, problem });
  } catch (err) {
    console.error("Error fetching problem by slug:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch problem" });
  }
};

// Update user problem status
export const updateProblemStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!["not_started", "in_progress", "completed"].includes(status)) {
    return res.status(400).json({ ok: false, message: "Invalid status" });
  }

  try {
    await pool.query(
      `INSERT INTO user_problem_status (user_id, problem_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, problem_id)
       DO UPDATE SET status = EXCLUDED.status, last_attempted_at = NOW()`,
      [userId, id, status]
    );

    res.json({ ok: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ ok: false, message: "Failed to update status" });
  }
};
