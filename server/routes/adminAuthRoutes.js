import express from 'express';
import {
  adminLogin,
  adminLogout,
  adminRefresh,
  adminMe,
  adminForgotPassword,
  adminResetPassword
} from '../controllers/adminAuthController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.post('/refresh', adminRefresh);
router.post('/forgot-password', adminForgotPassword);
router.post('/reset-password', adminResetPassword);

// This route is now protected by the middleware
router.get('/me', protectAdmin, adminMe);

export default router;