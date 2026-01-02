const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ContextEvent = sequelize.define('ContextEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('temperature', 'silentMode', 'movement', 'drivingMode', 'watering', 'luminosity'),
    allowNull: false
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Event data payload'
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'context_events',
  timestamps: false
});

module.exports = ContextEvent;
