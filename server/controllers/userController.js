import { pool } from "../config/db.js";
import { sendMail } from "../utils/mail.js";
import dayjs from "dayjs";
import format from "date-fns/format";

import { loadQuotes } from "../data/quotes/quotes.js";

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
    // Fetch all activity counts grouped by day
    const { rows } = await pool.query(
      `SELECT activity_date, SUM(activity_count) AS contributions
       FROM user_activity_log
       WHERE user_id = $1
       GROUP BY activity_date
       ORDER BY activity_date ASC`,
      [userId]
    );

    // Map DB rows for quick lookup
    const activityMap = new Map(
      rows.map((r) => [
        dayjs(r.activity_date).format("YYYY-MM-DD"),
        parseInt(r.contributions, 10),
      ])
    );

    const today = dayjs();
    const days = Array.from({ length: 365 }, (_, i) =>
      today.subtract(364 - i, "day")
    );

    const activity = days.map((d) => ({
      date: d.format("YYYY-MM-DD"),
      count: activityMap.get(d.format("YYYY-MM-DD")) || 0,
    }));

    // Streak calculations
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    for (const day of activity) {
      if (day.count > 0) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Current streak counting backwards from today
    for (let i = activity.length - 1; i >= 0; i--) {
      if (activity[i].count > 0) currentStreak++;
      else break;
    }

    res.json({
      ok: true,
      activity,
      totalContributions: activity.reduce((sum, a) => sum + a.count, 0),
      currentStreak,
      longestStreak,
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
    // Fetch all activity dates for this user
    const { rows } = await pool.query(
      `SELECT activity_date
       FROM user_activity_log
       WHERE user_id = $1
       ORDER BY activity_date ASC`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({
        ok: true,
        current_streak: 0,
        longest_streak: 0,
        week_streak_activity: {
          Monday: "No",
          Tuesday: "No",
          Wednesday: "No",
          Thursday: "No",
          Friday: "No",
          Saturday: "No",
          Sunday: "No",
        },
      });
    }

    // Convert to Date objects
    const dates = rows.map((r) => new Date(r.activity_date));

    // ---- Calculate current & longest streak ----
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

    // Reset if missed yesterday
    const lastActivity = dates[dates.length - 1];
    const today = new Date();
    const diffFromToday = Math.floor(
      (today - lastActivity) / (1000 * 60 * 60 * 24)
    );
    if (diffFromToday > 1) current = 0;

    // ---- Build week activity ----
    const week_streak_activity = {
      Monday: "No",
      Tuesday: "No",
      Wednesday: "No",
      Thursday: "No",
      Friday: "No",
      Saturday: "No",
      Sunday: "No",
    };

    // Get start of this week (Monday)
    const todayIndex = today.getDay(); // Sunday = 0
    const diffToMonday = todayIndex === 0 ? 6 : todayIndex - 1;
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - diffToMonday);
    mondayThisWeek.setHours(0, 0, 0, 0);

    // Filter activities for this week only
    const thisWeekActivities = dates.filter(
      (d) => d >= mondayThisWeek && d <= today
    );

    // Mark active days
    thisWeekActivities.forEach((d) => {
      const dayName = d.toLocaleString("en-US", { weekday: "long" });
      if (week_streak_activity[dayName] !== undefined) {
        week_streak_activity[dayName] = "Yes";
      }
    });

    // ---- Final Response ----
    res.json({
      ok: true,
      current_streak: current,
      longest_streak: longest,
      week_streak_activity,
    });
  } catch (err) {
    console.error("Error calculating streak:", err);
    res.status(500).json({ ok: false, message: "Failed to calculate streak" });
  }
};

// export const getUserDashboard = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     // --- 1️⃣ Get Focus (current lesson, course, and path) ---
//     const focusQuery = `
//       SELECT
//         ul.current_lesson_id AS lesson_id,
//         l.title AS lesson_title,
//         cm.course_id AS course_id,
//         c.title AS course_title,
//         c.slug AS course_slug,
//         m.id AS module_id,
//         p.id AS path_id,
//         p.title AS path_title,
//         p.track_name AS path_slug
//       FROM user_modules ul
//       JOIN modules m ON ul.module_id = m.id
//       JOIN course_modules cm ON m.id = cm.module_id
//       JOIN courses c ON cm.course_id = c.id
//       JOIN lessons l ON ul.current_lesson_id = l.id
//       JOIN learning_path_courses lpc ON c.id = lpc.course_id
//       JOIN learning_paths p ON lpc.learning_path_id = p.id
//       WHERE ul.user_id = $1 AND ul.status != 'completed'
//       ORDER BY ul.updated_at ASC
//       LIMIT 1
//     `;
//     const focusResult = await pool.query(focusQuery, [userId]);
//     const focusData = focusResult.rows[0] || null;

