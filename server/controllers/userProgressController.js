import { pool } from "../config/db.js";

export const getUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    // -----------------------
    // 1️⃣ Get current learning paths
    // -----------------------
    const { rows: paths } = await pool.query(
      `SELECT lp.*, ulp.current_course_id
       FROM user_learning_paths ulp
       JOIN learning_paths lp ON ulp.learning_path_id = lp.id
       WHERE ulp.user_id = $1`,
      [userId]
    );

    if (paths.length === 0) return res.json([]);

    // -----------------------
    // 2️⃣ Get courses + user status
    // -----------------------
    const { rows: courses } = await pool.query(
      `SELECT c.*, uc.status, uc.current_module_id, lpc.learning_path_id
       FROM learning_path_courses lpc
       JOIN courses c ON lpc.course_id = c.id
       LEFT JOIN user_courses uc ON uc.course_id = c.id AND uc.user_id = $1
       WHERE lpc.learning_path_id = ANY($2::text[])`,
      [userId, paths.map((p) => p.id)]
    );

    const courseIds = courses.map((c) => c.id);

    // -----------------------
    // 3️⃣ Get modules + user status
    // -----------------------
    const { rows: modules } = await pool.query(
      `SELECT m.*, um.status, um.current_lesson_id, cm.course_id
       FROM course_modules cm
       JOIN modules m ON cm.module_id = m.id
       LEFT JOIN user_modules um ON um.module_id = m.id AND um.user_id = $1
       WHERE cm.course_id = ANY($2::text[])`,
      [userId, courseIds]
    );

    const moduleIds = modules.map((m) => m.id);

    // -----------------------
    // 4️⃣ Get lessons for modules
    // -----------------------
    const { rows: lessons } = await pool.query(
      `SELECT ml.module_id, l.id AS lesson_id, l.title, l.content,
              CASE WHEN um_lesson.user_id IS NOT NULL THEN 'completed' ELSE 'locked' END AS status
       FROM module_lessons ml
       JOIN lessons l ON ml.lesson_id = l.id
       LEFT JOIN user_modules um_lesson
         ON um_lesson.module_id = ml.module_id
         AND um_lesson.current_lesson_id >= l.id
         AND um_lesson.user_id = $1
       WHERE ml.module_id = ANY($2::text[])
       ORDER BY ml.position ASC`,
      [userId, moduleIds]
    );

    // Group lessons by module
    const lessonsByModule = {};
    lessons.forEach((l) => {
      if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
      lessonsByModule[l.module_id].push({
        id: l.lesson_id,
        title: l.title,
        content: l.content,
        status: l.status,
      });
    });

    // -----------------------
    // 5️⃣ Structure modules with progress
    // -----------------------
    const modulesWithProgress = modules.map((m) => {
      const moduleLessons = lessonsByModule[m.id] || [];
      const completedLessons = moduleLessons.filter(
        (l) => l.status === "completed"
      ).length;
      const progress =
        moduleLessons.length > 0
          ? Math.round((completedLessons / moduleLessons.length) * 100)
          : 0;

      return {
        id: m.id,
        title: m.title,
        status: m.status || "locked",
        current_lesson_id: m.current_lesson_id,
        lessons: moduleLessons,
        progress,
        course_id: m.course_id,
      };
    });

    // -----------------------
    // 6️⃣ Structure courses with progress
    // -----------------------
    const response = paths.map((lp) => {
      const lpCourses = courses
        .filter((c) => c.learning_path_id === lp.id)
        .map((c) => {
          const courseModules = modulesWithProgress.filter(
            (m) => m.course_id === c.id
          );
          const courseProgress = courseModules.length
            ? Math.round(
                courseModules.reduce((sum, m) => sum + m.progress, 0) /
                  courseModules.length
              )
            : 0;

          return {
            id: c.id,
            title: c.title,
            status: c.status || (c.locked ? "locked" : "unlocked"),
            current_module_id: c.current_module_id,
            progress: courseProgress,
            modules: courseModules,
          };
        });

      return {
        id: lp.id,
        title: lp.title,
        current_course_id: lp.current_course_id,
        courses: lpCourses,
      };
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// GET /api/user/progress/:learningPathId
export const getLearningPathProgress = async (req, res) => {
  const userId = req.user.id;
  const { learningPathId } = req.params;

  try {
    // 1️⃣ Get learning path info + user progress (current_course_id)
    const { rows: lpRows } = await pool.query(
      `SELECT ulp.current_course_id, lp.title
       FROM user_learning_paths ulp
       JOIN learning_paths lp ON ulp.learning_path_id = lp.id
       WHERE ulp.user_id = $1 AND ulp.learning_path_id = $2`,
      [userId, learningPathId]
    );

    if (lpRows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Learning path not found" });
    }
    const lp = lpRows[0];

    // 2️⃣ Get all courses in this learning path with user status (no uc.progress column)
    const { rows: courseRows } = await pool.query(
      `SELECT 
         c.id,
         c.title,
         c.description,
         COALESCE(uc.status, 'locked') AS user_status,
         uc.current_module_id
       FROM learning_path_courses lpc
       JOIN courses c ON lpc.course_id = c.id
       LEFT JOIN user_courses uc ON uc.course_id = c.id AND uc.user_id = $1
       WHERE lpc.learning_path_id = $2
       ORDER BY lpc.position ASC`,
      [userId, learningPathId]
    );

    const courseIds = courseRows.map((c) => c.id);
    if (courseIds.length === 0) {
      // no courses -> return empty summary
      return res.json({
        ok: true,
        learning_path_id: learningPathId,
        title: lp.title,
        current_course_id: lp.current_course_id,
        progress: 0,
        courses: [],
      });
    }

    // 3️⃣ Get modules for all those courses (include course_id)
    const { rows: moduleRows } = await pool.query(
      `SELECT 
         cm.course_id,
         m.id AS module_id,
         m.title,
         m.description,
         COALESCE(um.status, 'locked') AS user_status,
         um.current_lesson_id
       FROM course_modules cm
       JOIN modules m ON cm.module_id = m.id
       LEFT JOIN user_modules um 
         ON um.module_id = m.id AND um.user_id = $1
       WHERE cm.course_id = ANY($2::text[])
       ORDER BY cm.course_id, cm.position ASC`,
      [userId, courseIds]
    );

    const moduleIds = moduleRows.map((m) => m.module_id);

    // 4️⃣ Fetch lessons for these modules + user lesson status/time_spent
    let lessonRows = [];
    if (moduleIds.length > 0) {
      const { rows } = await pool.query(
        `SELECT 
           ml.module_id,
           l.id AS lesson_id,
           l.title,
           COALESCE(ul.status, NULL) AS user_lesson_status,
           COALESCE(ul.time_spent, 0) AS time_spent,
           ml.position AS lesson_position,
           -- also bring user_modules.current_lesson_id so we can mark unlocked properly when user_modules points to this lesson
           um.current_lesson_id
         FROM module_lessons ml
         JOIN lessons l ON ml.lesson_id = l.id
         LEFT JOIN user_lessons ul 
           ON ul.lesson_id = l.id AND ul.user_id = $1
         LEFT JOIN user_modules um
           ON um.module_id = ml.module_id AND um.user_id = $1
         WHERE ml.module_id = ANY($2::text[])
         ORDER BY ml.module_id, ml.position ASC`,
        [userId, moduleIds]
      );

      lessonRows = rows;
    }

    // 5️⃣ Group lessons by module
    const lessonsByModule = {};
    lessonRows.forEach((r) => {
      if (!lessonsByModule[r.module_id]) lessonsByModule[r.module_id] = [];
      // determine lesson status:
      // - if user_lesson_status exists, use it (completed/unlocked/etc)
      // - else if user_modules.current_lesson_id equals this lesson -> unlocked
      // - else locked
      const status = r.user_lesson_status
        ? r.user_lesson_status
        : r.current_lesson_id === r.lesson_id
        ? "unlocked"
        : "locked";

      lessonsByModule[r.module_id].push({
        id: r.lesson_id,
        title: r.title,
        status,
        timeSpent: parseInt(r.time_spent, 10) || 0,
      });
    });

    // 6️⃣ Build modules with computed progress and attach to their course
    const modulesWithProgress = moduleRows.map((m) => {
      const moduleLessons = lessonsByModule[m.module_id] || [];
      const completedCount = moduleLessons.filter(
        (x) => x.status === "completed"
      ).length;
      const totalCount = moduleLessons.length || 0;
      const progress =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        id: m.module_id,
        course_id: m.course_id,
        title: m.title,
        description: m.description,
        status: m.user_status || "locked",
        current_lesson_id: m.current_lesson_id || null,
        progress,
        lessons: moduleLessons,
      };
    });

    // 7️⃣ Aggregate per-course progress by averaging that course's modules' progress
    const coursesSummary = courseRows.map((c) => {
      const modulesForCourse = modulesWithProgress.filter(
        (mm) => mm.course_id === c.id
      );
      const courseProgress =
        modulesForCourse.length > 0
          ? Math.round(
              modulesForCourse.reduce((s, mm) => s + mm.progress, 0) /
                modulesForCourse.length
            )
          : 0;

      // map course status: prefer current if this is the user's current_course_id
      let status = "locked";
      if (c.id === lp.current_course_id) status = "current";
      else if (["unlocked", "in_progress", "completed"].includes(c.user_status))
        status = c.user_status;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        status,
        progress: courseProgress,
      };
    });

    // 8️⃣ Compute overall learning-path progress (average of course progresses)
    const overallProgress =
      coursesSummary.length > 0
        ? Math.round(
            coursesSummary.reduce((s, c) => s + c.progress, 0) /
              coursesSummary.length
          )
        : 0;

    // 9️⃣ Respond
    return res.json({
      ok: true,
      learning_path_id: learningPathId,
      title: lp.title,
      current_course_id: lp.current_course_id,
      progress: overallProgress,
      courses: coursesSummary,
    });
  } catch (err) {
    console.error("Error in getLearningPathProgress:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

export const getCourseProgress = async (req, res) => {
  const userId = req.user.id;
  const { learningPathId, courseId } = req.params;

  try {
    // 1️⃣ Check access to learning path
    const { rows: lpCheck } = await pool.query(
      `SELECT 1 FROM user_learning_paths WHERE user_id = $1 AND learning_path_id = $2`,
      [userId, learningPathId]
    );

    if (lpCheck.length === 0)
      return res.status(403).json({ ok: false, message: "Access denied" });

    // 2️⃣ Fetch course info + user status + learning objectives
    const { rows: courseRows } = await pool.query(
      `SELECT c.id, c.title, c.description, c.learning_objectives, uc.status AS user_status, uc.current_module_id
       FROM courses c
       JOIN learning_path_courses lpc ON lpc.course_id = c.id
       LEFT JOIN user_courses uc ON uc.course_id = c.id AND uc.user_id = $1
       WHERE lpc.learning_path_id = $2 AND c.id = $3`,
      [userId, learningPathId, courseId]
    );

    if (!courseRows.length)
      return res.status(404).json({ ok: false, message: "Course not found" });

    const course = courseRows[0];

    // 3️⃣ Fetch modules + user progress + module descriptions
    const { rows: modules } = await pool.query(
      `SELECT m.id, m.title, m.description, um.status AS user_status, um.current_lesson_id
       FROM course_modules cm
       JOIN modules m ON cm.module_id = m.id
       LEFT JOIN user_modules um ON um.module_id = m.id AND um.user_id = $1
       WHERE cm.course_id = $2
       ORDER BY cm.position ASC`,
      [userId, courseId]
    );

    const moduleIds = modules.map((m) => m.id);

    // 4️⃣ Fetch lessons + user progress
    const { rows: lessons } = await pool.query(
      `SELECT 
        ml.module_id, 
        l.id AS lesson_id, 
        l.title, 
        l.content, 
        l.duration, 
        l.difficulty,
        CASE 
          WHEN ul.status IS NOT NULL THEN ul.status
          WHEN um.current_lesson_id = l.id THEN 'unlocked'
          ELSE 'locked'
        END AS status,
        COALESCE(ul.time_spent, 0) AS time_spent
      FROM module_lessons ml
      JOIN lessons l ON ml.lesson_id = l.id
      LEFT JOIN user_lessons ul 
        ON ul.lesson_id = l.id 
        AND ul.user_id = $1
      LEFT JOIN user_modules um
        ON um.module_id = ml.module_id 
        AND um.user_id = $1
      WHERE ml.module_id = ANY($2::text[])
      ORDER BY ml.position ASC`,
      [userId, moduleIds]
    );

    // Group lessons by module
    const lessonsByModule = {};
    lessons.forEach((l) => {
      if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
      lessonsByModule[l.module_id].push({
        id: l.lesson_id,
        title: l.title,
        content: l.content,
        duration: l.duration,
        difficulty: l.difficulty,
        status: l.status,
        timeSpent: l.time_spent || 0,
      });
    });

    // 🔓 Unlock first lesson of first module if user is new
    if (
      !modules.some((m) => ["in_progress", "completed"].includes(m.user_status))
    ) {
      const firstModuleId = modules[0]?.id;
      if (firstModuleId && lessonsByModule[firstModuleId]?.length) {
        lessonsByModule[firstModuleId][0].status = "unlocked";
      }
    }

    // 5️⃣ Unlock next module & first lesson if previous module completed
    for (let i = 0; i < modules.length - 1; i++) {
      const module = modules[i];
      const nextModule = modules[i + 1];
      const moduleLessons = lessonsByModule[module.id] || [];
      const allCompleted = moduleLessons.every((l) => l.status === "completed");

      if (allCompleted && nextModule.user_status !== "completed") {
        // Unlock next module
        await pool.query(
          `INSERT INTO user_modules (user_id, module_id, status)
           VALUES ($1, $2, 'unlocked')
           ON CONFLICT (user_id, module_id)
           DO UPDATE SET status = 'unlocked'`,
          [userId, nextModule.id]
        );

        // Unlock first lesson of next module
        const firstLesson = lessonsByModule[nextModule.id]?.[0];
        if (firstLesson && firstLesson.status === "locked") {
          await pool.query(
            `INSERT INTO user_lessons (user_id, lesson_id, status)
             VALUES ($1, $2, 'unlocked')
             ON CONFLICT (user_id, lesson_id)
             DO UPDATE SET status = 'unlocked'`,
            [userId, firstLesson.id]
          );
          // Update current lesson for module
          await pool.query(
            `UPDATE user_modules SET current_lesson_id = $3 WHERE user_id = $1 AND module_id = $2`,
            [userId, nextModule.id, firstLesson.id]
          );
          // Update local object
          lessonsByModule[nextModule.id][0].status = "unlocked";
        }
      }
    }

    // 6️⃣ Calculate module progress
    const modulesWithProgress = modules.map((m) => {
      const moduleLessons = lessonsByModule[m.id] || [];
      const completedCount = moduleLessons.filter(
        (l) => l.status === "completed"
      ).length;
      const progress = moduleLessons.length
        ? Math.round((completedCount / moduleLessons.length) * 100)
        : 0;

      return {
        id: m.id,
        title: m.title,
        description: m.description,
        status: m.user_status || "locked",
        current_lesson_id: m.current_lesson_id,
        progress,
        lessons: moduleLessons,
      };
    });

    // 7️⃣ Calculate overall course progress
    const courseProgress = modulesWithProgress.length
      ? Math.round(
          modulesWithProgress.reduce((sum, m) => sum + m.progress, 0) /
            modulesWithProgress.length
        )
      : 0;

    // 8️⃣ Return full course structure
    res.json({
      ok: true,
      learning_path_id: learningPathId,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        status: course.user_status || "locked",
        progress: courseProgress,
        current_module_id: course.current_module_id,
        learningObjectives: course.learning_objectives || [],
        modules: modulesWithProgress,
      },
    });
  } catch (err) {
    console.error("Error in getCourseProgress:", err);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};
// GET /api/user/progress/:learningPathId/:courseId/:lessonId

// Get Lesson by ID
// GET /api/user/progress/:learningPathId/:courseId/:lessonId
// GET /api/user/progress/:learningPathId/:courseId/:lessonId
// GET /api/user/progress/:learningPathId/:courseId/:lessonId
export const getLessonById = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  try {
    // 1️⃣ Get lesson info
    const lessonResult = await pool.query(
      `SELECT id, title FROM lessons WHERE id = $1`,
      [lessonId]
    );

    if (!lessonResult.rows.length)
      return res.status(404).json({ error: "Lesson not found" });

    const lesson = lessonResult.rows[0];

    // 2️⃣ Get lesson blocks
    const blocksResult = await pool.query(
      `SELECT *
       FROM lesson_blocks
       WHERE lesson_id = $1
       ORDER BY step_position, block_position`,
      [lessonId]
    );

    // 3️⃣ Group blocks by step_position
    const stepsMap = new Map();
    for (const b of blocksResult.rows) {
      if (!stepsMap.has(b.step_position)) stepsMap.set(b.step_position, []);

      const block = { type: b.type };

      // Normalize data per block type
      switch (b.type) {
        case "heading":
          block.title = b.data?.title || "";
          break;

        case "text":
        case "key_takeaway":
          block.content = b.data?.content || "";
          break;

        case "code":
          block.title = b.data?.title || "";
          block.code = b.data?.code || "";
          block.lang = b.data?.lang || "javascript";
          block.keyTakeaway =
            b.data?.keyTakeaway || b.data?.key_takeaway || null;
          break;

        case "exercise":
          block.prompt = b.data?.prompt || "";
          block.starterCode = b.data?.starterCode || b.data?.starter_code || "";
          block.hint = b.data?.hint || "";
          break;

        case "quiz":
          block.question = b.data?.question || "";
          block.options = b.data?.options || [];
          block.correctAnswer =
            b.data?.correctAnswer || b.data?.correct_answer || null;
          block.hint = b.data?.hint || "";
          break;

        default:
          Object.assign(block, b.data || {});
      }

      stepsMap.get(b.step_position).push(block);
    }

    // 4️⃣ Construct steps array
    const steps = Array.from(stepsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([_, blocks]) => blocks);

    // 5️⃣ Check if lesson is completed for this user
    const { rows: userLessonRows } = await pool.query(
      `SELECT status FROM user_lessons WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId]
    );

    const isCompleted =
      userLessonRows.length > 0 && userLessonRows[0].status === "completed";

    // 6️⃣ Get average time spent by all users
    const { rows: avgTimeRows } = await pool.query(
      `SELECT AVG(time_spent) AS average_time FROM user_lessons WHERE lesson_id = $1`,
      [lessonId]
    );

    const averageTime = avgTimeRows[0].average_time
      ? parseInt(avgTimeRows[0].average_time, 10)
      : 0;

    // 7️⃣ Construct response
    const response = {
      type: "lesson",
      id: lesson.id,
      title: lesson.title,
      completed: isCompleted,
      averageTime, // average time included
      steps,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching lesson:", err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
};

// POST /api/user/progress/:learningPathId/:courseId/:lessonId/complete
// POST /api/user/progress/:learningPathId/:courseId/:lessonId/complete
export const completeLesson = async (req, res) => {
  const { timeSpent } = req.body;
  const userId = req.user.id;
  const { learningPathId, courseId, lessonId } = req.params;

  try {
    // -------------------------
    // 1️⃣ Mark lesson as completed
    // -------------------------
    await pool.query(
      `INSERT INTO user_lessons (user_id, lesson_id, status, time_spent)
       VALUES ($1, $2, 'completed', $3)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET status='completed', time_spent = EXCLUDED.time_spent, updated_at = NOW()`,
      [userId, lessonId, timeSpent || 0]
    );

    // -------------------------
    // 2️⃣ Get module info for this lesson
    // -------------------------
    const { rows: moduleRows } = await pool.query(
      `SELECT ml.module_id, cm.course_id, ml.position AS lesson_position
       FROM module_lessons ml
       JOIN course_modules cm ON cm.module_id = ml.module_id
       WHERE ml.lesson_id = $1`,
      [lessonId]
    );

    if (!moduleRows.length)
      return res.status(404).json({ error: "Module not found for this lesson" });

    const { module_id: moduleId } = moduleRows[0];

    // -------------------------
    // 3️⃣ Unlock next lesson or mark module completed
    // -------------------------
    const { rows: nextLessonRows } = await pool.query(
      `SELECT lesson_id
       FROM module_lessons
       WHERE module_id = $1 AND position > (
         SELECT position FROM module_lessons WHERE lesson_id = $2
       )
       ORDER BY position ASC
       LIMIT 1`,
      [moduleId, lessonId]
    );

    if (nextLessonRows.length) {
      const nextLessonId = nextLessonRows[0].lesson_id;
      await pool.query(
        `INSERT INTO user_modules (user_id, module_id, current_lesson_id, status)
         VALUES ($1, $2, $3, 'in_progress')
         ON CONFLICT (user_id, module_id)
         DO UPDATE SET current_lesson_id = $3, status='in_progress', updated_at = NOW()`,
        [userId, moduleId, nextLessonId]
      );
    } else {
      // Mark module completed
      await pool.query(
        `INSERT INTO user_modules (user_id, module_id, status)
         VALUES ($1, $2, 'completed')
         ON CONFLICT (user_id, module_id)
         DO UPDATE SET status='completed', updated_at=NOW()`,
        [userId, moduleId]
      );

      // Unlock next module if exists
      const { rows: nextModuleRows } = await pool.query(
        `SELECT cm_next.module_id
         FROM course_modules cm_current
         JOIN course_modules cm_next
           ON cm_current.course_id = cm_next.course_id
           AND cm_next.position = cm_current.position + 1
         WHERE cm_current.module_id = $1`,
        [moduleId]
      );

      if (nextModuleRows.length) {
        await pool.query(
          `INSERT INTO user_modules (user_id, module_id, status)
           VALUES ($1, $2, 'unlocked')
           ON CONFLICT (user_id, module_id) DO NOTHING`,
          [userId, nextModuleRows[0].module_id]
        );
      }
    }

    // -------------------------
    // 4️⃣ Update course progress
    // -------------------------
    const { rows: moduleProgressRows } = await pool.query(
      `SELECT status FROM user_modules WHERE user_id = $1 AND module_id IN (
         SELECT module_id FROM course_modules WHERE course_id = $2
       )`,
      [userId, courseId]
    );

    const allModulesCompleted = moduleProgressRows.every(
      (m) => m.status === "completed"
    );

    if (allModulesCompleted) {
      // Mark course completed
      await pool.query(
        `INSERT INTO user_courses (user_id, course_id, status)
         VALUES ($1, $2, 'completed')
         ON CONFLICT (user_id, course_id)
         DO UPDATE SET status='completed', updated_at=NOW()`,
        [userId, courseId]
      );

      // Unlock next course
      const { rows: nextCourseRows } = await pool.query(
        `SELECT c_next.course_id
         FROM learning_path_courses c_current
         JOIN learning_path_courses c_next
           ON c_current.learning_path_id = c_next.learning_path_id
           AND c_next.position = c_current.position + 1
         WHERE c_current.course_id = $1`,
        [courseId]
      );

      if (nextCourseRows.length) {
        await pool.query(
          `INSERT INTO user_courses (user_id, course_id, status)
           VALUES ($1, $2, 'unlocked')
           ON CONFLICT (user_id, course_id) DO NOTHING`,
          [userId, nextCourseRows[0].course_id]
        );

        // Update current course in learning path
        await pool.query(
          `UPDATE user_learning_paths
           SET current_course_id = $2, updated_at = NOW()
           WHERE user_id = $1 AND learning_path_id = $3`,
          [userId, nextCourseRows[0].course_id, learningPathId]
        );
      }
    } else {
      // Course in progress
      await pool.query(
        `INSERT INTO user_courses (user_id, course_id, status)
         VALUES ($1, $2, 'in_progress')
         ON CONFLICT (user_id, course_id)
         DO UPDATE SET status='in_progress', updated_at=NOW()`,
        [userId, courseId]
      );
    }

    // -------------------------
    // 5️⃣ Log activity for streak
    // -------------------------
    await pool.query(
      `INSERT INTO user_activity_log (user_id, activity_date, activity_type, lesson_id)
       VALUES ($1, CURRENT_DATE, 'lesson_completed', $2)
       ON CONFLICT (user_id, activity_date, activity_type, lesson_id)
       DO UPDATE SET activity_count = user_activity_log.activity_count + 1, updated_at = NOW()`,
      [userId, lessonId]
    );

    // -------------------------
    // 6️⃣ Update streak
    // -------------------------
    // Get yesterday's activity
    const { rows: yesterdayRows } = await pool.query(
      `SELECT MAX(activity_date) AS last_date FROM user_activity_log WHERE user_id = $1 AND activity_date < CURRENT_DATE`,
      [userId]
    );

    const yesterday = yesterdayRows[0]?.last_date;
    let streakIncrement = 1;

    if (yesterday) {
      const diff = Math.floor(
        (new Date() - new Date(yesterday)) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        // consecutive day
        streakIncrement = 1;
      } else if (diff > 1) {
        // streak broken
        streakIncrement = 1;
      } else {
        // already logged today
        streakIncrement = 0;
      }
    }

    await pool.query(
      `INSERT INTO user_streaks (user_id, streak_count, last_active_date)
       VALUES ($1, $2, CURRENT_DATE)
       ON CONFLICT (user_id)
       DO UPDATE SET streak_count = user_streaks.streak_count + $2, last_active_date = CURRENT_DATE`,
      [userId, streakIncrement]
    );

    // -------------------------
    // ✅ Response
    // -------------------------
    res.json({ ok: true, message: "Lesson completed, progress & streak updated" });
  } catch (err) {
    console.error("Error completing lesson:", err);
    res.status(500).json({ ok: false, message: "Failed to complete lesson" });
  }
};

