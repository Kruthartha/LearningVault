/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // We assume the timestamp trigger function 'trigger_set_timestamp' was created in a previous migration.

  // --- 1. CREATE CORE CONTENT TABLES ---

  pgm.createTable("learning_paths", {
    path_id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: { type: "varchar(255)", notNull: true },
    description: { type: "text" },
    status: { type: "varchar(50)", notNull: true, default: "draft" },
    author_id: {
      type: "uuid",
      references: '"studio_users"(id)',
      onDelete: "set null",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createTrigger("learning_paths", "set_timestamp_paths", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  pgm.createTable("courses", {
    course_id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: { type: "varchar(255)", notNull: true },
    description: { type: "text" },
    status: { type: "varchar(50)", notNull: true, default: "draft" },
    author_id: {
      type: "uuid",
      references: '"studio_users"(id)',
      onDelete: "set null",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createTrigger("courses", "set_timestamp_courses", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  pgm.createTable("lessons", {
    lesson_id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: { type: "varchar(255)", notNull: true },
    description: { type: "text" },
    status: { type: "varchar(50)", notNull: true, default: "draft" },
    author_id: {
      type: "uuid",
      references: '"studio_users"(id)',
      onDelete: "set null",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createTrigger("lessons", "set_timestamp_lessons", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  // --- 2. CREATE DEPENDENT & JUNCTION TABLES ---

  pgm.createTable("lesson_steps", {
    step_id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    lesson_id: {
      type: "uuid",
      notNull: true,
      references: '"lessons"(lesson_id)',
      onDelete: "cascade",
    },
    step_order: { type: "integer", notNull: true },
    title: { type: "varchar(255)" },
    bits: { type: "jsonb", notNull: true },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.createTrigger("lesson_steps", "set_timestamp_steps", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  // CORRECTED SYNTAX FOR `path_courses`
  pgm.createTable(
    "path_courses",
    {
      learning_path_id: {
        type: "uuid",
        notNull: true,
        references: '"learning_paths"(path_id)',
        onDelete: "cascade",
      },
      course_id: {
        type: "uuid",
        notNull: true,
        references: '"courses"(course_id)',
        onDelete: "cascade",
      },
      order_in_path: { type: "integer", notNull: true },
    },
    {
      constraints: {
        primaryKey: ["learning_path_id", "course_id"],
      },
    }
  );

  // CORRECTED SYNTAX FOR `course_lessons`
  pgm.createTable(
    "course_lessons",
    {
      course_id: {
        type: "uuid",
        notNull: true,
        references: '"courses"(course_id)',
        onDelete: "cascade",
      },
      lesson_id: {
        type: "uuid",
        notNull: true,
        references: '"lessons"(lesson_id)',
        onDelete: "cascade",
      },
      order_in_course: { type: "integer", notNull: true },
    },
    {
      constraints: {
        primaryKey: ["course_id", "lesson_id"],
      },
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop tables in the exact reverse order of creation
  pgm.dropTable("course_lessons");
  pgm.dropTable("path_courses");
  pgm.dropTable("lesson_steps");
  pgm.dropTable("lessons");
  pgm.dropTable("courses");
  pgm.dropTable("learning_paths");
};
