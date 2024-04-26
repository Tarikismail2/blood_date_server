const express = require('express');
const router = express.Router();
const sequelize = require('../database');
const Center = require('../models/Center');
const { JWT_SECRET } = require('../middleware/config');

router.post("/add_center", async (req, res) => {
    try {
        const { center_name, location, contact, capacity } = req.body;
        const newCenter = await Center.create({ center_name, location, contact, capacity });
        res.status(201).json(newCenter);
    } catch (error) {
        console.error("Error creating center:", error);
        res.status(500).json({ message: "Error creating center" });
    }
});


router.get('/find_center', async (req, res) => {
    try {
      const centers = await Center.findAll();
      res.json(centers);
    } catch (error) {
      console.log('Error fetching centers:', error);
      res.status(500).json({ error: 'Error fetching centers' });
    }
  });
  
  
  router.put('/edit_center/:id', async (req, res) => {
    const { center_name, location, contact, capacity } = req.body;
    try {
      const center = await Center.findByPk(req.params.id);
      if (!center) {
        return res.status(404).json({ error: 'Center not found' });
      }
      center.center_name = center_name;
      center.location = location;
      center.contact = contact;
      center.capacity = capacity;
      await center.save();
      res.json(center);
    } catch (error) {
      console.log('Error updating center:', error);
      res.status(500).json({ error: 'Error updating center' });
    }
  });
  

  router.delete('/delete_center/:id', async (req, res) => {
    try {
      const center = await Center.findByPk(req.params.id);
      if (!center) {
        return res.status(404).json({ error: 'Center not found' });
      }
      await center.destroy();
      res.json({ message: 'Center deleted successfully' });
    } catch (error) {
      console.log('Error deleting center:', error);
      res.status(500).json({ error: 'Error deleting center' });
    }
  });


module.exports = router;
