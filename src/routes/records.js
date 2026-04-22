const express = require("express");
const { db } = require("../data/db");

const router = express.Router();

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
