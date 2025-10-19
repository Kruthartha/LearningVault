const learningPaths = require("../data/learningPaths.json");
const courses = require("../data/courses.json");
const modules = require("../data/modules.json");
const lessons = require("../data/lessons.json");
const learningPathCourses = require("../data/learningPathCourses.json");
const courseModules = require("../data/courseModules.json");
const moduleLessons = require("../data/moduleLessons.json");
const lessonBlocks = require("../data/lessonBlocks.json"); // ⬅️ NEW

exports.up = async (pgm) => {
  // -------------------------
  // LEARNING PATHS
  // -------------------------
  for (const path of learningPaths) {
    await pgm.db.query(
      `INSERT INTO learning_paths 
        (id, title, track_name, track_type, duration, color, popular, locked, description, skills)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)
       ON CONFLICT (id) DO NOTHING;`,
      [
        path.id,
        path.title,
        path.track_name,
        path.track_type,
        path.duration,
        path.color,
        path.popular,
        path.locked,
        path.description,
        JSON.stringify(path.skills),
      ]
    );
  }

  // -------------------------
  // COURSES
  // -------------------------
  for (const course of courses) {
    const slug = course.slug || course.title.toLowerCase().replace(/\s+/g, "-");

    await pgm.db.query(
      `INSERT INTO courses (id, slug, title, description, learning_objectives, duration, difficulty)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   ON CONFLICT (id) DO NOTHING;`,
      [
        course.id,
        slug,
        course.title,
        course.description || null,
        course.learning_objectives || [], // <-- this should be a JS array
        course.duration || null,
        course.difficulty || null,
      ]
    );
  }

  // -------------------------
  // MODULES
  // -------------------------
  for (const module of modules) {
    await pgm.db.query(
      `INSERT INTO modules (id, title, description, branching)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (id) DO NOTHING;`,
      [module.id, module.title, module.description, module.branching || false]
    );
  }

  // -------------------------
  // LESSONS
  // -------------------------
  for (const lesson of lessons) {
    await pgm.db.query(
      `INSERT INTO lessons (id, title, content, duration, difficulty)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING;`,
      [
        lesson.id,
        lesson.title,
        lesson.content || lesson.description || null,
        lesson.duration || null,
        lesson.difficulty || null,
      ]
    );
  }

  // -------------------------
  // LEARNING PATH ↔ COURSES
  // -------------------------
  for (const rel of learningPathCourses) {
    await pgm.db.query(
      `INSERT INTO learning_path_courses (learning_path_id, course_id, position)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING;`,
      [rel.learning_path_id, rel.course_id, rel.position]
    );
  }

  // -------------------------
  // COURSE ↔ MODULES
  // -------------------------
  for (const rel of courseModules) {
    await pgm.db.query(
      `INSERT INTO course_modules (course_id, module_id, position)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING;`,
      [rel.course_id, rel.module_id, rel.position]
    );
  }

  // -------------------------
  // MODULE ↔ LESSONS
  // -------------------------
  for (const rel of moduleLessons) {
    await pgm.db.query(
      `INSERT INTO module_lessons (module_id, lesson_id, position)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING;`,
      [rel.module_id, rel.lesson_id, rel.position]
    );
  }

  // -------------------------
  // LESSON BLOCKS (NEW DATA STRUCTURE)
  // -------------------------

  if (lessonBlocks && Array.isArray(lessonBlocks)) {
    for (const block of lessonBlocks) {
      const data = {};

      switch (block.type) {
        case "heading":
          if (block.data?.title) data.title = block.data.title;
          break;

        case "text":
        case "key_takeaway":
          if (block.data?.content) data.content = block.data.content;
          break;

        case "code":
          if (block.data?.title) data.title = block.data.title;
          if (block.data?.code) data.code = block.data.code;
          data.lang = block.data?.lang || "javascript";
          break;

        case "quiz":
          if (block.data?.question) data.question = block.data.question;
          data.options = block.data?.options || [];
          if ("correct_answer" in block.data)
            data.correctAnswer = block.data.correct_answer;
          if (block.data?.hint) data.hint = block.data.hint;
          break;

        case "exercise":
          if (block.data?.prompt) data.prompt = block.data.prompt;
          if (block.data?.starter_code)
            data.starterCode = block.data.starter_code;
          if (block.data?.hint) data.hint = block.data.hint;
          break;

        case "image":
          if (block.data?.src) data.src = block.data.src;
          if (block.data?.alt) data.alt = block.data.alt;
          if (block.data?.caption) data.caption = block.data.caption;
          break;

        default:
          if (block.data) Object.assign(data, block.data);
      }

      await pgm.db.query(
        `INSERT INTO lesson_blocks
       (lesson_id, step_position, block_position, type, data)
       VALUES ($1,$2,$3,$4,$5::jsonb)
       ON CONFLICT DO NOTHING;`,
        [
          block.lesson_id,
          block.step_position,
          block.block_position,
          block.type,
          JSON.stringify(data),
        ]
      );
    }
  }
};

exports.down = async (pgm) => {
  await pgm.db.query("DELETE FROM lesson_blocks");
  await pgm.db.query("DELETE FROM module_lessons");
  await pgm.db.query("DELETE FROM course_modules");
  await pgm.db.query("DELETE FROM learning_path_courses");
  await pgm.db.query("DELETE FROM lessons");
  await pgm.db.query("DELETE FROM modules");
  await pgm.db.query("DELETE FROM courses");
  await pgm.db.query("DELETE FROM learning_paths");
};
