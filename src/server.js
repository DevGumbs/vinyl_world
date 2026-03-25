const express = require("express");
const cors = require("cors");
const { recordsRouter } = require("./routes/records");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Vinyl World API",
    health: "/health",
    records: "/api/records",
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/records", recordsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Vinyl World API listening on http://localhost:${port}`);
});

