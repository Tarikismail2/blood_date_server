const express = require('express');
const router = express.Router();
const { findAllSlots } = require('../controllers/slotsController');
const SlotLabel = require('../models/SlotLabel'); 

router.get('/find_slots', findAllSlots);

router.get('/find_slot', async (req, res) => {
    const { slotId } = req.query;

    try {
        const slot = await SlotLabel.findOne({ where: { id: slotId } });
        if (slot) {
            res.status(200).json({ id: slot.id });
        } else {
            res.status(404).json({ error: 'Slot not found' });
        }
    } catch (error) {
        console.log('Error finding slot:', error);
        res.status(500).json({ error: 'Error finding slot' });
    }
});


module.exports = router;
