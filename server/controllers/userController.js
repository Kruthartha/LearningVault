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
    let longestStreak = 0,
      tempStreak = 0;
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
    const skillsUnlocked = parseInt(
      skillsResult.rows[0]?.skills_unlocked || 0,
      10
    );

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
          title: `Start '${focusData.course_title}'`,
          link: `/dashboard/learn/paths/${focusData.path_id}/courses/${focusData.course_slug}`,
          cta: "Start Learning",
        }
      : {
          title: "Explore Learn Section ",
          link: `/dashboard/learn/`,
          cta: "Explore",
        };

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

// export const getUserLearnProgress = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     // --- Run streak and progress queries in parallel ---
//     const [streakResult, pathsResult] = await Promise.all([
//       // --- 1️⃣ Streak calculation ---
//       (async () => {
//         const { rows } = await pool.query(
//           `SELECT activity_date
//            FROM user_activity_log
//            WHERE user_id = $1
//            ORDER BY activity_date ASC`,
//           [userId]
//         );

//         let current_streak = 0;
//         let longest_streak = 0;
//         const week_streak_activity = {
//           Monday: "No",
//           Tuesday: "No",
//           Wednesday: "No",
//           Thursday: "No",
//           Friday: "No",
//           Saturday: "No",
//           Sunday: "No",
//         };

//         if (rows.length > 0) {
//           const dates = rows.map(r => new Date(r.activity_date));

//           // Calculate current & longest streak
//           let current = 1;
//           let longest = 1;
//           for (let i = 1; i < dates.length; i++) {
//             const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
//             if (diffDays === 1) current++;
//             else if (diffDays > 1) current = 1;
//             longest = Math.max(longest, current);
//           }

//           const lastActivity = dates[dates.length - 1];
//           const today = new Date();
//           const diffFromToday = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
//           if (diffFromToday > 1) current = 0;

//           current_streak = current;
//           longest_streak = longest;

//           // Weekly activity
//           const todayIndex = new Date().getDay();
//           const diffToMonday = todayIndex === 0 ? 6 : todayIndex - 1;
//           const monday = new Date();
//           monday.setDate(monday.getDate() - diffToMonday);
//           monday.setHours(0, 0, 0, 0);

//           dates.filter(d => d >= monday && d <= new Date()).forEach(d => {
//             const day = d.toLocaleString("en-US", { weekday: "long" });
//             week_streak_activity[day] = "Yes";
//           });
//         }

//         return { current_streak, longest_streak, week_streak_activity };
//       })(),

//       // --- 2️⃣ Progress calculation ---
//       (async () => {
//         const { rows: paths } = await pool.query(
//           `SELECT lp.*, ulp.current_course_id
//            FROM user_learning_paths ulp
//            JOIN learning_paths lp ON ulp.learning_path_id = lp.id
//            WHERE ulp.user_id = $1`,
//           [userId]
//         );

//         if (paths.length === 0) return [];

//         const pathIds = paths.map(p => p.id);

//         const { rows: courses } = await pool.query(
//           `SELECT c.*, uc.status, uc.current_module_id, lpc.learning_path_id
//            FROM learning_path_courses lpc
//            JOIN courses c ON lpc.course_id = c.id
//            LEFT JOIN user_courses uc ON uc.course_id = c.id AND uc.user_id = $1
//            WHERE lpc.learning_path_id = ANY($2::text[])`,
//           [userId, pathIds]
//         );

//         const courseIds = courses.map(c => c.id);

//         const { rows: modules } = await pool.query(
//           `SELECT m.*, um.status, um.current_lesson_id, cm.course_id
//            FROM course_modules cm
//            JOIN modules m ON cm.module_id = m.id
//            LEFT JOIN user_modules um ON um.module_id = m.id AND um.user_id = $1
//            WHERE cm.course_id = ANY($2::text[])`,
//           [userId, courseIds]
//         );

