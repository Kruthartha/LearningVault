import express from "express";
import {
  getUserProfile,
  submitOnboarding,
  getUserContributions,
  getUserStreak,
  getUserDashboard,
  getUserLearnProgress,
} from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/auth.js"; // middleware to verify JWT

const router = express.Router();

router.get("/user/profile", authenticateJWT, getUserProfile);
router.post("/user/onboarding", authenticateJWT, submitOnboarding);
router.get("/user/contributions", authenticateJWT, getUserContributions);
router.get("/user/streak", authenticateJWT, getUserStreak);


router.get("/user/dashboard", authenticateJWT, getUserDashboard);
router.get("/user/learn", authenticateJWT, getUserLearnProgress);

export default router;
