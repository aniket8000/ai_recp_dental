// backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    treatment: { type: String, required: true },
    clinicKey: { type: String, required: true },
    datetime: { type: Date, required: true },
    calendarEventId: { type: String },
    confirmationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
