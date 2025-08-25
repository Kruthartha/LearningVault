import express from 'express';
import { login, refresh, logout, me } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', me); // optional: get current user via access token

export default router;