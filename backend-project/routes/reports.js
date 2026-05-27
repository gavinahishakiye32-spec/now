const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const { requireAuth } = require('../middleware/auth');

// GET daily fleet status report
// Returns: VehicleName, FuelConsumed (today), MaintenanceStatus, VehicleAvailability
router.get('/fleet-status', requireAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const vehicles = await Vehicle.find();

    const report = await Promise.all(vehicles.map(async (v) => {
      // Total fuel consumed today
      const trips = await Trip.find({ vehicle: v._id, tripDate: { $gte: start, $lte: end } });
      const fuelConsumed = trips.reduce((sum, t) => sum + t.fuelConsumed, 0);

      // Latest maintenance status
      const latestMaintenance = await Maintenance.findOne({ vehicle: v._id }).sort({ maintenanceDate: -1 });
      const maintenanceStatus = latestMaintenance ? latestMaintenance.vehicleStatus : 'No Record';

      // Availability: Active if not Under Maintenance or Out of Service
      const availability = (!latestMaintenance || latestMaintenance.vehicleStatus === 'Active') ? 'Available' : 'Unavailable';

      return {
        vehicleName: v.vehicleName,
        plateNumber: v.plateNumber,
        fuelConsumed,
        maintenanceStatus,
        availability
      };
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET daily trip report
router.get('/daily-trips', requireAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({ tripDate: { $gte: start, $lte: end } })
      .populate('vehicle', 'vehicleName plateNumber fuelType');

    const totalCost = trips.reduce((sum, t) => sum + t.tripCost, 0);
    const totalFuel = trips.reduce((sum, t) => sum + t.fuelConsumed, 0);

    res.json({ trips, totalCost, totalFuel, date: start });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