//     // --- 2️⃣ Learning Activity (all contributions) ---
//     const activityResult = await pool.query(
//       `SELECT activity_date, SUM(activity_count) AS contributions
//        FROM user_activity_log
//        WHERE user_id = $1
//        GROUP BY activity_date
//        ORDER BY activity_date ASC`,
//       [userId]
//     );

//     // Map for quick lookup by day
//     const activityMap = new Map(
//       activityResult.rows.map((r) => [
//         dayjs(r.activity_date).format("YYYY-MM-DD"),
//         parseInt(r.contributions, 10),
//       ])
//     );

//     const today = dayjs();
//     const days = Array.from({ length: 365 }, (_, i) =>
//       today.subtract(364 - i, "day")
//     );

//     const activityData = days.map((d) => ({
//       date: d.format("YYYY-MM-DD"),
//       count: activityMap.get(d.format("YYYY-MM-DD")) || 0,
//     }));

//     // --- 3️⃣ Calculate streaks ---
//     let longestStreak = 0;
//     let tempStreak = 0;
//     for (const day of activityData) {
//       if (day.count > 0) tempStreak++;
//       else {
//         longestStreak = Math.max(longestStreak, tempStreak);
//         tempStreak = 0;
//       }
//     }
//     longestStreak = Math.max(longestStreak, tempStreak);

//     let currentStreak = 0;
//     for (let i = activityData.length - 1; i >= 0; i--) {
//       if (activityData[i].count > 0) currentStreak++;
//       else break;
//     }

//     // --- 4️⃣ Skills Unlocked (completed courses) ---
//     const skillsResult = await pool.query(
//       `SELECT COUNT(*) AS skills_unlocked
//        FROM user_courses
//        WHERE user_id = $1 AND status = 'completed'`,
//       [userId]
//     );
//     const skillsUnlocked = parseInt(
//       skillsResult.rows[0]?.skills_unlocked || 0,
//       10
//     );

//     // --- 5️⃣ XP Level ---
//     const xpResult = await pool.query(
//       `SELECT COALESCE(SUM(activity_count), 0) AS xp
//        FROM user_activity_log
//        WHERE user_id = $1`,
//       [userId]
//     );
//     const xpLevel = Math.floor((xpResult.rows[0]?.xp || 0) / 100);

//     // --- 6️⃣ This Week Hours Spent ---
//     const weekResult = await pool.query(
//       `SELECT COALESCE(SUM(time_spent), 0) AS minutes
//        FROM user_lessons
//        WHERE user_id = $1 AND updated_at >= NOW() - INTERVAL '7 days'`,
//       [userId]
//     );
//     const thisWeekHours = (weekResult.rows[0]?.minutes || 0) / 60;

//     // --- 7️⃣ Prepare Focus Link ---
// const focusLink = focusData
//   ? `/dashboard/learn/paths/${focusData.path_id}/courses/${focusData.course_slug}`
//   : null;

//     // --- 8️⃣ Final Response ---
//     const response = {
//       ok: true,
//       data: {
//         focus: {
//           title: focusData ? `Start '${focusData.course_title}'` : null,
//           link: focusLink,
//           cta: focusData ? "Start Learning" : null,
//         },
//         streak: currentStreak,
//         skillsUnlocked,
//         level: xpLevel,
//         thisWeekHours,
//         learningActivity: {
//           total: activityData.reduce((sum, d) => sum + d.count, 0),
//           longestStreak,
//           currentStreak,
//           activityData,
//         },
//       },
//     };

//     res.json(response);
//   } catch (err) {
//     console.error("Error fetching dashboard:", err);
//     res.status(500).json({ ok: false, message: "Failed to fetch dashboard" });
//   }
// };

