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

// ✅ Normalize frontend URL (remove trailing slash if exists)
const allowedOrigin = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

// ✅ Enhanced CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      const whitelist = [allowedOrigin, "http://localhost:5173"];
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from: ${origin}`);
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/tts", ttsRoutes);
app.use("/api/voice", voiceRoutes);

// ✅ Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    origin: allowedOrigin,
    time: new Date().toISOString(),
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🌐 Allowed Frontend Origin: ${allowedOrigin}`);
});
