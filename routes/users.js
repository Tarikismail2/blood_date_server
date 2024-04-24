const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { checkUserExists, insertUser } = require('../controllers/usersController');
// the accolade is very important
const sequelize = require('../database');
const  User  = require( '../models/User') ;
const  SlotLabel  = require( '../models/SlotLabel') ;
const Appointment =require('../models/Appointment');
const Center =require('../models/Center');

const verifyToken = require('../middleware/verifyToken');
const { JWT_SECRET } = require('../middleware/config');

// // Generation of a random token for resetting the password
// const generateSecretKey = () => {
//     return crypto.randomBytes(64).toString('hex');
// }
// const JWT_SECRET = generateSecretKey();
const saltRounds = 10;

// Register endpoint
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ firstName, lastName, email, mobile, password: encryptedPassword });
        res.status(201).json({ status: "ok", data: "User created" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Error during registration" });
    }
});

router.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request for email:", email);
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET);
        console.log("Login successful for email:", email);
        return res.status(200).json({ status: "ok", data: token, userType: user.userType });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Error during login" });
    }
});


router.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; // Récupérer l'ID de l'utilisateur à partir du token décodé
        const userData = await User.findByPk(userId); // Recherche de l'utilisateur par ID dans la base de données
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ status: "Ok", data: userData });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Error fetching user data" });
    }
});


router.get('/:userId/appointments', verifyToken, async (req, res) => {
    const userId = req.params.userId;

    try {
        const appointments = await Appointment.findAll({
            where: { userId },
            include: [{ model: Center }, { model: User }, { model: SlotLabel }]
        });

        const data = {
            appointments
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching appointments.' });
    }
});




// Logout route
router.post('/logout', (req, res) => {
    try {
        res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
    }
});


module.exports = router;
