require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const SQLiteStoreFactory = require("connect-sqlite3");
const bcrypt = require("bcryptjs");
const { db } = require("./data/db");
const { migrate } = require("./data/migrate");
const { seedRecordsIfEmpty } = require("./data/seed");
const { recordsRouter } = require("./routes/records");

const app = express();

try {
  migrate();
  seedRecordsIfEmpty();
} catch (e) {
  console.error("Failed to initialize database", e);
  process.exit(1);
}

const corsOrigin =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

const SQLiteStore = SQLiteStoreFactory(session);

app.use(
  session({
    name: "vinyl_world_session",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
      dir: __dirname + "/data",
      db: "sessions.db",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

function safeUser(u) {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    city: u.city,
    state: u.state,
  };
}

app.get("/auth/me", (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ user: null });
  return res.json({ user });
});

app.post("/auth/register", async (req, res) => {
  const { email, username, password, city, state } = req.body || {};

  const emailStr = typeof email === "string" ? email.trim().toLowerCase() : "";
  const usernameStr = typeof username === "string" ? username.trim() : "";
  const passwordStr = typeof password === "string" ? password : "";
  const cityStr = typeof city === "string" ? city.trim() : "";
  const stateStr = typeof state === "string" ? state.trim() : "";

  if (!emailStr || !usernameStr || !passwordStr || !cityStr || !stateStr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1")
    .get(emailStr, usernameStr);
  if (existing) {
    return res
      .status(409)
      .json({ error: "Email or username already registered" });
  }

  const passwordHash = await bcrypt.hash(passwordStr, 10);
  const user = {
    id: `usr_${Date.now()}`,
    email: emailStr,
    username: usernameStr,
    city: cityStr,
    state: stateStr,
    passwordHash,
  };

  db.prepare(
    `
    INSERT INTO users (
      id,
      email,
      username,
      password_hash,
      city,
      state
    ) VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    user.id,
    user.email,
    user.username,
    user.passwordHash,
    user.city,
    user.state
  );

  const safe = safeUser(user);
  req.session.user = safe;
  return res.status(201).json({ user: safe });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  const emailStr = typeof email === "string" ? email.trim().toLowerCase() : "";
  const passwordStr = typeof password === "string" ? password : "";

  if (!emailStr || !passwordStr) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const user = db
    .prepare(
      `
      SELECT
        id,
        email,
        username,
        password_hash AS passwordHash,
        city,
        state
      FROM users
      WHERE email = ?
      LIMIT 1
    `
    )
    .get(emailStr);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(passwordStr, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const safe = safeUser(user);
  req.session.user = safe;
  return res.json({ user: safe });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("vinyl_world_session");
    res.json({ ok: true });
  });
});

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
  console.log(`Vinyl World API listening on http://localhost:${port}`);
});

