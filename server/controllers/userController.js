import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from '../utils/mail.js';

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, termsAccepted, subscribeUpdates } = req.body;

  try {
    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword || !termsAccepted)
      return res.status(400).json({ message: 'All required fields must be filled and terms accepted.' });
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    const userExist = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userExist.rows.length > 0)
      return res.status(400).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO users 
      (first_name,last_name,email,password,terms_accepted,subscribe_updates,otp,otp_expires) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [firstName, lastName, email, hashedPassword, termsAccepted, subscribeUpdates || false, otp, otpExpires]
    );

    // Send OTP email
    await sendMail(email, 'Your OTP for LearningVault', 
      `<p>Hello ${firstName},</p>
       <p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`);

    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await pool.query('SELECT otp, otp_expires, is_verified FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'User not found.' });

    const user = result.rows[0];
    if (user.is_verified) return res.status(400).json({ message: 'User already verified.' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (new Date() > user.otp_expires) return res.status(400).json({ message: 'OTP expired.' });

    await pool.query('UPDATE users SET is_verified=true, otp=NULL, otp_expires=NULL WHERE email=$1', [email]);
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};