// migrations/xxxx_insert_problems.js
const problemsData = require("../data/problemsData.json");

exports.up = async (pgm) => {
  // Loop over each problem
  for (const key of Object.keys(problemsData)) {
    const p = problemsData[key];

    await pgm.db.query(
      `INSERT INTO problems
        (id, slug, title, difficulty, category, acceptance, likes, dislikes, premium, tags, companies, description, examples, constraints, follow_up, starter_code, test_cases)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12,$13::jsonb,$14::jsonb,$15,$16,$17::jsonb)
       ON CONFLICT (id) DO NOTHING;`,
      [
        p.id,
        p.slug,
        p.title,
        p.difficulty,
        p.category || null,
        p.acceptance || null,
        p.likes || 0,
        p.dislikes || 0,
        p.premium || false,
        JSON.stringify(p.tags || []),
        JSON.stringify(p.companies || []),
        p.description || null,
        JSON.stringify(p.examples || []),
        JSON.stringify(p.constraints || []),
        p.followUp || null,
        p.starterCode || null,
        JSON.stringify(p.publicTestCases || p.testCases || []),
      ]
    );
  }
};

exports.down = async (pgm) => {
  await pgm.db.query("DELETE FROM problems;");
};
