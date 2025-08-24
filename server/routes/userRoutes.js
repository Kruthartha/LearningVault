import express from "express";
import { signup, verifyOtp, resendOtp } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