// export const getUserDashboard = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     // --- 1️⃣ Focus (current lesson, course, path) ---
//     const focusQuery = `
//       SELECT
//         ul.current_lesson_id AS lesson_id,
//         l.title AS lesson_title,
//         cm.course_id AS course_id,
//         c.title AS course_title,
//         c.slug AS course_slug,
//         m.id AS module_id,
//         p.id AS path_id,
//         p.title AS path_title,
//         p.track_name AS path_slug
//       FROM user_modules ul
//       JOIN modules m ON ul.module_id = m.id
//       JOIN course_modules cm ON m.id = cm.module_id
//       JOIN courses c ON cm.course_id = c.id
//       JOIN lessons l ON ul.current_lesson_id = l.id
//       JOIN learning_path_courses lpc ON c.id = lpc.course_id
//       JOIN learning_paths p ON lpc.learning_path_id = p.id
//       WHERE ul.user_id = $1 AND ul.status != 'completed'
//       ORDER BY ul.updated_at ASC
//       LIMIT 1
//     `;
//     const focusResult = await pool.query(focusQuery, [userId]);
//     const focusData = focusResult.rows[0] || null;

//     // --- 2️⃣ Learning Activity (all contributions) ---
//     const activityResult = await pool.query(
//       `SELECT activity_date, SUM(activity_count) AS contributions
//        FROM user_activity_log
//        WHERE user_id = $1
//        GROUP BY activity_date
//        ORDER BY activity_date ASC`,
//       [userId]
//     );

//     const activityMap = new Map(
//       activityResult.rows.map((r) => [
//         dayjs(r.activity_date).format("YYYY-MM-DD"),
//         parseInt(r.contributions, 10),
//       ])
//     );

//     const today = dayjs();
//     const days = Array.from({ length: 365 }, (_, i) =>
//       today.subtract(364 - i, "day")
//     );

//     const activityData = days.map((d) => ({
//       date: d.format("YYYY-MM-DD"),
//       count: activityMap.get(d.format("YYYY-MM-DD")) || 0,
//     }));

//     // --- 3️⃣ Streaks ---
//     let longestStreak = 0;
//     let tempStreak = 0;
//     for (const day of activityData) {
//       if (day.count > 0) tempStreak++;
//       else {
//         longestStreak = Math.max(longestStreak, tempStreak);
//         tempStreak = 0;
//       }
//     }
//     longestStreak = Math.max(longestStreak, tempStreak);

//     let currentStreak = 0;
//     for (let i = activityData.length - 1; i >= 0; i--) {
//       if (activityData[i].count > 0) currentStreak++;
//       else break;
//     }

//     // --- 4️⃣ Skills Unlocked ---
//     const skillsResult = await pool.query(
//       `SELECT COUNT(*) AS skills_unlocked
//        FROM user_courses
//        WHERE user_id = $1 AND status = 'completed'`,
//       [userId]
//     );
//     const skillsUnlocked = parseInt(
//       skillsResult.rows[0]?.skills_unlocked || 0,
//       10
//     );

//     // --- 5️⃣ XP Level ---
//     const xpResult = await pool.query(
//       `SELECT COALESCE(SUM(activity_count), 0) AS xp
//        FROM user_activity_log
//        WHERE user_id = $1`,
//       [userId]
//     );
//     const xpLevel = Math.floor((xpResult.rows[0]?.xp || 0) / 100);

//     // --- 6️⃣ This Week Hours ---
//     const weekResult = await pool.query(
//       `SELECT COALESCE(SUM(time_spent), 0) AS minutes
//        FROM user_lessons
//        WHERE user_id = $1 AND updated_at >= NOW() - INTERVAL '7 days'`,
//       [userId]
//     );
//     const thisWeekHours = (weekResult.rows[0]?.minutes || 0) / 60;

//     // --- 7️⃣ Tasks ---
//     const tasksResult = await pool.query(
//       `SELECT * FROM user_tasks WHERE user_id=$1 ORDER BY date ASC`,
//       [userId]
//     );

//     const tasks = tasksResult.rows;

//     const tasksByDate = {};
//     tasks.forEach((task) => {
//       const dateKey = format(new Date(task.date), "yyyy-MM-dd");
//       if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
//       tasksByDate[dateKey].push({
//         id: task.id,
//         title: task.title,
//         course: task.course,
//         date: task.date,
//         priority: task.priority,
//         time: task.time,
//         status: task.status,
//       });
//     });

//     // --- 8️⃣ Focus Link ---
//     const focusLink = focusData
//       ? `/dashboard/learn/paths/${focusData.path_id}/courses/${focusData.course_slug}`
//       : null;

