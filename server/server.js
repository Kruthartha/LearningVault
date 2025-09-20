import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // new
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';

dotenv.config({ path: ".env" });
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

console.log("DB Config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  name: process.env.DB_NAME,
});

// Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://learningvault.in",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // ✅ tell cors to accept it
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.use("/api/", userRoutes);
app.use("/api/auth", authRoutes); // /login, /refresh, /logout
app.use('/api/auth/studio', adminAuthRoutes);
app.use('/api/studio/lessons', lessonRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
