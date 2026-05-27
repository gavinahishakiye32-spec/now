const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all vehicles
router.get('/', requireAuth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create vehicle
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Plate number already exists' });
    res.status(400).json({ message: err.message });
  }
});

// PUT update vehicle
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Plate number already exists' });
    res.status(400).json({ message: err.message });
  }
});

// DELETE vehicle
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