//         const moduleIds = modules.map(m => m.id);

//         const { rows: lessons } = await pool.query(
//           `SELECT ml.module_id, l.id AS lesson_id, l.title, l.content,
//                   CASE WHEN um_lesson.user_id IS NOT NULL THEN 'completed' ELSE 'locked' END AS status
//            FROM module_lessons ml
//            JOIN lessons l ON ml.lesson_id = l.id
//            LEFT JOIN user_modules um_lesson
//              ON um_lesson.module_id = ml.module_id
//              AND um_lesson.current_lesson_id >= l.id
//              AND um_lesson.user_id = $1
//            WHERE ml.module_id = ANY($2::text[])
//            ORDER BY ml.position ASC`,
//           [userId, moduleIds]
//         );

//         const lessonsByModule = {};
//         lessons.forEach(l => {
//           if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
//           lessonsByModule[l.module_id].push({
//             id: l.lesson_id,
//             title: l.title,
//             content: l.content,
//             status: l.status
//           });
//         });

//         const modulesWithProgress = modules.map(m => {
//           const moduleLessons = lessonsByModule[m.id] || [];
//           const completedLessons = moduleLessons.filter(l => l.status === "completed").length;
//           const progress = moduleLessons.length > 0
//             ? Math.round((completedLessons / moduleLessons.length) * 100)
//             : 0;

//           return {
//             id: m.id,
//             title: m.title,
//             status: m.status || "locked",
//             current_lesson_id: m.current_lesson_id,
//             lessons: moduleLessons,
//             progress,
//             course_id: m.course_id
//           };
//         });

//         return paths.map(lp => {
//           const lpCourses = courses.filter(c => c.learning_path_id === lp.id).map(c => {
//             const courseModules = modulesWithProgress.filter(m => m.course_id === c.id);
//             const courseProgress = courseModules.length
//               ? Math.round(courseModules.reduce((sum, m) => sum + m.progress, 0) / courseModules.length)
//               : 0;

//             return {
//               id: c.id,
//               title: c.title,
//               status: c.status || "locked",
//               current_module_id: c.current_module_id,
//               progress: courseProgress,
//               modules: courseModules
//             };
//           });

//           return {
//             id: lp.id,
//             title: lp.title,
//             current_course_id: lp.current_course_id,
//             courses: lpCourses
//           };
//         });
//       })()
//     ]);

//     // --- Send combined response ---
//     res.json({
//       ok: true,
//       streak: streakResult,
//       progress: pathsResult
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ ok: false, message: "Failed to fetch dashboard data" });
//   }
// };

// export const getUserLearnProgress = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     // Run streak + progress in parallel
//     const [streakResult, pathsResult] = await Promise.all([
//       // --- 🧩 1️⃣ STREAK CALCULATION ---
//       (async () => {
//         const { rows } = await pool.query(
//           `SELECT activity_date
//            FROM user_activity_log
//            WHERE user_id = $1
//            ORDER BY activity_date ASC`,
//           [userId]
//         );

//         let current_streak = 0;
//         let longest_streak = 0;
//         const week_streak_activity = {
//           Monday: "No",
//           Tuesday: "No",
//           Wednesday: "No",
//           Thursday: "No",
//           Friday: "No",
//           Saturday: "No",
//           Sunday: "No",
//         };

//         if (rows.length > 0) {
//           const dates = rows.map((r) => new Date(r.activity_date));
//           let current = 1;
//           let longest = 1;

//           for (let i = 1; i < dates.length; i++) {
//             const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
//             if (diffDays === 1) current++;
//             else if (diffDays > 1) current = 1;
//             longest = Math.max(longest, current);
//           }

//           const lastActivity = dates[dates.length - 1];
//           const today = new Date();
//           const diffFromToday = Math.floor(
//             (today - lastActivity) / (1000 * 60 * 60 * 24)
//           );
//           if (diffFromToday > 1) current = 0;