//     // --- 9️⃣ Final Response ---
//     const response = {
//       ok: true,
//       data: {
//         focus: {
//           title: focusData ? `Start '${focusData.course_title}'` : null,
//           link: focusLink,
//           cta: focusData ? "Start Learning" : null,
//         },
//         streak: currentStreak,
//         skillsUnlocked,
//         level: xpLevel,
//         thisWeekHours,
//         learningActivity: {
//           total: activityData.reduce((sum, d) => sum + d.count, 0),
//           longestStreak,
//           currentStreak,
//           activityData,
//         },
//         tasks, // full tasks array
//         tasksByDate, // grouped by date for calendar view
//       },
//     };

//     res.json(response);
//   } catch (err) {
//     console.error("Error fetching dashboard:", err);
//     res.status(500).json({ ok: false, message: "Failed to fetch dashboard" });
//   }
// };


// export const getUserDashboard = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     // --- 1️⃣ Get user info ---
//     const userResult = await pool.query(
//       `SELECT first_name FROM users WHERE id = $1`,
//       [userId]
//     );
//     const firstName = userResult.rows[0]?.first_name || "Learner";

//     // --- 2️⃣ Current focus (ongoing module) ---
//     const focusQuery = `
//       SELECT 
//         ul.current_lesson_id AS lesson_id,
//         l.title AS lesson_title,
//         cm.course_id AS course_id,
//         c.title AS course_title,
//         c.slug AS course_slug,
//         m.id AS module_id,
//         p.id AS path_id,
//         p.track_name AS path_slug,
//         ul.status AS module_status
//       FROM user_modules ul
//       JOIN modules m ON ul.module_id = m.id
//       JOIN course_modules cm ON m.id = cm.module_id
//       JOIN courses c ON cm.course_id = c.id
//       JOIN lessons l ON ul.current_lesson_id = l.id
//       JOIN learning_path_courses lpc ON c.id = lpc.course_id
//       JOIN learning_paths p ON lpc.learning_path_id = p.id
//       WHERE ul.user_id = $1 AND ul.status != 'completed'
//       ORDER BY ul.updated_at ASC
//       LIMIT 1
//     `;


//     const focusResult = await pool.query(focusQuery, [userId]);
//     const focusData = focusResult.rows[0] || null;

//     // --- 3️⃣ Learning activity ---
//     const activityResult = await pool.query(
//       `SELECT activity_date, SUM(activity_count) AS contributions
//        FROM user_activity_log
//        WHERE user_id = $1
//        GROUP BY activity_date
//        ORDER BY activity_date ASC`,
//       [userId]
//     );

//     const activityMap = new Map(
//       activityResult.rows.map((r) => [
//         dayjs(r.activity_date).format("YYYY-MM-DD"),
//         parseInt(r.contributions, 10),
//       ])
//     );

//     const today = dayjs();
//     const days = Array.from({ length: 365 }, (_, i) =>
//       today.subtract(364 - i, "day")
//     );

//     const activityData = days.map((d) => ({
//       date: d.format("YYYY-MM-DD"),
//       count: activityMap.get(d.format("YYYY-MM-DD")) || 0,
//     }));

//     // --- 4️⃣ Calculate streaks ---
//     let longestStreak = 0;
//     let tempStreak = 0;
//     for (const day of activityData) {
//       if (day.count > 0) tempStreak++;
//       else {
//         longestStreak = Math.max(longestStreak, tempStreak);
//         tempStreak = 0;
//       }
//     }
//     longestStreak = Math.max(longestStreak, tempStreak);

//     let currentStreak = 0;
//     for (let i = activityData.length - 1; i >= 0; i--) {
//       if (activityData[i].count > 0) currentStreak++;
//       else break;
//     }

//     // --- 5️⃣ Skills unlocked ---
//     const skillsResult = await pool.query(
//       `SELECT COUNT(*) AS skills_unlocked
//        FROM user_courses
//        WHERE user_id = $1 AND status = 'completed'`,
//       [userId]
//     );
//     const skillsUnlocked = parseInt(skillsResult.rows[0]?.skills_unlocked || 0, 10);

