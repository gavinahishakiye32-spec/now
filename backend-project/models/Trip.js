const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  vehicle:      { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver:       { type: String, required: true },
  tripDate:     { type: Date, required: true },
  destination:  { type: String, required: true },
  fuelConsumed: { type: Number, required: true },
  tripCost:     { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
