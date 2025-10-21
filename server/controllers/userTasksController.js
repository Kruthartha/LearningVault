import { pool } from "../config/db.js";
import { format } from "date-fns";

// ----------------------------
// Get all tasks for logged-in user
// ----------------------------
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    const { rows } = await pool.query(
      "SELECT * FROM user_tasks WHERE user_id = $1 ORDER BY date ASC",
      [userId]
    );

    // Group tasks by date
    const tasksByDate = {};
    rows.forEach((task) => {
      const dateKey = format(new Date(task.date), "yyyy-MM-dd");
      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
      tasksByDate[dateKey].push({
        id: task.id,
        title: task.title,
        course: task.course,
        date: task.date,
        priority: task.priority,
        time: task.time,
        status: task.status,
      });
    });

    res.json({ tasks: rows, tasksByDate });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ----------------------------
// Create a new task for logged-in user
// ----------------------------
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, course, date, priority, time, status } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO user_tasks (user_id, title, course, date, priority, time, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        userId,
        title,
        course,
        date,
        priority || "medium",
        time,
        status || "pending",
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// ----------------------------
// Update a task (only if it belongs to logged-in user)
// ----------------------------
export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, course, date, priority, time, status } = req.body;

    const { rows } = await pool.query(
      `UPDATE user_tasks
       SET title=$1, course=$2, date=$3, priority=$4, time=$5, status=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
      [title, course, date, priority, time, status, id, userId]
    );

    if (!rows.length) return res.status(404).json({ error: "Task not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ----------------------------
// Delete a task (only if it belongs to logged-in user)
// ----------------------------
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { rowCount } = await pool.query(
      "DELETE FROM user_tasks WHERE id=$1 AND user_id=$2",
      [id, userId]
    );

    if (!rowCount) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// ----------------------------
// Get single task by ID (only if it belongs to logged-in user)
// ----------------------------
export const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { rows } = await pool.query(
      "SELECT * FROM user_tasks WHERE id=$1 AND user_id=$2",
      [id, userId]
    );

    if (!rows.length) return res.status(404).json({ error: "Task not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};
