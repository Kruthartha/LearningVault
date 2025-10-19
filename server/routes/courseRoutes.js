import express from "express";
import { getLearningTracks, getLearningTrackById } from "../controllers/courseController.js";

const router = express.Router();

router.get("/learning-tracks", getLearningTracks);
router.get("/learning-tracks/:id", getLearningTrackById);

export default router;