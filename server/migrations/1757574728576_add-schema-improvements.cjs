/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // 1. Add indexes
  pgm.createIndex("lesson_steps", ["lesson_id", "step_order"]);
  pgm.createIndex("course_lessons", ["course_id", "order_in_course"]);
  pgm.createIndex("path_courses", ["learning_path_id", "order_in_path"]);

  // 2. ENUM type
  pgm.createType("content_status", ["draft", "published", "archived"]);

  // Learning Paths
  pgm.alterColumn("learning_paths", "status", { default: null }); // drop default
  pgm.alterColumn("learning_paths", "status", {
    type: "content_status",
    using: "status::content_status",
  });
  pgm.alterColumn("learning_paths", "status", { default: "draft", notNull: true });

  // Courses
  pgm.alterColumn("courses", "status", { default: null });
  pgm.alterColumn("courses", "status", {
    type: "content_status",
    using: "status::content_status",
  });
  pgm.alterColumn("courses", "status", { default: "draft", notNull: true });

  // Lessons
  pgm.alterColumn("lessons", "status", { default: null });
  pgm.alterColumn("lessons", "status", {
    type: "content_status",
    using: "status::content_status",
  });
  pgm.alterColumn("lessons", "status", { default: "draft", notNull: true });

  // 3. Add version
  pgm.addColumn("lessons", {
    version: { type: "integer", notNull: true, default: 1 },
  });

  // 4. Progress tracking
  pgm.createTable("user_lesson_progress", {
    user_id: { type: "uuid", notNull: true },
    lesson_id: {
      type: "uuid",
      notNull: true,
      references: '"lessons"(lesson_id)',
      onDelete: "cascade",
    },
    step_id: {
      type: "uuid",
      notNull: true,
      references: '"lesson_steps"(step_id)',
      onDelete: "cascade",
    },
    start_time: { type: "timestamptz" },
    end_time: { type: "timestamptz" },
    duration_sec: { type: "integer" },
    completed: { type: "boolean", default: false },
  });
  pgm.addConstraint("user_lesson_progress", "user_step_pk", {
    primaryKey: ["user_id", "step_id"],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("user_lesson_progress");
  pgm.dropColumn("lessons", "version");

  // revert ENUM back to varchar
  pgm.alterColumn("lessons", "status", { default: null });
  pgm.alterColumn("lessons", "status", { type: "varchar(50)" });
  pgm.alterColumn("lessons", "status", { default: "draft", notNull: true });

  pgm.alterColumn("courses", "status", { default: null });
  pgm.alterColumn("courses", "status", { type: "varchar(50)" });
  pgm.alterColumn("courses", "status", { default: "draft", notNull: true });

  pgm.alterColumn("learning_paths", "status", { default: null });
  pgm.alterColumn("learning_paths", "status", { type: "varchar(50)" });
  pgm.alterColumn("learning_paths", "status", { default: "draft", notNull: true });

  pgm.dropType("content_status");
  pgm.dropIndex("path_courses", ["learning_path_id", "order_in_path"]);
  pgm.dropIndex("course_lessons", ["course_id", "order_in_course"]);
  pgm.dropIndex("lesson_steps", ["lesson_id", "step_order"]);
};