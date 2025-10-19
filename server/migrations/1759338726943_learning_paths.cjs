/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  // -------------------------
  // LEARNING PATHS
  // -------------------------
  pgm.createTable("learning_paths", {
    id: { type: "varchar(100)", primaryKey: true },
    title: { type: "text", notNull: true },
    track_name: { type: "text" },
    track_type: { type: "text" },
    duration: { type: "text" },
    color: { type: "text" },
    popular: { type: "boolean", default: false },
    locked: { type: "boolean", default: false },
    description: { type: "text" },
    skills: { type: "jsonb", notNull: true, default: "[]" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // -------------------------
  // COURSES
  // -------------------------
  pgm.createTable("courses", {
    id: { type: "varchar(100)", primaryKey: true },
    slug: { type: "text", notNull: true },
    title: { type: "text", notNull: true },
    description: { type: "text" }, // course description
    learning_objectives: { type: "text[]", default: "{}" }, // <-- added
    duration: { type: "text" },
    difficulty: { type: "text" },
    cover_image_url: { type: "text" }, // optional
    level: { type: "text" }, // optional
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // Junction: Learning Path ↔ Courses
  pgm.createTable("learning_path_courses", {
    id: "id",
    learning_path_id: {
      type: "varchar(100)",
      notNull: true,
      references: "learning_paths",
      onDelete: "cascade",
    },
    course_id: {
      type: "varchar(100)",
      notNull: true,
      references: "courses",
      onDelete: "cascade",
    },
    position: { type: "integer", notNull: true },
  });
  pgm.createIndex("learning_path_courses", ["learning_path_id", "course_id"], {
    unique: true,
  });

  // -------------------------
  // MODULES
  // -------------------------
  pgm.createTable("modules", {
    id: { type: "varchar(100)", primaryKey: true },
    title: { type: "text", notNull: true },
    description: { type: "text" },
    branching: { type: "boolean", default: false },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // Junction: Course ↔ Modules
  pgm.createTable("course_modules", {
    id: "id",
    course_id: {
      type: "varchar(100)",
      notNull: true,
      references: "courses",
      onDelete: "cascade",
    },
    module_id: {
      type: "varchar(100)",
      notNull: true,
      references: "modules",
      onDelete: "cascade",
    },
    position: { type: "integer", notNull: true },
  });
  pgm.createIndex("course_modules", ["course_id", "module_id"], {
    unique: true,
  });

  // -------------------------
  // LESSONS
  // -------------------------
  pgm.createTable("lessons", {
    id: { type: "varchar(100)", primaryKey: true },
    title: { type: "text", notNull: true },
    content: { type: "text" },
    duration: { type: "integer" },
    difficulty: { type: "text" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // Junction: Module ↔ Lessons
  pgm.createTable("module_lessons", {
    id: "id",
    module_id: {
      type: "varchar(100)",
      notNull: true,
      references: "modules",
      onDelete: "cascade",
    },
    lesson_id: {
      type: "varchar(100)",
      notNull: true,
      references: "lessons",
      onDelete: "cascade",
    },
    position: { type: "integer", notNull: true },
  });
  pgm.createIndex("module_lessons", ["module_id", "lesson_id"], {
    unique: true,
  });

  // -------------------------
  // LESSON BLOCKS (New Flexible System)
  // -------------------------
  // -------------------------
  // LESSON BLOCKS (Flexible JSONB)
  // -------------------------
  pgm.createTable("lesson_blocks", {
    id: "id",
    lesson_id: {
      type: "varchar(100)",
      notNull: true,
      references: "lessons",
      onDelete: "cascade",
    },
    step_position: { type: "integer", notNull: true }, // Which "page" of the lesson
    block_position: { type: "integer", notNull: true }, // Order within that page
    type: { type: "text", notNull: true }, // 'text', 'code', 'quiz', 'exercise', etc.
    data: { type: "jsonb", notNull: true }, // All block content stored here
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // Index for fast ordering
  pgm.createIndex("lesson_blocks", [
    "lesson_id",
    "step_position",
    "block_position",
  ]);
};

exports.down = (pgm) => {
  pgm.dropTable("lesson_blocks");
  pgm.dropTable("module_lessons");
  pgm.dropTable("lessons");
  pgm.dropTable("course_modules");
  pgm.dropTable("modules");
  pgm.dropTable("learning_path_courses");
  pgm.dropTable("courses");
  pgm.dropTable("learning_paths");
};
