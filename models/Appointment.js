const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Center = require('./Center');
const SlotLabel = require('../models/SlotLabel');

const Appointment = sequelize.define('Appointment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  centerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Center,
      key: 'id'
    }
  },
  slotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SlotLabel,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});



Appointment.belongsTo(User, { foreignKey: 'userId' });

Appointment.belongsTo(Center, { foreignKey: 'centerId' });

Appointment.belongsTo(SlotLabel, { foreignKey: 'slotId' });


module.exports = Appointment;
