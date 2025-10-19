import express from "express";
import {
  getAllProblems,
  getProblemBySlug,
  updateProblemStatus,
} from "../controllers/problemController.js";
import { authenticateJWT } from "../middleware/auth.js"; // JWT auth

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Fetch all problems
router.get("/", getAllProblems);

// Fetch single problem details
router.get("/:slug", getProblemBySlug);

// Update user problem status
router.post("/:id/status", updateProblemStatus);

export default router;