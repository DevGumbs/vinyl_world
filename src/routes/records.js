const express = require("express");
const { db } = require("../data/db");

const router = express.Router();

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
