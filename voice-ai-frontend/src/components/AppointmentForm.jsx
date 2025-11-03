import { useState } from "react";
import axios from "axios";
import "./AppointmentForm.css";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    treatment: "",
    clinicKey: "",
    datetime: "",
  });
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/appointments/book", form);
      setConfirmation(res.data.appointment);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBooking = () => {
    setConfirmation(null);
    setForm({
      name: "",
      email: "",
      treatment: "",
      clinicKey: "",
      datetime: "",
    });
  };

  // ---------------- Confirmation View ----------------
  if (confirmation) {
    return (
      <div className="appointment-background">
        <div className="floating-orb orb1"></div>
        <div className="floating-orb orb2"></div>

        <div className="appointment-card fade-in">
          <h2 className="confirmation-title">✅ Appointment Confirmed!</h2>

          <div className="confirmation-box">
            <p>
              {confirmation.name}, your <b>{confirmation.treatment}</b> appointment is booked for{" "}
              <b>
                {new Date(confirmation.datetime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </b>{" "}
              at <b>{confirmation.clinicKey}</b> clinic.
            </p>

            {confirmation.calendarLink ? (
              <a
                href={confirmation.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-link"
              >
                📅 View in Google Calendar
              </a>
            ) : (
              <p className="warning">⚠️ Could not generate Google Calendar link.</p>
            )}

            <button className="back-btn" onClick={handleBackToBooking}>
              ← Back to Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Booking Form View ----------------
  return (
    <div className="appointment-background">
      <div className="floating-orb orb1"></div>
      <div className="floating-orb orb2"></div>

      <div className="appointment-card fade-in">
        <h1 className="form-title">🦷 Book Your Appointment</h1>

        <form onSubmit={handleSubmit} className="appointment-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
          />

          <select
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            required
          >
            <option value="">Select Treatment</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Root Canal">Root Canal</option>
            <option value="Whitening">Teeth Whitening</option>
            <option value="Consultation">General Consultation</option>
          </select>

          <select
            name="clinicKey"
            value={form.clinicKey}
            onChange={handleChange}
            required
          >
            <option value="">Select Clinic</option>
            <option value="bandra">Bandra</option>
            <option value="andheri">Andheri</option>
            <option value="goregaon">Goregaon</option>
            <option value="chembur">Chembur</option>
          </select>

          <input
            type="datetime-local"
            name="datetime"
            value={form.datetime}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
