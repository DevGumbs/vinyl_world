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
        album_title AS albumTitle,
        artist_name AS artistName,
        owner_username AS ownerUsername,
        created_at AS createdAt
      FROM records
      ORDER BY datetime(created_at) DESC, id DESC
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
          MAX(artist_name) AS subjectName,
          COUNT(DISTINCT owner_username) AS collectionCount
        FROM records
        WHERE TRIM(COALESCE(artist_name, '')) <> ''
        GROUP BY LOWER(TRIM(artist_name))
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
          SELECT DISTINCT LOWER(TRIM(artist_name)) AS artistKey
          FROM records
          WHERE owner_username = ?
            AND TRIM(COALESCE(artist_name, '')) <> ''
        ),
        others AS (
          SELECT
            r.owner_username AS otherUsername,
            r.artist_name AS artistName,
            LOWER(TRIM(r.artist_name)) AS artistKey
          FROM records r
          JOIN my_artists m ON m.artistKey = LOWER(TRIM(r.artist_name))
          WHERE r.owner_username <> ?
            AND TRIM(COALESCE(r.artist_name, '')) <> ''
        )
        SELECT
          'artist' AS subjectType,
          MAX(artistName) AS subjectName,
          otherUsername,
          COUNT(*) AS sharedCount
        FROM others
        GROUP BY otherUsername, artistKey
        ORDER BY sharedCount DESC, subjectName ASC
        LIMIT 3
      `
      )
      .all(username, username);
  }

  res.json({ mode, block1, block2, block3 });
});

module.exports = { discoverRouter: router };

