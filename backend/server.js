require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./models');

// Routes
const eventRoutes = require('./routes/events');
const metricsRoutes = require('./routes/metrics');
const topUserRoutes = require('./routes/topUsers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventRoutes);
app.use('/metrics', metricsRoutes);
app.use('/top-users', topUserRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize DB and start server
const start = async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
