const express = require("express");
const { Pool } = require("pg");
const path = require("path");

require("dotenv").config();

const connectionString =
  process.env.NEONDB_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing database connection string. Set NEONDB_URL (or DATABASE_URL) before starting the server.",
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("Postgres pool error", err);
});

const staticPath = path.join(__dirname, "public");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(staticPath));

const LEADERBOARD_TABLE = "democrisis";

app.post("/api/leaderboard", async (req, res) => {
  const { username, elapsedMs } = req.body || {};
  const name = String(username || "").trim().slice(0, 64) || "Anonymous";
  const milliseconds = Number(elapsedMs);

  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return res.status(400).json({ error: "elapsedMs must be a non-negative number" });
  }

  try {
    const query = `
      INSERT INTO ${LEADERBOARD_TABLE} (username, time)
      VALUES ($1, to_timestamp($2::double precision / 1000.0))
      RETURNING id, username, time
    `;
    const { rows } = await pool.query(query, [name, milliseconds]);
    return res.status(201).json({ entry: rows[0] });
  } catch (error) {
    console.error("Failed to insert leaderboard entry", error);
    return res.status(500).json({ error: "Failed to save leaderboard entry" });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT
          id,
          username,
          EXTRACT(EPOCH FROM "time") * 1000 AS time
        FROM ${LEADERBOARD_TABLE}
        ORDER BY time ASC
      `,
    );
    return res.json({ entries: rows });
  } catch (error) {
    console.error("Failed to read leaderboard", error);
    return res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Leaderboard server listening on port ${port}`);
});
