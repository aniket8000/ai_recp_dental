/**
 * routes/ttsRoutes.js
 * Simple route to turn any text into speech (Google TTS).
 */

const express = require("express");
const router = express.Router();
const { synthesizeSpeech } = require("../services/ttsService");

// POST /api/tts/speak
router.post("/speak", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const audioUrl = await synthesizeSpeech(text);
    if (!audioUrl) {
      return res.status(500).json({ error: "TTS generation failed" });
    }

    res.json({ audioUrl });
  } catch (err) {
    console.error("❌ TTS route error:", err.message);
    res.status(500).json({ error: "Server error while generating TTS" });
  }
});

module.exports = router;
