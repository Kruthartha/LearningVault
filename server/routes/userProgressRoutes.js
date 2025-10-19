import express from "express";
import {
  getUserProgress,
  getLearningPathProgress,
  getCourseProgress,
  getLessonById,
  completeLesson,
} from "../controllers/userProgressController.js";

import { authenticateJWT } from "../middleware/auth.js"; // middleware to verify JWT

const router = express.Router();

// -------------------------
// GET ROUTES
// -------------------------
router.get("/progress", authenticateJWT, getUserProgress);

// GET progress for a specific learning path
router.get(
  "/progress/:learningPathId",
  authenticateJWT,
  getLearningPathProgress
);

// GET progress for a specific course
router.get(
  "/progress/:learningPathId/:courseId",
  authenticateJWT,
  getCourseProgress
);

// GET lesson details
router.get(
  "/progress/:learningPathId/:courseId/:lessonId",
  authenticateJWT,
  getLessonById
);

// -------------------------
// POST ROUTE
// -------------------------
// Mark a lesson as completed
router.post(
  "/progress/:learningPathId/:courseId/:lessonId/complete",
  authenticateJWT,
  completeLesson
);



export default router;
