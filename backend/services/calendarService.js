/**
 * services/calendarService.js
 * Handles creation of Google Calendar events using a service account.
 */
const { google } = require("googleapis");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendarId = process.env.GOOGLE_CALENDAR_ID;
const keyFile = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH);

// Auth client
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: "v3", auth });

async function createCalendarEvent({ name, treatment, clinicKey, datetime }) {
  try {
    const eventStart = new Date(datetime);
    const eventEnd = new Date(eventStart.getTime() + 30 * 60000); // 30 minutes

    const event = {
      summary: `Dental Appointment - ${treatment}`,
      description: `Patient: ${name}\nClinic: ${clinicKey}`,
      start: {
        dateTime: eventStart.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: eventEnd.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log(`✅ Google Calendar Event Created: ${response.data.htmlLink}`);
    return response.data.htmlLink;
  } catch (error) {
    console.error("❌ Calendar event creation failed:", error.message);
    if (error.errors) console.log(error.errors);
    return null;
  }
}

module.exports = { createCalendarEvent };
