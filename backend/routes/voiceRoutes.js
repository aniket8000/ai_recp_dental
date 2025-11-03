/**
 * routes/voiceRoutes.js
 * Handles voice input → transcription → Gemini → TTS → response
 */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { synthesizeSpeech } = require("../services/ttsService");
const { parseAssistantReply } = require("../services/geminiService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 🔹 POST /api/voice/process
router.post("/process", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;

    // --- Convert audio to text using Gemini ---
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: fs.readFileSync(audioPath).toString("base64"),
        },
      },
    ]);

    const userText = result?.response?.text()?.trim();
    if (!userText) {
      fs.unlinkSync(audioPath);
      return res.status(400).json({ error: "Could not transcribe audio" });
    }

    console.log("🎤 User said:", userText);

    // --- Pass text to Gemini for processing ---
    const reply = await parseAssistantReply(userText);

    // --- Generate TTS for reply text ---
    const ttsUrl = await synthesizeSpeech(reply.responseText);

    // --- Cleanup ---
    fs.unlinkSync(audioPath);

    // --- Return both text + audio URL ---
    return res.json({
      text: reply.responseText,
      intent: reply.intent,
      details: reply.details,
      ttsUrl,
    });
  } catch (err) {
    console.error("❌ Voice processing error:", err.message);
    return res.status(500).json({ error: "Voice processing failed" });
  }
});

module.exports = router;
