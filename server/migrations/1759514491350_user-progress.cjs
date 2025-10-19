/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  // Enum for status
  pgm.createType("progress_status", [
    "locked",
    "unlocked",
    "in_progress",
    "completed",
  ]);

  // -------------------------
  // User Learning Paths
  // -------------------------
  pgm.createTable("user_learning_paths", {
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    learning_path_id: {
      type: "varchar(100)",
      notNull: true,
      references: "learning_paths",
      onDelete: "cascade",
    },
    current_course_id: {
      type: "varchar(100)",
      references: "courses",
      onDelete: "set null",
    },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint(
    "user_learning_paths",
    "user_learning_paths_pkey",
    "PRIMARY KEY(user_id, learning_path_id)"
  );

  // -------------------------
  // User Courses
  // -------------------------
  pgm.createTable("user_courses", {
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    course_id: {
      type: "varchar(100)",
      notNull: true,
      references: "courses",
      onDelete: "cascade",
    },
    current_module_id: {
      type: "varchar(100)",
      references: "modules",
      onDelete: "set null",
    },
    status: {
      type: "progress_status",
      notNull: true,
      default: "locked",
    },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint(
    "user_courses",
    "user_courses_pkey",
    "PRIMARY KEY(user_id, course_id)"
  );
  pgm.createIndex("user_courses", ["user_id"]);

  // -------------------------
  // User Modules
  // -------------------------
  pgm.createTable("user_modules", {
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    module_id: {
      type: "varchar(100)",
      notNull: true,
      references: "modules",
      onDelete: "cascade",
    },
    current_lesson_id: {
      type: "varchar(100)",
      references: "lessons",
      onDelete: "set null",
    },
    status: {
      type: "progress_status",
      notNull: true,
      default: "locked",
    },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint(
    "user_modules",
    "user_modules_pkey",
    "PRIMARY KEY(user_id, module_id)"
  );
  pgm.createIndex("user_modules", ["user_id"]);

  // -------------------------
  // User Lessons
  // -------------------------
  pgm.createTable("user_lessons", {
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    lesson_id: {
      type: "varchar(100)",
      notNull: true,
      references: "lessons",
      onDelete: "cascade",
    },
    status: {
      type: "progress_status",
      notNull: true,
      default: "locked",
    },
    time_spent: { type: "integer", notNull: true, default: 0 }, // NEW
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint(
    "user_lessons",
    "user_lessons_pkey",
    "PRIMARY KEY(user_id, lesson_id)"
  );
  pgm.createIndex("user_lessons", ["user_id"]);

  pgm.createTable("user_activity_log", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    activity_date: {
      type: "date",
      notNull: true,
      default: pgm.func("current_date"),
    },
    activity_type: {
      type: "text",
      notNull: true,
    },
    lesson_id: {
      type: "varchar(100)",
      references: "lessons",
      onDelete: "set null",
    },
    activity_count: {
      type: "integer",
      notNull: true,
      default: 1,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  // Unique constraint for one activity per user per day per type/lesson
  pgm.addConstraint(
    "user_activity_log",
    "user_activity_log_user_date_lesson_unique",
    "UNIQUE(user_id, activity_date, activity_type, lesson_id)"
  );

  pgm.createIndex("user_activity_log", ["user_id", "activity_date"]);

  // -------------------------
  // 2️⃣ User Streaks
  // -------------------------
  pgm.createTable("user_streaks", {
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    streak_count: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    last_active_date: {
      type: "date",
      notNull: true,
      default: pgm.func("current_date"),
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  // Primary Key & Index
  pgm.addConstraint(
    "user_streaks",
    "user_streaks_pkey",
    "PRIMARY KEY(user_id)"
  );
  pgm.createIndex("user_streaks", ["user_id"]);

  // -------------------------
  // 3️⃣ Trigger for updated_at
  // -------------------------
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trigger_user_activity_log_updated_at
    BEFORE UPDATE ON user_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER trigger_user_streaks_updated_at
    BEFORE UPDATE ON user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS trigger_user_activity_log_updated_at ON user_activity_log;
    DROP TRIGGER IF EXISTS trigger_user_streaks_updated_at ON user_streaks;
    DROP FUNCTION IF EXISTS update_updated_at_column;
  `);

  pgm.dropTable("user_lessons");
  pgm.dropTable("user_modules");
  pgm.dropTable("user_courses");
  pgm.dropTable("user_learning_paths");
  pgm.dropType("progress_status");
  pgm.dropTable("user_activity_log");
  pgm.dropTable("user_streaks");
};
