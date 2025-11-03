/**
 * routes/chatRoutes.js
 * Clean version — no voice, no calendar, pure text AI chat.
 */

const express = require("express");
const router = express.Router();
const { parseAssistantReply } = require("../services/geminiService"); // still used for AI reply

// ✅ POST /api/chat/message
router.post("/message", async (req, res) => {
  try {
    const userText = req.body.text || req.body.message;

    if (!userText || typeof userText !== "string") {
      console.warn("⚠️ Invalid request body:", req.body);
      return res.status(400).json({
        error: "Invalid input",
        message: 'Request must include a "text" or "message" field (string)',
      });
    }

    // 🔹 Step 1: Process AI response using Gemini service
    let parsed;
    try {
      parsed = await parseAssistantReply(userText);
    } catch (aiError) {
      console.error("⚠️ Gemini service failed:", aiError.message);
      return res.json({
        intent: "reply",
        text: "Sorry, the AI service is currently unavailable. Please try again later.",
      });
    }

    // 🔹 Step 2: Return clean text response
    const reply =
      parsed?.responseText ||
      parsed?.text ||
      "I'm your AI dental assistant. How can I help you today?";

    return res.json({
      intent: parsed?.intent || "reply",
      text: reply,
    });
  } catch (err) {
    console.error("💥 Chat handler error:", err);
    res.status(500).json({
      error: "server_error",
      message: err.message || "Unexpected failure in chat route.",
    });
  }
});

module.exports = router;
