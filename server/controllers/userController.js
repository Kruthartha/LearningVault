import { pool } from "../config/db.js";
import { sendMail } from "../utils/mail.js";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get basic user info
    const userResult = await pool.query(
      "SELECT id, first_name, last_name, email FROM users WHERE id=$1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const user = userResult.rows[0];

    // Get onboarding info joined with learning_paths
    const profileResult = await pool.query(
      `SELECT up.learning_goals, up.learner_level, up.learning_path, up.current_track,
              up.onboarding_completed, lp.track_name, lp.track_type
       FROM user_profiles up
       LEFT JOIN learning_paths lp
       ON up.learning_path = lp.id
       WHERE up.user_id=$1`,
      [userId]
    );

    const onboardingRaw =
      profileResult.rows.length > 0 ? profileResult.rows[0] : null;

    // Filter only required fields for frontend
    const onboarding = onboardingRaw
      ? {
          learning_goals: JSON.parse(onboardingRaw.learning_goals),
          learner_level: onboardingRaw.learner_level,
          learning_path: onboardingRaw.learning_path,
          current_track: onboardingRaw.current_track,
          onboarding_completed: onboardingRaw.onboarding_completed,
          track_name: onboardingRaw.track_name,
          track_type: onboardingRaw.track_type,
        }
      : null;

    res.json({
      ok: true,
      user,
      onboarding_completed: onboarding ? true : false,
      onboarding,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

export const submitOnboarding = async (req, res) => {
  const userId = req.user.id;
  const { learning_goals, learner_level, learning_path } = req.body;

  try {
    // ----------------------------
    // 1️⃣ Insert / Update user_profiles
    // ----------------------------
    await pool.query(
      `INSERT INTO user_profiles 
       (user_id, learning_goals, learner_level, learning_path, onboarding_completed, created_at, updated_at) 
       VALUES ($1,$2,$3,$4,true,NOW(),NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET 
         learning_goals = $2,
         learner_level = $3,
         learning_path = $4,
         onboarding_completed = true,
         updated_at = NOW()`,
      [userId, JSON.stringify(learning_goals), learner_level, learning_path]
    );

    // ----------------------------
    // 2️⃣ Insert into user_learning_paths if not exists
    // ----------------------------
    await pool.query(
      `INSERT INTO user_learning_paths 
       (user_id, learning_path_id, current_course_id, created_at, updated_at)
       VALUES ($1, $2, NULL, NOW(), NOW())
       ON CONFLICT (user_id, learning_path_id) DO NOTHING`,
      [userId, learning_path]
    );

    // ----------------------------
    // 3️⃣ Unlock the first course for this user
    // ----------------------------
    const { rows: firstCourse } = await pool.query(
      `SELECT c.id
       FROM learning_path_courses lpc
       JOIN courses c ON lpc.course_id = c.id
       WHERE lpc.learning_path_id = $1
       ORDER BY lpc.position ASC
       LIMIT 1`,
      [learning_path]
    );

    if (firstCourse.length > 0) {
      const courseId = firstCourse[0].id;

      // Insert into user_courses if not exists
      await pool.query(
        `INSERT INTO user_courses (user_id, course_id, status, created_at, updated_at)
         VALUES ($1, $2, 'unlocked', NOW(), NOW())
         ON CONFLICT (user_id, course_id) DO UPDATE
         SET status = 'unlocked', updated_at = NOW()`,
        [userId, courseId]
      );

      // Update current_course_id in user_learning_paths
      await pool.query(
        `UPDATE user_learning_paths
         SET current_course_id = $1, updated_at = NOW()
         WHERE user_id = $2 AND learning_path_id = $3`,
        [courseId, userId, learning_path]
      );
    }

    // ----------------------------
    // 4️⃣ Send welcome email
    // ----------------------------
    const { rows: userRows } = await pool.query(
      "SELECT email, first_name FROM users WHERE id=$1",
      [userId]
    );
    const user = userRows[0];

    const htmlTemplate = `<p>Welcome ${user.first_name}! You have successfully completed onboarding and selected your learning track: ${learning_path}.</p>`;
    await sendMail(user.email, "Welcome to LearningVault!", htmlTemplate);

    res.json({
      message: "Onboarding completed, first course unlocked, and email sent.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/user/contributions
export const getUserContributions = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT activity_date, COUNT(*) AS contributions
       FROM user_activity_log
       WHERE user_id = $1
       GROUP BY activity_date
       ORDER BY activity_date ASC`,
      [userId]
    );

    res.json({
      ok: true,
      data: rows.map((r) => ({
        date: r.activity_date,
        count: parseInt(r.contributions, 10),
      })),
    });
  } catch (err) {
    console.error("Error fetching contributions:", err);
    res
      .status(500)
      .json({ ok: false, message: "Failed to fetch contributions" });
  }
};

// GET /api/user/streak
export const getUserStreak = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT activity_date
       FROM user_activity_log
       WHERE user_id = $1
       ORDER BY activity_date ASC`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ ok: true, current_streak: 0, longest_streak: 0 });
    }

    // Extract and normalize dates
    const dates = rows.map((r) => new Date(r.activity_date));

    let current = 1;
    let longest = 1;

    for (let i = 1; i < dates.length; i++) {
      const prev = dates[i - 1];
      const curr = dates[i];
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        current++;
        longest = Math.max(longest, current);
      } else if (diffDays > 1) {
        current = 1;
      }
    }

    // If user missed yesterday, streak resets
    const lastActivity = dates[dates.length - 1];
    const today = new Date();
    const diffFromToday = Math.floor(
      (today - lastActivity) / (1000 * 60 * 60 * 24)
    );

    if (diffFromToday > 1) {
      current = 0;
    }

    res.json({
      ok: true,
      current_streak: current,
      longest_streak: longest,
    });
  } catch (err) {
    console.error("Error calculating streak:", err);
    res.status(500).json({ ok: false, message: "Failed to calculate streak" });
  }
};
