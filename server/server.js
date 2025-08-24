import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://learningvault.in'], // allowed frontends
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));