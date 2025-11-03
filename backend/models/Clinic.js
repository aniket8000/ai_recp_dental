/**
 * Clinic model - holds clinic metadata
 */

const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // short id: bandra, andheri, etc.
  name: { type: String, required: true },
  address: String,
  contact: String
});

module.exports = mongoose.model('Clinic', ClinicSchema);
