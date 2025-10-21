import express from "express";
import {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/userTasksController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected with JWT


// Get all tasks for logged-in user
router.get("/", authenticateJWT, getUserTasks);

// Get a single task by id
router.get("/task/:id", authenticateJWT, getTaskById);

// Create a new task
router.post("/", authenticateJWT, createTask);

// Update a task
router.put("/:id", authenticateJWT, updateTask);

// Delete a task
router.delete("/:id", authenticateJWT, deleteTask);

export default router;
