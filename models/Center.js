const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Center = sequelize.define('Center', {
    center_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Center;
