/**
 * server.js
 * Entry point for the Voice AI Receptionist backend.
 *
 * - Loads environment variables
 * - Connects to MongoDB
 * - Registers auth, chat & appointment routes
 * - Starts Express server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); // ✅ new route added
const voiceRoutes = require('./routes/voiceRoutes');
const ttsRoutes = require("./routes/ttsRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes); // <-- NEW booking route
app.use("/api/tts", ttsRoutes);
app.use("/api/voice", voiceRoutes);


// ✅ Health check
app.get("/health", (req, res) =>
  res.json({ status: "ok", ts: new Date().toISOString() })
);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
