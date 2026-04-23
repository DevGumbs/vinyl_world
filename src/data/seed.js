const { db } = require("./db");
const { sampleRecords } = require("./sampleRecords");

const TOPICS = [
  { id: "topic_new_releases", name: "New releases", sortOrder: 10 },
  { id: "topic_general_discussion", name: "General discussion", sortOrder: 20 },
  {
    id: "topic_record_care_cleaning",
    name: "Record care & cleaning",
    sortOrder: 30,
  },
  { id: "topic_buying_advice", name: "Buying advice", sortOrder: 40 },
  { id: "topic_trades", name: "Trades", sortOrder: 50 },
  { id: "topic_genres", name: "Genres", sortOrder: 60 },
  { id: "topic_equipment_gear", name: "Equipment & gear", sortOrder: 70 },
  {
    id: "topic_pressings_reissues",
    name: "Pressings & reissues",
    sortOrder: 80,
  },
  { id: "topic_setups_displays", name: "Setups & displays", sortOrder: 90 },
];

const GENRE_SUBTOPICS = [
  { id: "genre_rock", name: "Rock" },
  { id: "genre_hip_hop", name: "Hip-Hop" },
  { id: "genre_pop", name: "Pop" },
  { id: "genre_electronic", name: "Electronic" },
  { id: "genre_jazz", name: "Jazz" },
  { id: "genre_reggae", name: "Reggae" },
  { id: "genre_metal", name: "Metal" },
  { id: "genre_classical", name: "Classical" },
  { id: "genre_other", name: "Other" },
];

function ensureTopics() {
  const insert = db.prepare(
    `
    INSERT OR IGNORE INTO topics (id, name, parent_id, sort_order)
    VALUES (?, ?, ?, ?)
  `
  );

  const tx = db.transaction(() => {
    for (const t of TOPICS) {
      insert.run(t.id, t.name, null, t.sortOrder);
    }
    for (let i = 0; i < GENRE_SUBTOPICS.length; i++) {
      const g = GENRE_SUBTOPICS[i];
      insert.run(g.id, g.name, "topic_genres", 100 + i);
    }

    const allowedGenreIds = GENRE_SUBTOPICS.map((g) => g.id);
    const placeholders = allowedGenreIds.map(() => "?").join(",");
    db.prepare(
      `DELETE FROM topics WHERE parent_id = 'topic_genres' AND id NOT IN (${placeholders})`
    ).run(...allowedGenreIds);
  });

  tx();
}

function seedRecordsIfEmpty() {
  const row = db.prepare("SELECT COUNT(*) AS c FROM records").get();
  if (row.c > 0) return { seeded: false, count: row.c };

  const insert = db.prepare(`
    INSERT INTO records (
      id,
      album_title,
      artist_name,
      year,
      genre,
      vinyl_condition,
      is_for_trade,
      owner_username
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((records) => {
    for (const r of records) {
      insert.run(
        r.id,
        r.albumTitle,
        r.artistName,
        r.year,
        r.genre,
        r.vinylCondition,
        r.isForTrade ? 1 : 0,
        r.ownerUsername
      );
    }
  });

  tx(sampleRecords);
  return { seeded: true, count: sampleRecords.length };
}

module.exports = { seedRecordsIfEmpty, ensureTopics };

