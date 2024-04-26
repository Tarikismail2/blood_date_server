const Appointment = require('../models/Appointment');
const Center = require('../models/Center'); 
const SlotLabel = require('../models/SlotLabel'); 
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const AddAppointment = async (req, res) => {
    const { userId, centerId, slotId, date, status } = req.body; 
    try {
        const appointment = await Appointment.create({ userId, centerId, slotId, date, status });

        res.status(201).json({ message: 'Rendez-vous réservé avec succès', appointment });
    } catch (error) {
        console.log('Erreur lors de la réservation du rendez-vous :', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la réservation du rendez-vous. Veuillez réessayer.' });
    }
};


const checkAvailability = async (centerId, date, slotId) => {
    try {
        const appointment = await Appointment.findAll({ where: { centerId, date, slotId } });
        return !appointment; 
    } catch (error) {
        console.log('Erreur lors de la vérification de la disponibilité:', error);
        throw new Error('Erreur lors de la vérification de la disponibilité');
    }
};


const getUserAppointments = async (req, res) => {
    try {
      
        const authToken = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        const userId = decoded.id;

        const appointments = await Appointment.findAll({ where: { userId } });

        res.status(200).json({ status: 'Ok', data: appointments });
    } catch (error) {
        console.log('Erreur lors de la récupération des rendez-vous de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous de l\'utilisateur' });
    }
};


const findAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: User, attributes: ['firstName'] },
                { model: User, attributes: ['lastName'] },
                { model: Center, attributes: ['center_name'] }, 
                { model: SlotLabel, attributes: ['label'] } 
            ]
        });
        res.json(appointments);
    } catch (error) {
        console.log('Error fetching appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching appointments.' });
    }
}

const countAppointmentsByCenterId = async (req, res) => {
    const { centerId, slotId, date } = req.body;
    // console.log(centerId, slotId, date);
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(newDate.getDate()).padStart(2, '0');
    const hour = String(newDate.getHours()).padStart(2, '0'); 
    const minute = String(newDate.getMinutes()).padStart(2, '0'); 
    const second = String(newDate.getSeconds()).padStart(2, '0'); 

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    
    try {
        const count = await Appointment.findAll({
            where: {
                centerId: centerId,
                slotId: slotId,
                date: formattedDate
            }
        });
        // console.log(count);
        res.status(200).json({ count: count.length });
    } catch (error) {
        console.log('Error counting appointments by center ID:', error);
        res.status(500).json({ error: 'Error counting appointments by center ID' });
    }
};


module.exports = {
    AddAppointment,
    checkAvailability,
    getUserAppointments,
    findAllAppointments,
    countAppointmentsByCenterId 
};
