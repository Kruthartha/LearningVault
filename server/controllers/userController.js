import { pool } from "../config/db.js";
import { sendMail } from "../utils/mail.js";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1️⃣ Get basic user info from "users" table
    const userResult = await pool.query(
      "SELECT id, first_name, last_name, email FROM users WHERE id=$1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const user = userResult.rows[0];

    // 2️⃣ Get profile/onboarding info from "user_profiles" table
    const profileResult = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id=$1",
      [userId]
    );

    const onboarding = profileResult.rows.length > 0 ? profileResult.rows[0] : null;

    // 3️⃣ Send combined response
    res.json({
      ok: true,
      user,
      onboarding_completed: onboarding ? true : false,
      onboarding, // will be null if not completed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

export const submitOnboarding = async (req, res) => {
  const userId = req.user.id;
  const { learning_goals, coding_experience, learning_track } = req.body;

  try {
    await pool.query(
      `INSERT INTO user_profiles 
       (user_id, learning_goals, coding_experience, learning_track, onboarding_completed) 
       VALUES ($1,$2,$3,$4,true)
       ON CONFLICT (user_id)
       DO UPDATE SET learning_goals=$2, coding_experience=$3, learning_track=$4, onboarding_completed=true`,
      [userId, learning_goals, coding_experience, learning_track]
    );

    // Send welcome email after onboarding
    const htmlTemplate = `<p>Welcome! You have successfully completed onboarding and selected your learning track: ${learning_track}.</p>`;
    const userResult = await pool.query("SELECT email, first_name FROM users WHERE id=$1", [userId]);
    const user = userResult.rows[0];
    await sendMail(user.email, "Welcome to LearningVault!", htmlTemplate);

    res.json({ message: "Onboarding completed and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};