/**
 * routes/appointmentRoutes.js
 * Handles booking appointments + Google Calendar integration
 */

const express = require("express");
const router = express.Router();
const { createCalendarEvent } = require("../services/calendarService");
const Booking = require("../models/Booking");

router.post("/book", async (req, res) => {
  try {
    const { name, email, treatment, clinicKey, datetime } = req.body;

    if (!name || !treatment || !clinicKey || !datetime) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // ✅ Create calendar event first
    const calendarLink = await createCalendarEvent({
      name,
      treatment,
      clinicKey,
      datetime,
    });

    // ✅ Save booking to DB
    const booking = await Booking.create({
      name,
      email,
      treatment,
      clinicKey,
      datetime,
      calendarLink,
    });

    console.log("✅ Appointment booked in DB:", booking.id);

    // ✅ Send full response (so frontend can use the link)
    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        id: booking.id,
        name,
        treatment,
        clinicKey,
        datetime,
        calendarLink, // <-- include here
      },
    });
  } catch (error) {
    console.error("❌ Appointment booking failed:", error);
    res.status(500).json({ error: "Server error while booking appointment" });
  }
});

module.exports = router;
