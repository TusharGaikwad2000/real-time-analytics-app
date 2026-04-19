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
    console.log('Database connected successfully.');
    // Sync models
    await sequelize.sync({ force: false }); // Set to true to drop tables on every startup
    console.log('Models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  ...models,
  sequelize,
  initDb
};
