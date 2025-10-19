/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create problems table
  pgm.createTable("problems", {
    id: "id",
    slug: { type: "varchar(100)", notNull: true, unique: true },
    title: { type: "varchar(255)", notNull: true },
    difficulty: { type: "varchar(50)", notNull: true },
    category: { type: "varchar(100)" },
    acceptance: { type: "numeric(5,2)" },
    likes: { type: "integer", default: 0 },
    dislikes: { type: "integer", default: 0 },
    premium: { type: "boolean", default: false },
    description: { type: "text" },
    follow_up: { type: "text" },
    starter_code: { type: "text" },
    examples: { type: "jsonb", notNull: true, default: "[]" },
    constraints: { type: "jsonb", notNull: true, default: "[]" },
    tags: { type: "jsonb", notNull: true, default: "[]" },
    companies: { type: "jsonb", notNull: true, default: "[]" },
    test_cases: { type: "jsonb", notNull: true, default: "[]" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // Create user_problem_status table
  pgm.createTable("user_problem_status", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    problem_id: {
      type: "integer",
      notNull: true,
      references: "problems(id)",
      onDelete: "CASCADE",
    },
    status: { type: "varchar(20)", notNull: true, default: "not_started" },
    last_attempted_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Add GIN indexes for performance
  pgm.createIndex("problems", "tags", { using: "gin" });
  pgm.createIndex("problems", "companies", { using: "gin" });
  pgm.createIndex("problems", "difficulty");

  pgm.addConstraint("user_problem_status", "unique_user_problem", {
    unique: ["user_id", "problem_id"],
  });

  pgm.createIndex("user_problem_status", "user_id");
  pgm.createIndex("user_problem_status", "problem_id");

  // -------------------------
  // Trigger to auto-update updated_at
  // -------------------------
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  pgm.sql(`
    CREATE TRIGGER update_problems_updated_at
    BEFORE UPDATE ON problems
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("user_problem_status");
  pgm.dropTable("problems");
  pgm.sql(`DROP FUNCTION IF EXISTS update_updated_at_column();`);
};
