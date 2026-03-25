const express = require("express");
const { sampleRecords } = require("../data/sampleRecords");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(sampleRecords);
});

router.get("/trades", (req, res) => {
  res.json(sampleRecords.filter((record) => record.isForTrade));
});

router.get("/:id", (req, res) => {
  const record = sampleRecords.find((r) => r.id === String(req.params.id));
  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }
  return res.json(record);
});

module.exports = { recordsRouter: router };
