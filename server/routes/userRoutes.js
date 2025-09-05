import express from "express";
import { getUserProfile, submitOnboarding } from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/auth.js"; // middleware to verify JWT

const router = express.Router();

router.get("/user/profile", authenticateJWT, getUserProfile);
router.post("/user/onboarding", authenticateJWT, submitOnboarding);

export default router;