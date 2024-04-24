const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const SlotLabel = sequelize.define('SlotLabel', {
  slotName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = SlotLabel;
