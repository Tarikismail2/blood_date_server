const SlotLabel = require('../models/SlotLabel');

const insertSlotLabels = async () => {
    try {
        await SlotLabel.bulkCreate([
            { slotName: 'slot1', label: '9:00 - 10:00' },
            { slotName: 'slot2', label: '10:00 - 11:00' },
            { slotName: 'slot3', label: '11:00 - 12:00' },
            { slotName: 'slot4', label: '15:00 - 16:00' },
            { slotName: 'slot5', label: '16:00 - 17:00' },
            { slotName: 'slot6', label: '17:00 - 18:00' },
        ]);
        console.log('Slot labels inserted successfully');
    } catch (error) {
        console.error('Error inserting slot labels:', error);
    }
};

module.exports = {
    insertSlotLabels: insertSlotLabels
};
