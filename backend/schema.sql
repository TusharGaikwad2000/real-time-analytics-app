
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  platform TEXT,
  action TEXT,
  amount INT,
  timestamp BIGINT
);

CREATE TABLE metrics (
  platform TEXT PRIMARY KEY,
  total_events INT,
  total_revenue INT
);

CREATE TABLE user_totals (
  user_id TEXT,
  platform TEXT,
  total_amount INT,
  PRIMARY KEY(user_id, platform)
);
