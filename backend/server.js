/**
 * server.js
 * Clean version – no TTS or Voice routes.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Normalize frontend URL (remove trailing slash)
const allowedOrigin = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

// ✅ CORS setup
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

// ✅ Active Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Health route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    origin: allowedOrigin,
    time: new Date().toISOString(),
  });
});

// ✅ Root route fallback
app.all("/", (req, res) => {
  res.status(200).send(`
    <h2>🦷 Voice AI Receptionist Backend</h2>
    <p>Status: ✅ Running fine</p>
    <p>Allowed Frontend: ${allowedOrigin}</p>
    <p>Method: ${req.method}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `);
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🌐 Allowed Frontend Origin: ${allowedOrigin}`);
});
