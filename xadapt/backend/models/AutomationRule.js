const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const AutomationRule = sequelize.define('AutomationRule', {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  conditions: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of condition objects with context, operator, and value'
  },
  actions: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of action objects with context and action'
  },
  lastTriggered: {
    type: DataTypes.DATE,
    allowNull: true
  },
  triggerCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'automation_rules',
  timestamps: false
});

module.exports = AutomationRule;
