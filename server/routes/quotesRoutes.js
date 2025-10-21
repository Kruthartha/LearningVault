// routes/quotesRoutes.js
import express from "express";
import { getQuoteOfTheDay } from "../controllers/quotesController.js";

const router = express.Router();

// Quote of the Day
router.get("/today", getQuoteOfTheDay);



export default router;