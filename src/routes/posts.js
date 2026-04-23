const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { db } = require("../data/db");

const router = express.Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `post_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === "image/png" || file.mimetype === "image/jpeg";
    cb(ok ? null : new Error("Only PNG and JPG images are allowed"), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        p.id,
        p.author_username AS authorUsername,
        p.title,
        t.name AS topicName,
        p.created_at AS createdAt,
        COUNT(c.id) AS commentCount
      FROM posts p
      JOIN topics t ON t.id = p.topic_id
      LEFT JOIN comments c ON c.post_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `
    )
    .all();

  res.json(rows.map((r) => ({ ...r, commentCount: Number(r.commentCount) })));
});

router.get("/:id", (req, res) => {
  const id = String(req.params.id);
  const row = db
    .prepare(
      `
      SELECT
        p.id,
        p.author_username AS authorUsername,
        p.title,
        p.body,
        p.image_url AS imageUrl,
        p.created_at AS createdAt,
        t.name AS topicName
      FROM posts p
      JOIN topics t ON t.id = p.topic_id
      WHERE p.id = ?
      LIMIT 1
    `
    )
    .get(id);

  if (!row) return res.status(404).json({ error: "Post not found" });
  return res.json(row);
});

router.get("/:id/comments", (req, res) => {
  const id = String(req.params.id);
  const rows = db
    .prepare(
      `
      SELECT
        id,
        author_username AS authorUsername,
        body,
        created_at AS createdAt
      FROM comments
      WHERE post_id = ?
      ORDER BY created_at ASC
    `
    )
    .all(id);

  res.json(rows);
});

router.post("/:id/comments", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const postId = String(req.params.id);
  const { body } = req.body || {};
  const bodyStr = typeof body === "string" ? body.trim() : "";
  if (!bodyStr) return res.status(400).json({ error: "Missing comment body" });

  const post = db.prepare("SELECT id FROM posts WHERE id = ? LIMIT 1").get(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const id = `cmt_${Date.now()}`;
  const authorUsername = String(req.session.user.username);
  db.prepare(
    `
    INSERT INTO comments (id, post_id, author_username, body)
    VALUES (?, ?, ?, ?)
  `
  ).run(id, postId, authorUsername, bodyStr);

  return res.status(201).json({ id });
});

router.post("/", upload.single("image"), (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { topicId, title, body } = req.body || {};

  const topicIdStr = typeof topicId === "string" ? topicId.trim() : "";
  const titleStr = typeof title === "string" ? title.trim() : "";
  const bodyStr = typeof body === "string" ? body.trim() : "";

  if (!topicIdStr || !titleStr || !bodyStr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const topic = db
    .prepare("SELECT id FROM topics WHERE id = ? LIMIT 1")
    .get(topicIdStr);
  if (!topic) return res.status(400).json({ error: "Invalid topic" });

  const id = `post_${Date.now()}`;
  const authorUsername = String(req.session.user.username);
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.prepare(
    `
    INSERT INTO posts (
      id,
      author_username,
      topic_id,
      title,
      body,
      image_url,
      subject_type,
      subject_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    id,
    authorUsername,
    topicIdStr,
    titleStr,
    bodyStr,
    imageUrl,
    "artist",
    titleStr
  );

  return res.status(201).json({ id });
});

module.exports = { postsRouter: router };

