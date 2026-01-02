const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const SimulationScene = sequelize.define('SimulationScene', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contexts: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object containing context configurations'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'simulation_scenes',
  timestamps: false
});

module.exports = SimulationScene;
