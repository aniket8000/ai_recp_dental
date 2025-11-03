const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
    },
    treatment: {
      type: String,
      required: [true, "Treatment is required"],
    },
    clinicKey: {
      type: String,
      required: [true, "Clinic is required"],
    },
    datetime: {
      type: Date,
      required: [true, "Datetime is required"],
    },
    calendarLink: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