//     // --- 6️⃣ XP Level ---
//     const xpResult = await pool.query(
//       `SELECT COALESCE(SUM(activity_count), 0) AS xp
//        FROM user_activity_log
//        WHERE user_id = $1`,
//       [userId]
//     );
//     const xpLevel = Math.floor((xpResult.rows[0]?.xp || 0) / 100);

//     // --- 7️⃣ Weekly hours ---
//     const weekResult = await pool.query(
//       `SELECT COALESCE(SUM(time_spent), 0) AS minutes
//        FROM user_lessons
//        WHERE user_id = $1 AND updated_at >= NOW() - INTERVAL '7 days'`,
//       [userId]
//     );
//     const thisWeekHours = (weekResult.rows[0]?.minutes || 0) / 60;

//     // --- 8️⃣ Tasks ---
//     const tasksResult = await pool.query(
//       `SELECT * FROM user_tasks WHERE user_id=$1 ORDER BY date ASC`,
//       [userId]
//     );
//     const tasks = tasksResult.rows;
//     const tasksByDate = {};
//     tasks.forEach((task) => {
//       const dateKey = format(new Date(task.date), "yyyy-MM-dd");
//       if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
//       tasksByDate[dateKey].push({
//         id: task.id,
//         title: task.title,
//         course: task.course,
//         date: task.date,
//         priority: task.priority,
//         time: task.time,
//         status: task.status,
//       });
//     });

//     // --- 9️⃣ Quote of the day ---
//     const todayKey = new Date().toISOString().split("T")[0];
//     if (!global.quoteCache) global.quoteCache = { date: null, quote: null };

//     if (global.quoteCache.date !== todayKey) {
//       const quotes = await loadQuotes();
//       const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
//       global.quoteCache = { date: todayKey, quote: randomQuote };
//     }
//     const quoteOfTheDay = global.quoteCache.quote;

//     // --- 🔟 Focus Section (dynamic) ---
//     let focusSection;
//     if (focusData) {
//       // User already started
//       focusSection = {
//         title: `Continue '${focusData.course_title}'`,
//         link: `/dashboard/learn/paths/${focusData.path_slug}/courses/${focusData.course_slug}`,
//         cta: "Continue Learning",
//       };
//     } else {
//       // Get first available course dynamically
//       const defaultResult = await pool.query(`
//         SELECT 
//           p.track_name AS path_slug,
//           c.slug AS course_slug,
//           c.title AS course_title
//         FROM learning_paths p
//         JOIN learning_path_courses lpc ON p.id = lpc.learning_path_id
//         JOIN courses c ON lpc.course_id = c.id
//         ORDER BY p.id ASC, c.id ASC
//         LIMIT 1
//       `);
//       const defaultCourse = defaultResult.rows[0];
//       focusSection = {
//         title: `Start '${defaultCourse.course_title}'`,
//         link: `/dashboard/learn/paths/${defaultCourse.path_slug}/courses/${defaultCourse.course_slug}`,
//         cta: "Start Learning",
//       };
//     }

//     // --- ✅ Final response ---
//     res.json({
//       ok: true,
//       data: {
//         firstName,
//         focus: focusSection,
//         streak: currentStreak,
//         skillsUnlocked,
//         level: xpLevel,
//         thisWeekHours,
//         learningActivity: {
//           total: activityData.reduce((sum, d) => sum + d.count, 0),
//           longestStreak,
//           currentStreak,
//           activityData,
//         },
//         tasks,
//         tasksByDate,
//         quoteOfTheDay,
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching dashboard:", err);
//     res.status(500).json({ ok: false, message: "Failed to fetch dashboard" });
//   }
// };


