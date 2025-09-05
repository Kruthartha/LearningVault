import express from "express";
import {
  login,
  signup,
  verifyOtp,
  resendOtp,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", me);

export default router;
