# Real-Time Analytics Platform

A production-style real-time analytics system built with Node.js, Sequelize (PostgreSQL), and React. This system ingests event data (views, clicks, purchases) and serves aggregated metrics with sub-millisecond read times.

## 🚀 Quick Start (Docker)

The easiest way to run the entire stack (Database + Backend):

```bash
docker-compose up --build
```
The backend will be available at `http://localhost:5000`.

## 🛠 Manual Setup

### 1. Database
- Ensure PostgreSQL is running.
- Create a database named `analytics`.

### 2. Backend
```bash
cd backend
npm install
# Update .env with your DB credentials
npm run start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Seed Data
```bash
cd backend
node seed/seed.js
```

## 🏗 Architecture & Trade-offs

### High Performance Architecture
To avoid "brute force" scans for analytics:
1. **Pre-Aggregation**: Every event ingestion atomically updates a `Metric` row (platform-wide) and/or a `UserTotal` row (user-specific). This turns complex `O(N)` queries into `O(1)` primary-key lookups.
2. **Efficient Top-K**: Instead of sorting the entire event table, we maintain a separate `user_totals` table with an index on `(platform, total_amount)`. Finding the top K users is a simple indexed range scan.
3. **In-Memory Caching**: Analytics results are cached for 30 seconds with automatic invalidation upon new event ingestion for that platform.
4. **Sliding Window**: Computed on-the-fly from the `events` table but restricted by a `timestamp` index to ensure performance even with millions of rows.

### Technology Choice: Sequelize ORM
- Used for modularity and database abstraction.
- Tables are automatically created/synced on startup (`sequelize.sync()`).

## 🧪 API Documentation

### Ingestion
- `POST /events`: Ingest single event.
- `POST /events/bulk`: Ingest array of events.
- *Bonus*: Rate limited to 100 req/min/IP.

### Analytics
- `GET /metrics?platform=amazon`: Platform-wide stats (O(1)).
- `GET /top-users?platform=amazon&k=5`: Top K payers.
- `GET /metrics/window?platform=amazon&minutes=5`: Last N minutes rolling view.

## 📝 Scaling for High Traffic
To scale this further:
1. **Message Queue**: Use Kafka/RabbitMQ to buffer incoming events so ingestion doesn't block on DB writes.
2. **TimescaleDB/Hypertable**: Use PostgreSQL extensions specifically designed for time-series data storage and compression.
3. **Redis Caching**: Replace in-memory cache with a shared Redis cluster for multi-pod consistency.
4. **Materialized Views**: Use Postgres materialized views for complex historical aggregations.
