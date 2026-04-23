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

  CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE(name, parent_id),
    FOREIGN KEY(parent_id) REFERENCES topics(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_username TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    subject_type TEXT NOT NULL CHECK (subject_type IN ('artist', 'album')),
    subject_name TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_username TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
  );
`);

try {
  db.exec(`ALTER TABLE posts ADD COLUMN image_url TEXT`);
} catch {}

module.exports = { migrate: () => undefined };