//           current_streak = current;
//           longest_streak = longest;

//           const todayIndex = new Date().getDay();
//           const diffToMonday = todayIndex === 0 ? 6 : todayIndex - 1;
//           const monday = new Date();
//           monday.setDate(monday.getDate() - diffToMonday);
//           monday.setHours(0, 0, 0, 0);

//           dates
//             .filter((d) => d >= monday && d <= new Date())
//             .forEach((d) => {
//               const day = d.toLocaleString("en-US", { weekday: "long" });
//               week_streak_activity[day] = "Yes";
//             });
//         }

//         return { current_streak, longest_streak, week_streak_activity };
//       })(),

//       // --- 🧠 2️⃣ LEARNING PROGRESS CALCULATION ---
//       (async () => {
//         const { rows: paths } = await pool.query(
//           `SELECT lp.*, ulp.current_course_id
//            FROM user_learning_paths ulp
//            JOIN learning_paths lp ON ulp.learning_path_id = lp.id
//            WHERE ulp.user_id = $1`,
//           [userId]
//         );

//         if (paths.length === 0) return [];

//         const pathIds = paths.map((p) => p.id);

//         // Fetch all courses in these paths
//         const { rows: courses } = await pool.query(
//           `SELECT c.*, uc.status, uc.current_module_id, lpc.learning_path_id
//            FROM learning_path_courses lpc
//            JOIN courses c ON lpc.course_id = c.id
//            LEFT JOIN user_courses uc ON uc.course_id = c.id AND uc.user_id = $1
//            WHERE lpc.learning_path_id = ANY($2::text[])`,
//           [userId, pathIds]
//         );

//         const courseIds = courses.map((c) => c.id);

//         // Fetch all modules in these courses
//         const { rows: modules } = await pool.query(
//           `SELECT m.*, um.status, um.current_lesson_id, cm.course_id
//            FROM course_modules cm
//            JOIN modules m ON cm.module_id = m.id
//            LEFT JOIN user_modules um ON um.module_id = m.id AND um.user_id = $1
//            WHERE cm.course_id = ANY($2::text[])`,
//           [userId, courseIds]
//         );

//         const moduleIds = modules.map((m) => m.id);

//         // --- 🧩 FIXED LESSON LOGIC ---
//         const { rows: lessons } = await pool.query(
//           `SELECT ml.module_id, l.id AS lesson_id, l.title, l.content, ml.position
//            FROM module_lessons ml
//            JOIN lessons l ON ml.lesson_id = l.id
//            WHERE ml.module_id = ANY($1::text[])
//            ORDER BY ml.position ASC`,
//           [moduleIds]
//         );

//         const { rows: userLessonProgress } = await pool.query(
//           `SELECT module_id, current_lesson_id
//            FROM user_modules
//            WHERE user_id = $1`,
//           [userId]
//         );

//         const userLessonMap = {};
//         userLessonProgress.forEach((u) => {
//           userLessonMap[u.module_id] = u.current_lesson_id;
//         });

//         const lessonsByModule = {};
//         lessons.forEach((l) => {
//           if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
//           lessonsByModule[l.module_id].push(l);
//         });

//         // --- 🧠 Assign lesson statuses properly ---
//         Object.keys(lessonsByModule).forEach((moduleId) => {
//           const moduleLessons = lessonsByModule[moduleId];
//           const currentLessonId = userLessonMap[moduleId];
//           let hasUnlockedNext = false;

//           moduleLessons.forEach((lesson, index) => {
//             if (!currentLessonId) {
//               // User hasn't started → unlock first lesson
//               lesson.status = index === 0 ? "unlocked" : "locked";
//             } else if (lesson.lesson_id === currentLessonId) {
//               lesson.status = "unlocked";
//               hasUnlockedNext = true;
//             } else if (hasUnlockedNext) {
//               lesson.status = "locked";
//               hasUnlockedNext = false;
//             } else {
//               lesson.status = "completed";
//             }
//           });
//         });

