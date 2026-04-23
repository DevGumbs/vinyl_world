const express = require("express");
const { db } = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT id, name, parent_id AS parentId, sort_order AS sortOrder
      FROM topics
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all();

  res.json(rows);
});

router.get("/summary", (req, res) => {
  const topics = db
    .prepare(
      `
      SELECT id, name, parent_id AS parentId, sort_order AS sortOrder
      FROM topics
      ORDER BY sort_order ASC, name ASC
    `
    )
    .all();

  const counts = db
    .prepare(
      `
      SELECT topic_id AS topicId, COUNT(*) AS c
      FROM posts
      GROUP BY topic_id
    `
    )
    .all();

  const countById = new Map(counts.map((r) => [r.topicId, Number(r.c)]));

  const byParent = new Map();
  for (const t of topics) {
    const key = t.parentId ?? "__root__";
    const list = byParent.get(key) ?? [];
    list.push(t);
    byParent.set(key, list);
  }

  function buildNode(t) {
    const children = (byParent.get(t.id) ?? []).map(buildNode);
    const selfCount = countById.get(t.id) ?? 0;
    const count = selfCount + children.reduce((sum, c) => sum + c.count, 0);
    return {
      id: t.id,
      name: t.name,
      parentId: t.parentId,
      sortOrder: t.sortOrder,
      count,
      children,
    };
  }

  const roots = (byParent.get("__root__") ?? []).map(buildNode);
  res.json({ topics: roots });
});

module.exports = { topicsRouter: router };

