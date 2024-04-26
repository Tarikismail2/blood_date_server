const express = require('express');
const router = express.Router();
const { AddAppointment, checkAvailability, getUserAppointments, findAllAppointments ,countAppointmentsByCenterId } = require('../controllers/appointmentsController');
const verifyToken = require('../middleware/verifyToken');
const Appointment = require('../models/Appointment'); 

router.post('/Add-appointment', AddAppointment);

router.post("/check-availability", checkAvailability);

router.get("/my-appointments", verifyToken, getUserAppointments);

router.get('/find_appointment', findAllAppointments);

router.post('/count-appointments', countAppointmentsByCenterId);


router.put('/edit_status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        console.log('Error updating appointment status:', error);
        res.status(500).json({ error: 'Error updating appointment status' });
    }
});

module.exports = router;
