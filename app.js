var express = require('express');
var app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));


const headers = new Headers();
headers.append("Accept", "application/json");
headers.append('Accept-Encoding', 'gzip, deflate, br');

var con = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: '',
  database: 'servicedb'
});

// generation the random token for resetting the password
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
}
const JWT_SECRET = '6b8dc47c7b7b23a90c9dee861257ece5379ec070fef3c83fe852a29514da0483f24e5440d0f9744799812427738da7c0fb0879e9e48b3c1af9752a15fb4e9076';
saltRounds=10;
// Register endpoint
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  
  try {
    // Check if the user already exists
    const existingUser = await checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    // Insert the new user into the database
    await insertUser(firstName, lastName, email, mobile, encryptedPassword);
    res.status(201).json({ status: "ok", data: "User created" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Error during registration" });
  }
});

// Function to check if the user already exists
const checkUserExists = (email) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

// Function to insert a new user into the database
const insertUser = (firstName, lastName, email, mobile, encryptedPassword) => {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO users (firstName, lastName, email, mobile, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, mobile, encryptedPassword],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Login endpoint
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  try {
    con.query("SELECT * FROM users WHERE email = ?", [email], async (error, results) => {
      if (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Error during login" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
      const token = jwt.sign({ email: user.email ,id: user.id }, JWT_SECRET); // Inclure l'e-mail de l'utilisateur dans le token JWT
      return res.status(200).json({ status: "ok", data: token, userType: user.userType });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

// Route pour obtenir les données de l'utilisateur avec MySQL
app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    // Décoder le token JWT pour obtenir l'e-mail de l'utilisateur
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    con.query("SELECT * FROM users WHERE email = ?", [userEmail], (error, results) => {
      if (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Error fetching user data" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const userData = results[0];
      console.log(userData);
      return res.json({ status: "Ok", data: userData });
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Error fetching user data" });
  }
});


// Endpoint pour réserver un rendez-vous
app.post('/book-appointment', (req, res) => {
  const { userId, centerName, timeSlot, date ,status} = req.body;

  // Insérer les données de rendez-vous dans la base de données
  const sql = `INSERT INTO appointments (user_id, center_Name, date, time_slot,status) VALUES (?, ?, ?, ?, ?)`;
  con.query(sql, [userId, centerName, date, timeSlot,status], (err, result) => {
    if (err) {
      console.error('Erreur lors de la réservation du rendez-vous :', err);
      res.status(500).json({ message: 'Une erreur est survenue lors de la réservation du rendez-vous. Veuillez réessayer.' });
      return;
    }
    console.log('Rendez-vous réservé avec succès');
    res.status(200).json({ message: 'Rendez-vous réservé avec succès' });
  });
});

// Route pour vérifier la disponibilité d'un créneau horaire
app.post("/check-availability", async (req, res) => {
  const { centerName, date, timeSlot } = req.body;
  try {
    const isAvailable = await checkAvailabilityInDatabase(centerName, date, timeSlot);
    res.status(200).json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Error checking availability" });
  }
});
const checkAvailabilityInDatabase = (centerName, date, timeSlot) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM appointments WHERE center_Name = ? AND date = ? AND time_slot = ?", [centerName, date, timeSlot], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length === 0); 
      }
    });
  });
};


// Route pour la déconnexion
app.post('/logout', (req, res) => {
  try {
    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
  }
});


// Route pour récupérer les rendez-vous de l'utilisateur avec MySQL
app.get("/my-appointments", async (req, res) => {
  try {
    // Vérifier si l'utilisateur est authentifié en vérifiant le token JWT dans l'en-tête Authorization
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extraire le token JWT de l'en-tête Authorization
    const tokenParts = token.split(" ");
    const authToken = tokenParts[1];

    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(authToken, JWT_SECRET);
    const userEmail = decoded.email;

    // Récupérer l'ID de l'utilisateur à partir de la base de données en fonction de son email
    con.query("SELECT * FROM users WHERE email = ?", [userEmail], (error, results) => {
      if (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Error fetching user data" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const userId = results[0].id;

      // Récupérer les rendez-vous de l'utilisateur en fonction de son ID
      con.query("SELECT * FROM appointments WHERE user_id = ?", [userId], (error, results) => {
        if (error) {
          console.error("Error fetching user appointments:", error);
          return res.status(500).json({ error: "Error fetching user appointments" });
        }
        return res.status(200).json({ status: "Ok", data: results });
      });
    });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return res.status(500).json({ error: "Error fetching user appointments" });
  }
});



// Middleware pour vérifier le jeton
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });
    req.user = decoded;
    next();
  });
}
// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.send({ auth: true, message: 'Protected route accessed successfully.', user: req.user });
});

// Start the server
var server = app.listen(5002, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("start");
});

con.connect(function (error) {
  if (error) console.log(error);
  else console.log("connected");
});
