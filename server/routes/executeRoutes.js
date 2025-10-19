// routes/executeRoutes.js
import express from "express";
import { executeCode } from "../controllers/executeController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// POST /api/execute
router.post("/execute", authenticateJWT, executeCode);

export default router;
