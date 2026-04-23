const express = require("express");
const { db } = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  const isAuthed = Boolean(req.session && req.session.user);
  const username = isAuthed ? String(req.session.user.username) : null;

  const block1 = db
    .prepare(
      `
      SELECT
        p.subject_type AS subjectType,
        p.subject_name AS subjectName,
        t.name AS topicName,
        COUNT(*) AS threadCount
      FROM posts p
      JOIN topics t ON t.id = p.topic_id
      GROUP BY p.subject_type, p.subject_name, p.topic_id
      HAVING COUNT(*) >= 2
      ORDER BY threadCount DESC
      LIMIT 3
    `
    )
    .all();

  const block2 = db
    .prepare(
      `
      SELECT
        p.subject_type AS subjectType,
        p.subject_name AS subjectName,
        t.name AS topicName,
        p.created_at AS createdAt
      FROM posts p
      JOIN topics t ON t.id = p.topic_id
      ORDER BY p.created_at DESC
      LIMIT 3
    `
    )
    .all();

  let block3 = [];
  let mode = "public";

  if (!isAuthed) {
    block3 = db
      .prepare(
        `
        SELECT
          'artist' AS subjectType,
          artist_name AS subjectName,
          COUNT(DISTINCT owner_username) AS collectionCount
        FROM records
        GROUP BY artist_name
        ORDER BY collectionCount DESC, subjectName ASC
        LIMIT 3
      `
      )
      .all();
  } else {
    mode = "private";
    block3 = db
      .prepare(
        `
        WITH my_artists AS (
          SELECT DISTINCT artist_name AS artistName
          FROM records
          WHERE owner_username = ?
        ),
        others AS (
          SELECT
            r.owner_username AS otherUsername,
            r.artist_name AS artistName
          FROM records r
          JOIN my_artists m ON m.artistName = r.artist_name
          WHERE r.owner_username <> ?
        )
        SELECT
          'artist' AS subjectType,
          artistName AS subjectName,
          otherUsername,
          COUNT(*) AS sharedCount
        FROM others
        GROUP BY otherUsername, artistName
        ORDER BY sharedCount DESC, subjectName ASC
        LIMIT 3
      `
      )
      .all(username, username);
  }

  res.json({ mode, block1, block2, block3 });
});

module.exports = { discoverRouter: router };

