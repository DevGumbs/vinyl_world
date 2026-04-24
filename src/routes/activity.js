const express = require("express");
const { db } = require("../data/db");

const router = express.Router();

function parseTime(value) {
  if (value == null) return 0;
  const t = new Date(String(value).replace(" ", "T")).getTime();
  return Number.isFinite(t) ? t : 0;
}

router.get("/", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const username = String(req.session.user.username);
  const cap = 15;

  const postCreated = db
    .prepare(
      `
      SELECT created_at AS createdAt, id AS postId, title AS postTitle
      FROM posts
      WHERE author_username = ?
      ORDER BY datetime(created_at) DESC
      LIMIT ?
    `
    )
    .all(username, cap)
    .map((r) => ({ kind: "post_created", ...r }));

  const recordAdded = db
    .prepare(
      `
      SELECT created_at AS createdAt, id AS recordId, album_title AS albumTitle, artist_name AS artistName
      FROM records
      WHERE owner_username = ?
      ORDER BY datetime(created_at) DESC
      LIMIT ?
    `
    )
    .all(username, cap)
    .map((r) => ({ kind: "record_added", ...r }));

  const postCommented = db
    .prepare(
      `
      SELECT c.created_at AS createdAt, p.id AS postId, p.title AS postTitle
      FROM comments c
      JOIN posts p ON p.id = c.post_id
      WHERE c.author_username = ?
      ORDER BY datetime(c.created_at) DESC
      LIMIT ?
    `
    )
    .all(username, cap)
    .map((r) => ({ kind: "post_commented", ...r }));

  const tradeListed = db
    .prepare(
      `
      SELECT listed_for_trade_at AS createdAt, id AS recordId, album_title AS albumTitle, artist_name AS artistName
      FROM records
      WHERE owner_username = ? AND listed_for_trade_at IS NOT NULL
      ORDER BY datetime(listed_for_trade_at) DESC
      LIMIT ?
    `
    )
    .all(username, cap)
    .map((r) => ({ kind: "trade_listed", ...r }));

  const tradeCommented = db
    .prepare(
      `
      SELECT tlc.created_at AS createdAt, r.id AS recordId, r.album_title AS albumTitle, r.owner_username AS listingOwnerUsername
      FROM trade_listing_comments tlc
      JOIN records r ON r.id = tlc.record_id
      WHERE tlc.author_username = ?
      ORDER BY datetime(tlc.created_at) DESC
      LIMIT ?
    `
    )
    .all(username, cap)
    .map((r) => ({ kind: "trade_commented", ...r }));

  const postCommentReceived = db
    .prepare(
      `
      SELECT c.created_at AS createdAt, p.id AS postId, p.title AS postTitle, c.author_username AS actorUsername
      FROM comments c
      JOIN posts p ON p.id = c.post_id
      WHERE p.author_username = ? AND c.author_username != ?
      ORDER BY datetime(c.created_at) DESC
      LIMIT ?
    `
    )
    .all(username, username, cap)
    .map((r) => ({ kind: "post_comment_received", ...r }));

  const tradeCommentReceived = db
    .prepare(
      `
      SELECT tlc.created_at AS createdAt, r.id AS recordId, r.album_title AS albumTitle, tlc.author_username AS actorUsername
      FROM trade_listing_comments tlc
      JOIN records r ON r.id = tlc.record_id
      WHERE r.owner_username = ? AND tlc.author_username != ?
      ORDER BY datetime(tlc.created_at) DESC
      LIMIT ?
    `
    )
    .all(username, username, cap)
    .map((r) => ({ kind: "trade_comment_received", ...r }));

  const merged = [
    ...postCreated,
    ...recordAdded,
    ...postCommented,
    ...tradeListed,
    ...tradeCommented,
    ...postCommentReceived,
    ...tradeCommentReceived,
  ];

  merged.sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt));

  return res.json({ items: merged.slice(0, 3) });
});

module.exports = { activityRouter: router };
