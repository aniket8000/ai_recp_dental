/**
 * utils/helpers.js
 * Misc helper utilities
 */

const { v4: uuidv4 } = require('uuid');

function generateId() {
  return uuidv4();
}

function safeDateParse(input) {
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

module.exports = { generateId, safeDateParse };
