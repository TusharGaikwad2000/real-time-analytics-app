const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserTotal = sequelize.define('UserTotal', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    field: 'user_id'
  },
  platform: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_amount'
  }
}, {
  tableName: 'user_totals',
  timestamps: false,
  indexes: [
    {
      fields: ['platform', 'total_amount']
    }
  ]
});

module.exports = UserTotal;
