const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id'
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  timestamp: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'events',
  timestamps: false,
  indexes: [
    {
      fields: ['platform']
    },
    {
      fields: ['timestamp']
    }
  ]
});

module.exports = Event;