//         // --- 🧩 MODULE PROGRESS ---
//         const modulesWithProgress = modules.map((m) => {
//           const moduleLessons = lessonsByModule[m.id] || [];
//           const completedLessons = moduleLessons.filter(
//             (l) => l.status === "completed"
//           ).length;
//           const progress =
//             moduleLessons.length > 0
//               ? Math.round((completedLessons / moduleLessons.length) * 100)
//               : 0;

//           return {
//             id: m.id,
//             title: m.title,
//             status: m.status || "locked",
//             current_lesson_id: m.current_lesson_id,
//             lessons: moduleLessons,
//             progress,
//             course_id: m.course_id,
//           };
//         });

//         // --- 🧩 COURSE + PATH PROGRESS ---
//         const pathData = paths.map((lp) => {
//           const lpCourses = courses
//             .filter((c) => c.learning_path_id === lp.id)
//             .map((c) => {
//               const courseModules = modulesWithProgress.filter(
//                 (m) => m.course_id === c.id
//               );
//               const courseProgress = courseModules.length
//                 ? Math.round(
//                     courseModules.reduce((sum, m) => sum + m.progress, 0) /
//                       courseModules.length
//                   )
//                 : 0;

//               return {
//                 id: c.id,
//                 title: c.title,
//                 status: c.status || "locked",
//                 current_module_id: c.current_module_id,
//                 progress: courseProgress,
//                 modules: courseModules,
//               };
//             });

//           const pathProgress = lpCourses.length
//             ? Math.round(
//                 lpCourses.reduce((sum, c) => sum + c.progress, 0) /
//                   lpCourses.length
//               )
//             : 0;

//           return {
//             id: lp.id,
//             title: lp.title,
//             current_course_id: lp.current_course_id,
//             progress: pathProgress,
//             courses: lpCourses,
//           };
//         });

//         return pathData;
//       })(),
//     ]);

//     // --- ✅ Final Response ---
//     res.json({
//       ok: true,
//       streak: streakResult,
//       progress: pathsResult,
//     });
//   } catch (err) {
//     console.error("Error in getUserLearnProgress:", err);
//     res.status(500).json({
//       ok: false,
//       message: "Failed to fetch learn progress data",
//     });
//   }
// };


