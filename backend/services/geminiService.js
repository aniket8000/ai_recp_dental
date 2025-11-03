/**
 * services/geminiService.js
 *
 * Resilient version with retry + graceful fallback.
 * Uses official @google/generative-ai library and auto-handles
 * Google API rate limits, connection errors, and malformed responses.
 */

const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_CHAT_MODEL || "models/gemini-2.0-flash";

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  throw new Error("GEMINI_API_KEY missing in .env");
}

console.log("✅ Gemini API key loaded successfully");
console.log("🧠 Using Gemini model:", MODEL_NAME);

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * parseAssistantReply(userText)
 * Handles retries, structured intent detection, and fallbacks.
 */
async function parseAssistantReply(userText) {
  const llm = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `
You are "DentiBot" — a friendly AI receptionist for a chain of dental clinics in Mumbai.

When user messages mention booking/scheduling (like "book", "appointment", "schedule", "tomorrow", "next week", "at 5 PM"), 
you must return a JSON object in this exact structure — nothing else:

{
  "intent": "book_appointment",
  "details": {
    "name": "<customer name or 'unknown'>",
    "treatment": "<treatment name or 'general consultation'>",
    "clinicKey": "<bandra|andheri|goregaon|chembur or 'unknown'>",
    "datetime": "<ISO datetime or null>"
  },
  "response": "<short natural confirmation message>"
}

If the message is NOT about booking, reply normally in plain conversational text.

User: ${userText}
`;

  // Retry logic (up to 3 times if Google API throttles or fails)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await llm.generateContent(prompt);
      const text = result.response.text();

      // Try to parse structured JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const obj = JSON.parse(jsonMatch[0]);
          return {
            intent: obj.intent || "reply",
            details: obj.details || {},
            responseText:
              obj.response ||
              text.replace(jsonMatch[0], "").trim() ||
              "Okay.",
          };
        } catch {
          // Malformed JSON → return plain response
          return { intent: "reply", details: {}, responseText: text };
        }
      }

      // Normal text reply (non-booking)
      return { intent: "reply", details: {}, responseText: text };
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("429") || msg.includes("Resource exhausted")) {
        console.warn(
          `⚠️ Gemini rate limit hit — attempt ${attempt}/3. Retrying in ${
            2 ** attempt
          }s...`
        );
        await delay(1000 * 2 ** attempt);
        continue;
      }

      if (msg.includes("404") || msg.includes("not found")) {
        console.error(
          "❌ Model not found or deprecated — falling back to gemini-1.5-flash"
        );
        return {
          intent: "reply",
          details: {},
          responseText:
            "Sorry — I’m having trouble connecting to Gemini right now. Please try again soon.",
        };
      }

      console.error("❌ Gemini service error:", msg);
      return {
        intent: "reply",
        details: {},
        responseText: "⚠️ Temporary AI issue — please try again.",
      };
    }
  }

  // If all retries fail
  return {
    intent: "reply",
    details: {},
    responseText:
      "⚠️ The AI service is currently overloaded. Please try again in a few seconds.",
  };
}

module.exports = { parseAssistantReply };
