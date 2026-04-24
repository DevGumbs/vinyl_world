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
      cb(null, `cover_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === "image/png" || file.mimetype === "image/jpeg";
    cb(ok ? null : new Error("Only PNG and JPG images are allowed"), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/me/summary", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const username = String(req.session.user.username);
  const row = db
    .prepare(
      `SELECT COUNT(*) AS c FROM records WHERE owner_username = ?`
    )
    .get(username);
  return res.json({ count: Number(row.c) });
});

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        id,
        album_title AS albumTitle,
        artist_name AS artistName,
        year,
        genre,
        cover_image_url AS coverImg,
        vinyl_condition AS vinylCondition,
        is_for_trade AS isForTrade,
        owner_username AS ownerUsername
      FROM records
      ORDER BY id
    `
    )
    .all();

  res.json(
    rows.map((r) => ({
      ...r,
      isForTrade: Boolean(r.isForTrade),
    }))
  );
});

router.get("/trades", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        id,
        album_title AS albumTitle,
        artist_name AS artistName,
        year,
        genre,
        cover_image_url AS coverImg,
        vinyl_condition AS vinylCondition,
        is_for_trade AS isForTrade,
        owner_username AS ownerUsername
      FROM records
      WHERE is_for_trade = 1
      ORDER BY id
    `
    )
    .all();

  res.json(
    rows.map((r) => ({
      ...r,
      isForTrade: Boolean(r.isForTrade),
    }))
  );
});

router.post("/trades/list", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const username = String(req.session.user.username);
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    return res.status(400).json({ error: "No records selected" });
  }

  const allowed = new Set(["N", "VG", "G", "P"]);
  const normalized = items
    .map((it) => ({
      recordId: typeof it?.recordId === "string" ? it.recordId.trim() : "",
      condition: typeof it?.condition === "string" ? it.condition.trim() : "",
    }))
    .filter((it) => it.recordId && allowed.has(it.condition));

  if (normalized.length === 0) {
    return res.status(400).json({ error: "Invalid selection" });
  }

  const update = db.prepare(
    `
    UPDATE records
    SET is_for_trade = 1, vinyl_condition = ?
    WHERE id = ? AND owner_username = ?
  `
  );

  const tx = db.transaction((rows) => {
    let updated = 0;
    for (const r of rows) {
      const info = update.run(r.condition, r.recordId, username);
      updated += info.changes || 0;
    }
    return updated;
  });

  const updated = tx(normalized);
  return res.json({ ok: true, updated });
});

router.post("/", upload.single("cover"), (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { albumTitle, artistName, year, genre, vinylCondition } = req.body || {};
  const albumTitleStr = typeof albumTitle === "string" ? albumTitle.trim() : "";
  const artistNameStr = typeof artistName === "string" ? artistName.trim() : "";
  const genreStr = typeof genre === "string" ? genre.trim() : "";
  const yearNum = Number(year);
  const vinylConditionStr =
    typeof vinylCondition === "string" && vinylCondition.trim()
      ? vinylCondition.trim()
      : "VG";

  if (!albumTitleStr || !artistNameStr || !genreStr || !Number.isFinite(yearNum)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = `rec_${Date.now()}`;
  const ownerUsername = String(req.session.user.username);
  const coverImg = req.file ? `/uploads/${req.file.filename}` : null;

  db.prepare(
    `
    INSERT INTO records (
      id,
      album_title,
      artist_name,
      year,
      genre,
      created_at,
      cover_image_url,
      vinyl_condition,
      is_for_trade,
      owner_username
    ) VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?, 0, ?)
  `
  ).run(
    id,
    albumTitleStr,
    artistNameStr,
    yearNum,
    genreStr,
    coverImg,
    vinylConditionStr,
    ownerUsername
  );

  return res.status(201).json({ id });
});

router.put("/:id", upload.single("cover"), (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id = String(req.params.id);
  const username = String(req.session.user.username);

  const existing = db
    .prepare(`SELECT id FROM records WHERE id = ? AND owner_username = ? LIMIT 1`)
    .get(id, username);
  if (!existing) return res.status(404).json({ error: "Record not found" });

  const { albumTitle, artistName, year, genre, vinylCondition } = req.body || {};
  const albumTitleStr = typeof albumTitle === "string" ? albumTitle.trim() : "";
  const artistNameStr = typeof artistName === "string" ? artistName.trim() : "";
  const genreStr = typeof genre === "string" ? genre.trim() : "";
  const yearNum = Number(year);
  const vinylConditionStr =
    typeof vinylCondition === "string" && vinylCondition.trim()
      ? vinylCondition.trim()
      : "VG";

  if (!albumTitleStr || !artistNameStr || !genreStr || !Number.isFinite(yearNum)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const coverImg = req.file ? `/uploads/${req.file.filename}` : null;
  if (coverImg) {
    db.prepare(
      `
      UPDATE records
      SET album_title = ?, artist_name = ?, year = ?, genre = ?, vinyl_condition = ?, cover_image_url = ?
      WHERE id = ? AND owner_username = ?
    `
    ).run(
      albumTitleStr,
      artistNameStr,
      yearNum,
      genreStr,
      vinylConditionStr,
      coverImg,
      id,
      username
    );
  } else {
    db.prepare(
      `
      UPDATE records
      SET album_title = ?, artist_name = ?, year = ?, genre = ?, vinyl_condition = ?
      WHERE id = ? AND owner_username = ?
    `
    ).run(
      albumTitleStr,
      artistNameStr,
      yearNum,
      genreStr,
      vinylConditionStr,
      id,
      username
    );
  }

  return res.json({ ok: true });
});

router.get("/user/:username/stats", (req, res) => {
  const username = String(req.params.username);

  const totalRow = db
    .prepare(`SELECT COUNT(*) AS c FROM records WHERE owner_username = ?`)
    .get(username);
  const totalRecords = Number(totalRow?.c ?? 0);

  const tradeRow = db
    .prepare(
      `SELECT COUNT(*) AS c FROM records WHERE owner_username = ? AND is_for_trade = 1`
    )
    .get(username);
  const recordsForTrade = Number(tradeRow?.c ?? 0);

  const uniqueArtistsRow = db
    .prepare(
      `SELECT COUNT(DISTINCT artist_name) AS c FROM records WHERE owner_username = ?`
    )
    .get(username);
  const uniqueArtists = Number(uniqueArtistsRow?.c ?? 0);

  const distinctGenresRow = db
    .prepare(
      `SELECT COUNT(DISTINCT genre) AS c FROM records WHERE owner_username = ?`
    )
    .get(username);
  const distinctGenres = Number(distinctGenresRow?.c ?? 0);

  const spanRow = db
    .prepare(
      `SELECT MIN(year) AS minYear, MAX(year) AS maxYear FROM records WHERE owner_username = ?`
    )
    .get(username);
  const minYear = spanRow?.minYear != null ? Number(spanRow.minYear) : null;
  const maxYear = spanRow?.maxYear != null ? Number(spanRow.maxYear) : null;

  const recent = db
    .prepare(
      `
      SELECT
        album_title AS albumTitle,
        artist_name AS artistName,
        year,
        created_at AS createdAt
      FROM records
      WHERE owner_username = ?
      ORDER BY datetime(created_at) DESC, id DESC
      LIMIT 1
    `
    )
    .get(username);

  function topWithTie(sql, params) {
    const rows = db.prepare(sql).all(...params);
    if (!rows || rows.length === 0) return null;
    const top = rows[0];
    const second = rows[1];
    if (second && Number(second.c) === Number(top.c)) return null;
    return String(top.name);
  }

  const mostCollectedArtist = topWithTie(
    `
    SELECT artist_name AS name, COUNT(*) AS c
    FROM records
    WHERE owner_username = ?
    GROUP BY artist_name
    ORDER BY c DESC, name ASC
    LIMIT 2
  `,
    [username]
  );

  const mostCollectedGenre = topWithTie(
    `
    SELECT genre AS name, COUNT(*) AS c
    FROM records
    WHERE owner_username = ?
    GROUP BY genre
    ORDER BY c DESC, name ASC
    LIMIT 2
  `,
    [username]
  );

  const mostCollectedEra = (() => {
    const rows = db
      .prepare(
        `
        SELECT ((year / 10) * 10) AS decade, COUNT(*) AS c
        FROM records
        WHERE owner_username = ?
        GROUP BY decade
        ORDER BY c DESC, decade ASC
        LIMIT 2
      `
      )
      .all(username);
    if (!rows || rows.length === 0) return null;
    const top = rows[0];
    const second = rows[1];
    if (second && Number(second.c) === Number(top.c)) return null;
    const decade = Number(top.decade);
    if (!Number.isFinite(decade)) return null;
    return `${decade}s`;
  })();

  res.json({
    totalRecords,
    mostCollectedArtist,
    mostCollectedGenre,
    mostCollectedEra,
    collectionSpan: minYear != null && maxYear != null ? { minYear, maxYear } : null,
    mostRecentAddition: recent
      ? {
          albumTitle: String(recent.albumTitle),
          artistName: String(recent.artistName),
          year: Number(recent.year),
          createdAt: String(recent.createdAt),
        }
      : null,
    uniqueArtists,
    distinctGenres,
    recordsForTrade,
  });
});

router.get("/user/:username", (req, res) => {
  const username = String(req.params.username);
  const rows = db
    .prepare(
      `
      SELECT
        id,
        album_title AS albumTitle,
        artist_name AS artistName,
        year,
        genre,
        cover_image_url AS coverImg,
        vinyl_condition AS vinylCondition,
        is_for_trade AS isForTrade,
        owner_username AS ownerUsername
      FROM records
      WHERE owner_username = ?
      ORDER BY id
    `
    )
    .all(username);

  res.json(
    rows.map((r) => ({
      ...r,
      isForTrade: Boolean(r.isForTrade),
    }))
  );
});

router.get("/:id", (req, res) => {
  const record = db
    .prepare(
      `
      SELECT
        id,
        album_title AS albumTitle,
        artist_name AS artistName,
        year,
        genre,
        cover_image_url AS coverImg,
        vinyl_condition AS vinylCondition,
        is_for_trade AS isForTrade,
        owner_username AS ownerUsername
      FROM records
      WHERE id = ?
      LIMIT 1
    `
    )
    .get(String(req.params.id));

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  return res.json({ ...record, isForTrade: Boolean(record.isForTrade) });
});

module.exports = { recordsRouter: router };