export const getUserLearnProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    // --- 1️⃣ Calculate streaks ---
    const { rows: activityRows } = await pool.query(
      `SELECT activity_date
       FROM user_activity_log
       WHERE user_id = $1
       ORDER BY activity_date ASC`,
      [userId]
    );

    let current_streak = 0;
    let longest_streak = 0;
    const week_streak_activity = {
      Monday: "No",
      Tuesday: "No",
      Wednesday: "No",
      Thursday: "No",
      Friday: "No",
      Saturday: "No",
      Sunday: "No",
    };

    if (activityRows.length > 0) {
      const dates = activityRows.map(r => new Date(r.activity_date));
      let current = 1;
      let longest = 1;

      for (let i = 1; i < dates.length; i++) {
        const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) current++;
        else if (diffDays > 1) current = 1;
        longest = Math.max(longest, current);
      }

      const lastActivity = dates[dates.length - 1];
      const today = new Date();
      const diffFromToday = Math.floor(
        (today - lastActivity) / (1000 * 60 * 60 * 24)
      );
      if (diffFromToday > 1) current = 0;

      current_streak = current;
      longest_streak = longest;

      // Week streak
      const todayIndex = new Date().getDay();
      const diffToMonday = todayIndex === 0 ? 6 : todayIndex - 1;
      const monday = new Date();
      monday.setDate(monday.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0);

      dates
        .filter(d => d >= monday && d <= new Date())
        .forEach(d => {
          const day = d.toLocaleString("en-US", { weekday: "long" });
          week_streak_activity[day] = "Yes";
        });
    }

    // --- 2️⃣ Get current path + course ---
    const { rows: paths } = await pool.query(
      `SELECT ulp.*, lp.title AS path_title
       FROM user_learning_paths ulp
       JOIN learning_paths lp ON ulp.learning_path_id = lp.id
       WHERE ulp.user_id = $1`,
      [userId]
    );

    if (paths.length === 0) {
      return res.json({
        ok: true,
        streak: { current_streak, longest_streak, week_streak_activity },
        current_path: null,
        current_course: null,
      });
    }

    // Assuming user has only 1 current learning path
    const currentPath = paths.find(p => p.current_course_id) || paths[0];

    // Get all courses in this path
    const { rows: courses } = await pool.query(
      `SELECT c.*, uc.status, uc.current_module_id
       FROM learning_path_courses lpc
       JOIN courses c ON lpc.course_id = c.id
       LEFT JOIN user_courses uc
         ON uc.course_id = c.id AND uc.user_id = $1
       WHERE lpc.learning_path_id = $2`,
      [userId, currentPath.learning_path_id]
    );

    if (!courses.length) {
      return res.json({
        ok: true,
        streak: { current_streak, longest_streak, week_streak_activity },
        current_path: { id: currentPath.learning_path_id, title: currentPath.path_title, progress: 0 },
        current_course: null,
      });
    }

    // Current course
    const currentCourse = courses.find(c => c.id === currentPath.current_course_id) || courses[0];

    // Get all modules & lessons for this course to calculate progress
    const { rows: modules } = await pool.query(
      `SELECT m.id, um.current_lesson_id, um.status
       FROM course_modules cm
       JOIN modules m ON cm.module_id = m.id
       LEFT JOIN user_modules um
         ON um.module_id = m.id AND um.user_id = $1
       WHERE cm.course_id = $2`,
      [userId, currentCourse.id]
    );

    const moduleIds = modules.map(m => m.id);
    const { rows: lessons } = await pool.query(
      `SELECT l.id, l.title, ml.module_id, ul.status
       FROM module_lessons ml
       JOIN lessons l ON ml.lesson_id = l.id
       LEFT JOIN user_lessons ul
         ON ul.lesson_id = l.id AND ul.user_id = $1
       WHERE ml.module_id = ANY($2::text[])`,
      [userId, moduleIds]
    );

    // Calculate course progress
    let totalLessons = 0;
    let completedLessons = 0;
    let currentLesson = null;

    const lessonsByModule = {};
    lessons.forEach(l => {
      if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
      lessonsByModule[l.module_id].push(l);

      totalLessons++;
      if (l.status === "completed") completedLessons++;

      // Determine current lesson
      if (!currentLesson && l.status !== "completed") {
        currentLesson = { id: l.id, title: l.title };
      }
    });

    const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Path progress = average of all courses
    const pathProgress = courses.length
      ? Math.round(
          courses.reduce((sum, c) => {
            // Simple estimate: use user_modules + user_lessons
            const modRows = lessons.filter(l => moduleIds.includes(l.module_id));
            const total = modRows.length;
            const completed = modRows.filter(l => l.status === "completed").length;
            return sum + (total > 0 ? (completed / total) * 100 : 0);
          }, 0) / courses.length
        )
      : 0;

    // --- ✅ Return final simplified response ---
    res.json({
      ok: true,
      streak: { current_streak, longest_streak, week_streak_activity },
      current_path: {
        id: currentPath.learning_path_id,
        title: currentPath.path_title,
        progress: pathProgress,
      },
      current_course: {
        id: currentCourse.id,
        title: currentCourse.title,
        progress: courseProgress,
        current_module_id: currentCourse.current_module_id,
        current_lesson: currentLesson,
      },
    });
  } catch (err) {
    console.error("Error in getUserLearnProgress:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch learn progress data",
    });
  }
};