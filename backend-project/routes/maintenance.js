const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all maintenance records
router.get('/', requireAuth, async (req, res) => {
  try {
    const records = await Maintenance.find()
      .populate('vehicle', 'vehicleName plateNumber')
      .sort({ maintenanceDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single maintenance record
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id).populate('vehicle', 'vehicleName plateNumber');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create maintenance
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const record = new Maintenance(req.body);
    await record.save();
    const populated = await record.populate('vehicle', 'vehicleName plateNumber');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update maintenance
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'vehicleName plateNumber');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE maintenance
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
