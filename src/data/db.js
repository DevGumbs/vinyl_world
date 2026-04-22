const path = require("path");
const Database = require("better-sqlite3");

const dbFile = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.resolve(__dirname, "vinyl_world.db");

const db = new Database(dbFile);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

module.exports = { db, dbFile };

