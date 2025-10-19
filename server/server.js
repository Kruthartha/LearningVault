import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // new
import courseRoutes from "./routes/courseRoutes.js"
import userProgressRoutes from "./routes/userProgressRoutes.js"
import executeRoutes from "./routes/executeRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";


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
app.use("/api/course", courseRoutes);
app.use("/api/user", userProgressRoutes);
app.use("/api/runtime", executeRoutes);
app.use("/api/problems", problemRoutes);
            
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
