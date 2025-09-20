import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js';

const router = express.Router();

// All lesson management routes are protected and require an admin/creator login
router.use(protectAdmin);

router.route('/')
  .post(createLesson)
  .get(getAllLessons);

router.route('/:lessonId')
  .get(getLessonById)
  .put(updateLesson)
  .delete(deleteLesson);

export default router;