export const getUserDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // --- 1️⃣ Get user info ---
    const userResult = await pool.query(
      `SELECT first_name FROM users WHERE id = $1`,
      [userId]
    );
    const firstName = userResult.rows[0]?.first_name || "Learner";

    // --- 2️⃣ Focus (from first code for correct link) ---
    const focusQuery = `
      SELECT
        ul.current_lesson_id AS lesson_id,
        l.title AS lesson_title,
        cm.course_id AS course_id,
        c.title AS course_title,
        c.slug AS course_slug,
        m.id AS module_id,
        p.id AS path_id,
        p.title AS path_title,
        p.track_name AS path_slug
      FROM user_modules ul
      JOIN modules m ON ul.module_id = m.id
      JOIN course_modules cm ON m.id = cm.module_id
      JOIN courses c ON cm.course_id = c.id
      JOIN lessons l ON ul.current_lesson_id = l.id
      JOIN learning_path_courses lpc ON c.id = lpc.course_id
      JOIN learning_paths p ON lpc.learning_path_id = p.id
      WHERE ul.user_id = $1 AND ul.status != 'completed'
      ORDER BY ul.updated_at ASC
      LIMIT 1
    `;
    const focusResult = await pool.query(focusQuery, [userId]);
    const focusData = focusResult.rows[0] || null;

    // --- 3️⃣ Learning activity ---
    const activityResult = await pool.query(
      `SELECT activity_date, SUM(activity_count) AS contributions
       FROM user_activity_log
       WHERE user_id = $1
       GROUP BY activity_date
       ORDER BY activity_date ASC`,
      [userId]
    );
    const activityMap = new Map(
      activityResult.rows.map((r) => [
        dayjs(r.activity_date).format("YYYY-MM-DD"),
        parseInt(r.contributions, 10),
      ])
    );
    const today = dayjs();
    const days = Array.from({ length: 365 }, (_, i) =>
      today.subtract(364 - i, "day")
    );
    const activityData = days.map((d) => ({
      date: d.format("YYYY-MM-DD"),
      count: activityMap.get(d.format("YYYY-MM-DD")) || 0,
    }));

    // --- 4️⃣ Streaks ---
    let longestStreak = 0, tempStreak = 0;
    for (const day of activityData) {
      if (day.count > 0) tempStreak++;
      else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    let currentStreak = 0;
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].count > 0) currentStreak++;
      else break;
    }

    // --- 5️⃣ Skills unlocked ---
    const skillsResult = await pool.query(
      `SELECT COUNT(*) AS skills_unlocked
       FROM user_courses
       WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );
    const skillsUnlocked = parseInt(skillsResult.rows[0]?.skills_unlocked || 0, 10);

    // --- 6️⃣ XP Level ---
    const xpResult = await pool.query(
      `SELECT COALESCE(SUM(activity_count), 0) AS xp
       FROM user_activity_log
       WHERE user_id = $1`,
      [userId]
    );
    const xpLevel = Math.floor((xpResult.rows[0]?.xp || 0) / 100);

    // --- 7️⃣ This Week Hours ---
    const weekResult = await pool.query(
      `SELECT COALESCE(SUM(time_spent), 0) AS minutes
       FROM user_lessons
       WHERE user_id = $1 AND updated_at >= NOW() - INTERVAL '7 days'`,
      [userId]
    );
    const thisWeekHours = (weekResult.rows[0]?.minutes || 0) / 60;

    // --- 8️⃣ Tasks ---
    const tasksResult = await pool.query(
      `SELECT * FROM user_tasks WHERE user_id=$1 ORDER BY date ASC`,
      [userId]
    );
    const tasks = tasksResult.rows;
    const tasksByDate = {};
    tasks.forEach((task) => {
      const dateKey = format(new Date(task.date), "yyyy-MM-dd");
      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
      tasksByDate[dateKey].push({
        id: task.id,
        title: task.title,
        course: task.course,
        date: task.date,
        priority: task.priority,
        time: task.time,
        status: task.status,
      });
    });

    // --- 9️⃣ Quote of the day ---
    const todayKey = new Date().toISOString().split("T")[0];
    if (!global.quoteCache) global.quoteCache = { date: null, quote: null };
    if (global.quoteCache.date !== todayKey) {
      const quotes = await loadQuotes();
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      global.quoteCache = { date: todayKey, quote: randomQuote };
    }
    const quoteOfTheDay = global.quoteCache.quote;

    // --- 🔟 Focus Section (keep link from first code) ---
    const focusSection = focusData
      ? {
          title: `Learn '${focusData.course_title}'`,
          link: `/dashboard/learn/paths/${focusData.path_id}/courses/${focusData.course_slug}`,
          cta: "Continue",
        }
      : null;

    // --- ✅ Final Response ---
    res.json({
      ok: true,
      data: {
        firstName,
        focus: focusSection,
        streak: currentStreak,
        skillsUnlocked,
        level: xpLevel,
        thisWeekHours,
        learningActivity: {
          total: activityData.reduce((sum, d) => sum + d.count, 0),
          longestStreak,
          currentStreak,
          activityData,
        },
        tasks,
        tasksByDate,
        quoteOfTheDay,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch dashboard" });
  }
};