import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.APP_ENV || "dev"}` });

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "super_secret_key";

// Middleware to verify JWT token
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    console.error("JWT authentication error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};