const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ContextThreshold = sequelize.define('ContextThreshold', {
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
  context: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  warningMin: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  warningMax: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  criticalMin: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  criticalMax: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  customLabel: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'context_thresholds',
  timestamps: false
});

module.exports = ContextThreshold;
