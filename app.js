var express = require('express');
var app = express();

// var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = require('./database');
const userRoutes = require('./routes/users');
const centerRoutes = require('./routes/centers');
const appointmentRoutes = require('./routes/appointments');
const slotsRoutes = require('./routes/slots');

const { insertSlotLabels } = require('./models/InsertSlot');

// insertSlotLabels();


app.use('/users', userRoutes);

app.use('/centers', centerRoutes);

app.use('/appointments', appointmentRoutes);

app.use('/slots', slotsRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(5002, () => {
      console.log("Server is running on port 5002");
  });
});
