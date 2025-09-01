const pool = require("./db");

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  console.log("Database initialized");
  process.exit(0);
}

init().catch(err => {
  console.error("DB initialization failed:", err);
  process.exit(1);
});

