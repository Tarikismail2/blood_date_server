const SlotLabel = require('../models/SlotLabel');

const findAllSlots = async (req, res) => {
    try {
        const slots = await SlotLabel.findAll();
        res.status(200).json(slots);
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ error: 'Error fetching slots' });
    }
};

module.exports = {
    findAllSlots: findAllSlots
};
