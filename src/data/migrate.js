const { db } = require("./db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    album_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    genre TEXT NOT NULL,
    vinyl_condition TEXT NOT NULL,
    is_for_trade INTEGER NOT NULL DEFAULT 0,
    owner_username TEXT NOT NULL
  );
`);

module.exports = { migrate: () => undefined };

