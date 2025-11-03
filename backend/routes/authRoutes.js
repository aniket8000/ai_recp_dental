/**
 * routes/authRoutes.js
 * Google OAuth endpoints to connect Calendar.
 *
 * - GET  /api/auth/google         -> redirect to Google consent
 * - GET  /api/auth/google/callback -> stores tokens in MongoDB
 */

const express = require("express");
const { google } = require("googleapis");
const Token = require("../models/Token");

const router = express.Router();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar",
];

function createOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Google OAuth env variables not set");
  }
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

// Start OAuth - redirect user to Google's consent screen
router.get("/google", async (req, res) => {
  try {
    const oauth2Client = createOAuthClient();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    });
    res.redirect(authUrl);
  } catch (err) {
    console.error("Auth start error:", err.message);
    res.status(500).send("Failed to start OAuth");
  }
});

// OAuth callback - save tokens in DB
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send("Missing code");

    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens to DB (single record for demo). Overwrites previous tokens.
    let doc = await Token.findOne();
    if (!doc) doc = new Token();
    doc.access_token = tokens.access_token;
    doc.refresh_token = tokens.refresh_token;
    doc.scope = tokens.scope;
    doc.token_type = tokens.token_type;
    doc.expiry_date = tokens.expiry_date;
    await doc.save();

    // ✅ Use environment variable FRONTEND_URL (fallback for local dev)
    const frontend =
      process.env.FRONTEND_URL || "http://localhost:5173";

    res.send(`
      <h3>✅ Google Calendar connected successfully!</h3>
      <p>You can now close this tab and return to the app:</p>
      <a href="${frontend}" target="_blank">${frontend}</a>
    `);
  } catch (err) {
    console.error("OAuth callback error:", err.message);
    res.status(500).send("OAuth callback failed");
  }
});

module.exports = router;
