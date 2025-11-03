/**
 * routes/chatRoutes.js
 * Unified chat endpoint — now resilient and compatible with voice + text.
 */

const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const { parseAssistantReply } = require('../services/geminiService');
const { createCalendarEvent } = require('../services/calendarService');
const { synthesizeSpeech } = require('../services/ttsService');

// ✅ POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    // Accept both text and message keys for safety
    const userText = req.body.text || req.body.message;

    if (!userText || typeof userText !== 'string') {
      console.warn("⚠️ Invalid request body:", req.body);
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Request must include a "text" or "message" field (string)',
      });
    }

    // 1️⃣ Parse message through Gemini
    const parsed = await parseAssistantReply(userText);
    // { intent: 'reply'|'book_appointment', details: {...}, responseText: '...' }

    // 2️⃣ Handle appointment booking
    if (parsed.intent === 'book_appointment') {
      const { name, treatment, clinicKey, datetime } = parsed.details || {};

      // Missing info
      if (!name || !treatment || !clinicKey || !datetime) {
        const reply =
          'I need your name, treatment, clinic, and date/time to confirm the booking. Please share those details.';
        const ttsUrl = await synthesizeSpeech(reply);
        return res.json({ intent: 'need_info', text: reply, ttsUrl });
      }

      // Create calendar event
      const startISO = new Date(datetime).toISOString();
      const endISO = new Date(new Date(datetime).getTime() + 30 * 60000).toISOString();

      const eventRes = await createCalendarEvent({
        summary: `${treatment} - ${name}`,
        description: 'Booked via AI receptionist',
        startDateTimeISO: startISO,
        endDateTimeISO: endISO,
        clinicKey,
        patientName: name,
      });

      // Save booking
      await new Booking({
        patientName: name,
        treatment,
        clinicKey,
        datetime: new Date(datetime),
        status: eventRes.success ? 'confirmed' : 'failed',
        googleEventId: eventRes.eventId || null,
      }).save();

      const replyText = eventRes.success
        ? `✅ Done! Your ${treatment} appointment is confirmed for ${new Date(
            datetime
          ).toLocaleString()} at our ${clinicKey} clinic.`
        : `❌ Sorry, I couldn’t confirm that slot (${eventRes.error || 'unknown error'}).`;

      const ttsUrl = await synthesizeSpeech(replyText);
      return res.json({ intent: 'book_appointment', text: replyText, ttsUrl, result: eventRes });
    }

    // 3️⃣ Normal conversational reply
    const reply = parsed.responseText || "Sorry, I didn't quite catch that.";
    const ttsUrl = await synthesizeSpeech(reply);
    return res.json({ intent: parsed.intent || 'reply', text: reply, ttsUrl });
  } catch (err) {
    console.error('💥 Chat handler error:', err);
    res.status(500).json({
      error: 'server_error',
      message: err.message || 'Unexpected failure in chat route.',
    });
  }
});

module.exports = router;
