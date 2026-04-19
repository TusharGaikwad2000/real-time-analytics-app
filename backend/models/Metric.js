const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Metric = sequelize.define('Metric', {
  platform: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  totalEvents: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_events'
  },
  totalRevenue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_revenue'
  },
  actionBreakdown: {
    type: DataTypes.JSONB,
    defaultValue: {},
    field: 'action_breakdown'
  },
  uniqueUsers: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'unique_users' // We'll store a set of userIds here to get the count
  }
}, {
  tableName: 'metrics',
  timestamps: false
});

module.exports = Metric;
