// backend/utils/dateUtils.js
const chrono = require('chrono-node');
const { DateTime } = require('luxon');

/**
 * Convert user-entered or AI-generated time strings to clean ISO timestamps.
 * Supports relative terms like "tomorrow 5 PM".
 */
function normalizeDate(input, tz = 'Asia/Kolkata') {
  if (!input) return { iso: null, human: null };

  let parsedDate = null;

  // If already ISO
  if (!isNaN(Date.parse(input))) {
    parsedDate = new Date(input);
  } else {
    const parsed = chrono.parseDate(input, new Date(), { forwardDate: true });
    if (parsed) parsedDate = parsed;
  }

  if (!parsedDate) return { iso: null, human: null };

  const dt = DateTime.fromJSDate(parsedDate).setZone(tz);
  return {
    iso: dt.toUTC().toISO(),
    human: dt.toFormat('dd LLL yyyy, hh:mm a'),
  };
}

module.exports = { normalizeDate };
