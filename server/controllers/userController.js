import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, termsAccepted, subscribeUpdates } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !termsAccepted) {
      return res.status(400).json({ message: 'All required fields must be filled and terms accepted.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if email already exists
    const userExist = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      `INSERT INTO users 
        (first_name, last_name, email, password, terms_accepted, subscribe_updates) 
       VALUES ($1,$2,$3,$4,$5,$6) 
       RETURNING id, first_name, last_name, email, created_at`,
      [firstName, lastName, email, hashedPassword, termsAccepted, subscribeUpdates || false]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};