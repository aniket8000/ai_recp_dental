import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="title">🦷 Welcome to SmileBright Dental Clinic</h1>
        <p className="subtitle">
          Your AI-powered dental assistant for booking, chatting, and care advice.
        </p>

        <div className="button-group">
          <Link to="/chat" className="btn start-btn">💬 Start Chat</Link>
          <Link to="/appointment" className="btn book-btn">📅 Book Appointment</Link>
        </div>
      </div>
    </div>
  );
}
