# Real-Time Analytics Platform

A production-style real-time analytics system built with Node.js, Sequelize (PostgreSQL), and React. This system ingests event data (views, clicks, purchases) and serves aggregated metrics with sub-millisecond read times.

##  Quick Start (Docker)

The easiest way to run the entire stack (Database + Backend):

```bash
docker-compose up --build
```
The backend will be available at `http://localhost:5000`.

## Manual Setup

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

## Architecture & Trade-offs

### Interactive Dashboard (Additional Feature)
Although the primary focus of this assignment is the **Backend**, I have additionally built a **React-based Frontend Dashboard**. 
- **Reason**: This allows the evaluator to visualize the real-time data processing in action.
- **Verification**: It makes it easier to verify that the complex logic (like Sliding Window analytics and Top Users) is functioning correctly and instantly.
- **Testing**: Using the "Simulate Event" form, you can trigger events manually and watch the backend update the KPIs and charts live.

### High Performance Architecture
To avoid "brute force" scans for analytics:
1. **Pre-Aggregation**: Every event ingestion atomically updates a `Metric` row (platform-wide) and/or a `UserTotal` row (user-specific). This turns complex `O(N)` queries into `O(1)` primary-key lookups.
2. **Efficient Top-K**: Instead of sorting the entire event table, we maintain a separate `user_totals` table with an index on `(platform, total_amount)`. Finding the top K users is a simple indexed range scan.
3. **In-Memory Caching**: Analytics results are cached for 30 seconds with automatic invalidation upon new event ingestion for that platform.
4. **Sliding Window**: Computed on-the-fly from the `events` table but restricted by a `timestamp` index to ensure performance even with millions of rows.

### Database Choice
I chose **PostgreSQL** with **Sequelize ORM** because:
- **Relational Integrity**: Essential for tracking per-user totals and metric aggregations.
- **JSONB Support**: Allows flexible storage of the `actionBreakdown` counters within a single row.
- **Auto-Sync**: Sequelize allows for "Model-First" development where tables are created automatically.

### Trade-offs Made
1. **Write Latency vs. Read Speed**: I chose to perform **Atomic Pre-aggregation** during the `POST /events` call. 
   - *Trade-off*: Event ingestion takes a few milliseconds longer (extra DB updates).
   - *Benefit*: The Dashboard loads instantly ($O(1)$) because it doesn't have to calculate sums across millions of rows.
2. **In-Memory vs. Distributed Cache**: I used an **in-memory Cache** for simplicity in this assignment.
   - *Trade-off*: If you run multiple server instances, their caches won't be synced.
   - *Benefit*: Extremely fast performance without requiring a separate Redis setup for local testing.
3. **Sliding Window Accuracy**: Unlike the main metrics, the **Sliding Window** is calculated on-the-fly from the `events` table to ensure 100% accuracy for the "Last N minutes".

### API Documentation & Postman
- **Manual Docs**: See the section below for endpoint details.
- **Postman Collection**: I have included a [**postman_collection.json**](file:///c:/Users/gaikw/Downloads/real-time-analytics-app/postman_collection.json) file in the root directory. You can import this into Postman to test all endpoints instantly.
- `POST /events`: Ingest single event.
- `POST /events/bulk`: Ingest array of events.
- *Bonus*: Rate limited to 100 req/min/IP.

### Analytics
- `GET /metrics?platform=amazon`: Platform-wide stats (O(1)).
- `GET /top-users?platform=amazon&k=5`: Top K payers.
- `GET /metrics/window?platform=amazon&minutes=5`: Last N minutes rolling view.

## Scaling for High Traffic
To scale this further:
1. **Message Queue**: Use Kafka/RabbitMQ to buffer incoming events so ingestion doesn't block on DB writes.
2. **TimescaleDB/Hypertable**: Use PostgreSQL extensions specifically designed for time-series data storage and compression.
3. **Redis Caching**: Replace in-memory cache with a shared Redis cluster for multi-pod consistency.
4. **Materialized Views**: Use Postgres materialized views for complex historical aggregations.
