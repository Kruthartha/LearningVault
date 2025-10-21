/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_tasks", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    title: { type: "text", notNull: true },
    course: { type: "text" },
    date: { type: "timestamp", notNull: true },
    priority: { type: "text", default: "medium" },
    time: { type: "text" },
    status: { type: "text", default: "pending" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  pgm.createIndex("user_tasks", ["user_id", "date"]);
};

exports.down = (pgm) => {
  pgm.dropTable("user_tasks");
};