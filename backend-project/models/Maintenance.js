const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle:          { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  serviceType:      { type: String, required: true },
  maintenanceCost:  { type: Number, required: true },
  maintenanceDate:  { type: Date, required: true },
  vehicleStatus:    { type: String, required: true, enum: ['Active', 'Under Maintenance', 'Out of Service'] }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
