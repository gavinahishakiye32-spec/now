const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all trips (with vehicle populated)
router.get('/', requireAuth, async (req, res) => {
  try {
    const trips = await Trip.find().populate('vehicle', 'vehicleName plateNumber').sort({ tripDate: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET daily trip report - trips for a specific date
router.get('/report/daily', requireAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({ tripDate: { $gte: start, $lte: end } })
      .populate('vehicle', 'vehicleName plateNumber fuelType');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create trip
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    const populated = await trip.populate('vehicle', 'vehicleName plateNumber');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update trip
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'vehicleName plateNumber');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE trip
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
