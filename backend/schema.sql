CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL CHECK(length(nickname) BETWEEN 2 AND 16),
  score INTEGER NOT NULL CHECK(score >= 0),
  level INTEGER NOT NULL CHECK(level >= 1),
  lines INTEGER NOT NULL CHECK(lines >= 0),
  tetrises INTEGER NOT NULL DEFAULT 0 CHECK(tetrises >= 0),
  tspins INTEGER NOT NULL DEFAULT 0 CHECK(tspins >= 0),
  perfect_clears INTEGER NOT NULL DEFAULT 0 CHECK(perfect_clears >= 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scores_leaderboard
  ON scores(score DESC, created_at ASC);
