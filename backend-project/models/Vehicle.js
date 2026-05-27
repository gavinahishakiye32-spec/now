const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleName: { type: String, required: true },
  plateNumber: { type: String, required: true, unique: true },
  model:       { type: String, required: true },
  fuelType:    { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  capacity:    { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
