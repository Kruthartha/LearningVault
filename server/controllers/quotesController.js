// controllers/quotesController.js
import { loadQuotes } from "../data/quotes/quotes.js";

// Simple in-memory cache
let cachedQuote = null;
let lastDate = null;

export const getQuoteOfTheDay = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  // Reuse today's quote if already chosen
  if (cachedQuote && lastDate === today) {
    return res.json(cachedQuote);
  }

  // Load quotes from file
  const quotes = await loadQuotes();

  // Pick a random quote
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Cache for the rest of the day
  cachedQuote = quote;
  lastDate = today;

  res.json(quote);
};