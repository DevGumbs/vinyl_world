const { db } = require("./db");
const { sampleRecords } = require("./sampleRecords");

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

module.exports = { seedRecordsIfEmpty };

