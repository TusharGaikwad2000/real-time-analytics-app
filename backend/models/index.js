const sequelize = require('../config/database');
const Event = require('./Event');
const Metric = require('./Metric');
const UserTotal = require('./UserTotal');

const models = {
  Event,
  Metric,
  UserTotal
};

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    // Sync models
    await sequelize.sync({ force: false }); 
    console.log('✅ Models synchronized (Tables checked/created).');
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Unable to connect to the database!');
    console.error('Error Details:', error.message);
    if (error.message.includes('database')) {
      console.log(`💡 TIP: Make sure you have manually created the database named "${process.env.DB_NAME}" in your PostgreSQL server first.`);
    }
  }
};

module.exports = {
  ...models,
  sequelize,
  initDb
};
