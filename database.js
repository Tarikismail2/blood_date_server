const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('DBservice', 'root', '', {
  host: 'localhost',
  port: '3307',
  dialect: 'mysql', //peut être 'mysql', 'sqlite', 'postgres', 'mssql', etc.
  logging: false 
});

// Vérifier la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

