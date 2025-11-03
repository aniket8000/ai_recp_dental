/**
 * server.js
 * Entry point for the Voice AI Receptionist backend.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const ttsRoutes = require("./routes/ttsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Dynamic Frontend URL for CORS
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/tts", ttsRoutes);
app.use("/api/voice", voiceRoutes);

// ✅ Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🌐 Allowed Origin: ${allowedOrigin}`);
});
